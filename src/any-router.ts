// Any Router (comfort) — a server-backed "any" node that routes one of several
// any-type inputs to a single any output.
//
// Two selection modes (a combo widget, `selection`):
//   - non_empty:    first `any_*` input that is not None wins (decided in Python).
//   - active_source: first input whose direct source node is active (not muted,
//     not bypassed) wins (decided here at prompt-build time).
//
// The node is backed by Python (py/any_router.py), so it is NOT a virtual node:
// it appears in the prompt and actually routes data. Because the Python def has
// no fixed connection inputs (the `any_*` inputs are dynamic), ComfyUI's
// auto-generated class starts with none. We augment that class in place via the
// official `beforeRegisterNodeDef` hook:
//   - add the initial pool of `any_*` inputs on create,
//   - top up the input slots for saved workflows before `configure` attaches
//     links (LiteGraph attaches saved links by index to the slots that exist),
//   - manage the input count + infer/retype ports on connection changes.
//
// Re-worked from rgthree-comfy's Any Switch (MIT).

import { app } from "/scripts/app.js";
import { MODE_NEVER, MODE_BYPASS } from "./mode-utils.js";

export const ANY_ROUTER = "Any Router (comfort)";

// Pool sizing for the `any_*` connection inputs. (The `selection` combo is a
// separate widget input and is NOT counted here.)
const MIN_ANY = 4;
const INITIAL_ANY = 5;

/** The node's `any_*` connection inputs, in order. */
function anyInputs(node: any): any[] {
  return (node.inputs || []).filter((i: any) => i && i.name && i.name.startsWith("any_"));
}

export function isComfortAnyRouter(node: any): boolean {
  return (
    node?.type === ANY_ROUTER ||
    node?.comfyClass === ANY_ROUTER ||
    node?.constructor?.comfyClass === ANY_ROUTER
  );
}

/** Next sequential `any_NN` name for a new input on this node. */
function anyName(node: any): string {
  const n = anyInputs(node).length + 1;
  return "any_" + String(n).padStart(2, "0");
}

/** The current `selection` widget value ("non_empty" | "active_source"). */
function getSelection(node: any): string {
  const w = (node.widgets || []).find((w: any) => w.name === "selection");
  return w && w.value === "active_source" ? "active_source" : "non_empty";
}

/**
 * Follow a slot's connection chain to find a concrete (non-`*`) type. Used to
 * retype this node's ports so downstream type-checking stays correct.
 */
function followType(node: any, dir: "input" | "output", slotIndex: number): string | null {
  const graph = node.graph || app.graph;
  if (!graph) return null;
  let cur: any = node;
  let idx = slotIndex;
  let d: "input" | "output" = dir;
  for (let hop = 0; hop < 12; hop++) {
    const slot = d === "input" ? cur.inputs?.[idx] : cur.outputs?.[idx];
    if (!slot) return null;
    if (slot.type != null && slot.type !== "*") return String(slot.type);
    const linkId = d === "input" ? slot.link : slot.links && slot.links[0];
    if (linkId == null) return null;
    const link = (graph.links && (graph.links.get ? graph.links.get(linkId) : graph.links[linkId])) || null;
    if (!link) return null;
    if (d === "input") {
      cur = graph.getNodeById(link.origin_id);
      idx = link.origin_slot;
      d = "output";
    } else {
      cur = graph.getNodeById(link.target_id);
      idx = link.target_slot;
      d = "input";
    }
    if (!cur) return null;
  }
  return null;
}

/** First concrete type found across the connected inputs, else `*`. */
function inferType(node: any): string {
  const inputs = node.inputs || [];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].link == null) continue;
    const t = followType(node, "input", i);
    if (t && t !== "*") return t;
  }
  return "*";
}

/**
 * Manage the `any_*` input pool + retype ports. Called on connection changes
 * and after `configure` (so a loaded workflow ends up correct). The `selection`
 * combo input is always at index 0 and is never touched.
 */
function stabilize(node: any): void {
  if (node.removed || !node.inputs) return;
  // Trim trailing unused `any_*` inputs, keeping at least MIN_ANY.
  let anyCount = anyInputs(node).length;
  while (anyCount > MIN_ANY) {
    const last = node.inputs[node.inputs.length - 1];
    if (last && last.name.startsWith("any_") && last.link == null) {
      node.removeInput(node.inputs.length - 1);
      anyCount--;
    } else {
      break;
    }
  }
  // Ensure a trailing free `any_*` input (spare to connect the next source).
  const last = node.inputs[node.inputs.length - 1];
  if (!last || !last.name.startsWith("any_") || last.link != null) {
    node.addInput(anyName(node), "*");
  }
  // Retype all `any_*` inputs + the output to the inferred concrete type.
  const type = inferType(node);
  for (const input of anyInputs(node)) input.type = type;
  for (const output of node.outputs || []) {
    output.type = type;
    output.label = String(type);
  }
}

// Per-node debounce handle for connection-change stabilization.
const pendingStabilize = new WeakMap<any, number>();
function scheduleStabilize(node: any): void {
  const prev = pendingStabilize.get(node);
  if (prev != null) window.clearTimeout(prev);
  pendingStabilize.set(
    node,
    window.setTimeout(() => {
      pendingStabilize.delete(node);
      if (!node.removed) stabilize(node);
    }, 64),
  );
}

/**
 * Augment ComfyUI's auto-generated class in place. Called once per node def from
 * the `beforeRegisterNodeDef` extension hook.
 */
export function augmentAnyRouterClass(nodeType: any): void {
  if (!nodeType || nodeType.__comfortAnyRouter) return;
  nodeType.__comfortAnyRouter = true;

  nodeType.prototype.stabilizeComfortAnyRouter = function () {
    stabilize(this);
  };

  nodeType.prototype.getHelp = function () {
    return (
      "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p>" +
      "<p><b>Non-empty:</b> the first input that is not empty wins.</p>" +
      "<p><b>Active source:</b> the first input whose source node is active " +
      "(not muted / not bypassed) wins. Mute or bypass a source to switch away " +
      "from it.</p>"
    );
  };

  // Top up input slots for saved workflows before the real configure attaches
  // links by index, then stabilize (retype) once the links are in place.
  const origConfigure = nodeType.prototype.configure;
  nodeType.prototype.configure = function (data: any) {
    try {
      // Top up the `any_*` slots to the saved count so the real configure can
      // attach saved links by index. (The `selection` combo is index 0 in both
      // the saved data and this node, so the any_* slots stay index-aligned.)
      const savedAny = ((data && data.inputs) || []).filter(
        (i: any) => i && i.name && i.name.startsWith("any_"),
      ).length;
      while (anyInputs(this).length < savedAny) {
        this.addInput(anyName(this), "*");
      }
    } catch {
      /* ignore */
    }
    const result = origConfigure ? origConfigure.call(this, data) : undefined;
    try {
      if (!this.removed) this.stabilizeComfortAnyRouter();
    } catch {
      /* ignore */
    }
    return result;
  };

  const origOnConnectionsChange = nodeType.prototype.onConnectionsChange;
  nodeType.prototype.onConnectionsChange = function (...args: any[]) {
    const r = origOnConnectionsChange
      ? origOnConnectionsChange.apply(this, args)
      : undefined;
    try {
      scheduleStabilize(this);
    } catch {
      /* ignore */
    }
    return r;
  };
}

/** Called from the `nodeCreated` hook: seed the initial `any_*` pool. */
export function setupAnyRouterNode(node: any): void {
  let guard = 0;
  while (anyInputs(node).length < INITIAL_ANY && guard++ < 24) {
    node.addInput(anyName(node), "*");
  }
  installAnyRouterHook();
}

// ---------------------------------------------------------------------------
// Build-time hook: for "active_source" routers, strip all but the first input
// whose direct source node is active, so the backend returns exactly that one.
// ---------------------------------------------------------------------------

function isActiveSource(src: any): boolean {
  return !!src && src.mode !== MODE_NEVER && src.mode !== MODE_BYPASS;
}

function postProcessPrompt(prompt: any): void {
  if (!prompt || typeof prompt !== "object") return;
  const output = prompt.output;
  const graph = app.graph;
  if (!output || !graph || !graph.nodes) return;
  for (const node of graph.nodes) {
    if (!isComfortAnyRouter(node)) continue;
    if (node.mode === MODE_NEVER || node.mode === MODE_BYPASS) continue;
    if (getSelection(node) !== "active_source") continue;
    const entry = output[node.id];
    if (!entry || !entry.inputs) continue;
    const inputs = node.inputs || [];
    let keepName: string | null = null;
    for (let i = 0; i < inputs.length; i++) {
      const src = node.getInputNode ? node.getInputNode(i) : null;
      if (isActiveSource(src)) {
        keepName = inputs[i].name;
        break;
      }
    }
    for (const key of Object.keys(entry.inputs)) {
      if (key.startsWith("any_") && key !== keepName) delete entry.inputs[key];
    }
  }
}

let hookInstalled = false;
function installAnyRouterHook(): void {
  if (hookInstalled) return;
  hookInstalled = true;
  const appAny = app as any;
  const orig = appAny.graphToPrompt;
  if (typeof orig !== "function") return;
  appAny.graphToPrompt = function (...args: any[]) {
    const result = orig.apply(appAny, args);
    if (result && typeof result.then === "function") {
      return result.then(
        (v: any) => {
          postProcessPrompt(v);
          return v;
        },
        (e: any) => {
          throw e;
        },
      );
    }
    postProcessPrompt(result);
    return result;
  };
}
