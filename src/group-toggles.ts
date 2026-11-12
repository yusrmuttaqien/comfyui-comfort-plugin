// Group header quick mute / bypass toggles.
//
// Small M / B buttons drawn over each group's header while that group is
// hovered or selected. Clicking M mutes / unmutes every node in the group;
// B bypasses / un-bypasses.
//
// The buttons are DOM elements (position: fixed) rather than canvas draws, so
// they stay on top of both the canvas and the DOM nodes of the modern
// (Nodes 2.0) renderer. Positions are recomputed every frame from the canvas
// view transform, so they track pan / zoom / group drags.
import { app } from "/scripts/app.js";
import { getGroupNodes } from "./mode-utils.js";

const BUTTON = 20;
const HEADER_PAD = 6;
const GAP = 6;
const MODE_ACTIVE = 0;
const MODE_MUTED = 2;
const MODE_BYPASS = 4;

interface GroupButtons {
  group: any;
  mute: HTMLDivElement;
  byp: HTMLDivElement;
}

let buttons = new Map<any, GroupButtons>();

function makeButton(label: string, cls: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "comfort-group-btn " + cls;
  el.textContent = label;
  el.style.position = "fixed";
  el.style.display = "none";
  el.style.pointerEvents = "auto";
  el.style.zIndex = "100";
  return el;
}

function ensureButtons(group: any): GroupButtons {
  let entry = buttons.get(group);
  if (entry) return entry;
  const mute = makeButton("M", "comfort-btn-mute");
  const byp = makeButton("B", "comfort-btn-byp");
  mute.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleGroup(group, "mute");
  });
  byp.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleGroup(group, "bypass");
  });
  entry = { group, mute, byp };
  buttons.set(group, entry);
  document.body.appendChild(mute);
  document.body.appendChild(byp);
  return entry;
}

function positionButton(el: HTMLDivElement, x: number, y: number, scale: number): void {
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${BUTTON * scale}px`;
  el.style.height = `${BUTTON * scale}px`;
  el.style.fontSize = `${Math.max(9, BUTTON * scale * 0.5)}px`;
}

function isHovered(group: any, mouse: number[] | null | undefined): boolean {
  if (!mouse || mouse.length < 2) return false;
  return (
    mouse[0] >= group.pos[0] &&
    mouse[0] <= group.pos[0] + group.size[0] &&
    mouse[1] >= group.pos[1] &&
    mouse[1] <= group.pos[1] + group.size[1]
  );
}

// Recompute which groups show buttons and where. Called every frame from the
// foreground hook.
function updateOverlay(): void {
  const canvas = app.canvas as any;
  const graph = canvas?.graph;
  if (!graph) return;
  const canvasEl: HTMLCanvasElement = canvas.canvas;
  const rect = canvasEl.getBoundingClientRect();
  const scale = canvas.ds.scale;
  const offset = canvas.ds.offset;
  const toX = (cx: number) => rect.left + (cx + offset[0]) * scale;
  const toY = (cy: number) => rect.top + (cy + offset[1]) * scale;

  const groups: any[] = graph._groups || [];
  const active = new Set<any>();
  for (const g of groups) {
    if (canvas.selected_group === g || isHovered(g, canvas.mouse)) active.add(g);
  }

  // Show + position active groups' buttons.
  for (const g of active) {
    const entry = ensureButtons(g);
    const right = g.pos[0] + g.size[0] - HEADER_PAD - BUTTON;
    const top = g.pos[1] + HEADER_PAD;
    positionButton(entry.mute, toX(right - GAP - BUTTON), toY(top), scale);
    positionButton(entry.byp, toX(right), toY(top), scale);
    entry.mute.style.display = "block";
    entry.byp.style.display = "block";
  }

  // Hide buttons for groups that are no longer active, and remove the DOM
  // elements entirely for groups that have been deleted from the graph.
  for (const [g, entry] of buttons) {
    if (!active.has(g)) {
      entry.mute.style.display = "none";
      entry.byp.style.display = "none";
    }
    if (!groups.includes(g)) {
      entry.mute.remove();
      entry.byp.remove();
      buttons.delete(g);
    }
  }
}

function toggleGroup(group: any, which: "mute" | "bypass"): void {
  const nodes = getGroupNodes(group);
  if (!nodes.length) return;
  const allMuted = nodes.every((n: any) => n.mode === MODE_MUTED);
  const allBypass = nodes.every((n: any) => n.mode === MODE_BYPASS);
  const graph = app.graph as any;
  const before = graph?.version;
  try {
    if (which === "mute") {
      const mode = allMuted ? MODE_ACTIVE : MODE_MUTED;
      nodes.forEach((n: any) => (n.mode = mode));
    } else {
      const mode = allBypass ? MODE_ACTIVE : MODE_BYPASS;
      nodes.forEach((n: any) => (n.mode = mode));
    }
  } catch (err) {
    console.warn("[comfort] group toggle failed", err);
    return;
  }
  if (graph && graph.version === before) graph.setVersion(graph.version + 1);
  const canvas = app.canvas as any;
  canvas?.setDirty?.(true, true);
}

function setupGroupToggles(): void {
  const canvas = app.canvas as any;
  if (!canvas) return;
  if (canvas.__comfortGroupTogglesInstalled) return;
  canvas.__comfortGroupTogglesInstalled = true;

  // Chain the official foreground hook so we refresh positions every frame
  // (like ComfyUI's selectionBorder extension).
  const original = canvas.onDrawForeground;
  canvas.onDrawForeground = function (ctx: CanvasRenderingContext2D, ...rest: unknown[]) {
    original?.call(this, ctx, ...(rest as [any]));
    try {
      updateOverlay();
    } catch (err) {
      console.warn("[comfort] group toggles update failed", err);
    }
  };
}

export { setupGroupToggles };
