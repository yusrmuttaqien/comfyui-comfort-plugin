// Any Router (comfort): server-backed "any" node that routes one of several
// any-type inputs to a single any output. Re-worked from rgthree-comfy (MIT).

import { app } from "/scripts/app.js";
import { MODE_NEVER, MODE_BYPASS } from "./mode-utils.js";

export const ANY_ROUTER = "Any Router (comfort)";


const MIN_ANY = 4;
const INITIAL_ANY = 5;


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


function anyName(node: any): string {
  const n = anyInputs(node).length + 1;
  return "any_" + String(n).padStart(2, "0");
}


function getSelection(node: any): string {
  const w = (node.widgets || []).find((w: any) => w.name === "selection");
  return w && w.value === "active_source" ? "active_source" : "non_empty";
}


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


function inferType(node: any): string {
  const inputs = node.inputs || [];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].link == null) continue;
    const t = followType(node, "input", i);
    if (t && t !== "*") return t;
  }
  return "*";
}


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


  const origConfigure = nodeType.prototype.configure;
  nodeType.prototype.configure = function (data: any) {
    try {

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


export function setupAnyRouterNode(node: any): void {
  let guard = 0;
  while (anyInputs(node).length < INITIAL_ANY && guard++ < 24) {
    node.addInput(anyName(node), "*");
  }
  installAnyRouterHook();
}

// Build-time hook: strip non-active inputs for "active_source" routers.

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
