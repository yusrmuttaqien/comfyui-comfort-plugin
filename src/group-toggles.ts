// Quick mute/bypass toggles drawn on group headers.
//
// Re-worked from rgthree-comfy's GroupHeaderFastToggle (MIT). Instead of
// patching LGraphCanvas.prototype.drawGroups, we chain the official
// `app.canvas.onDrawForeground` hook (the same technique ComfyUI's own
// selectionBorder extension uses) and hit-test clicks in a document-level
// capture pointerdown listener, so the toggle fires before the canvas starts
// a group drag.
//
// The buttons appear when the pointer is over a group (or a group is
// selected). Mute toggles all nodes in the group between active and muted;
// Bypass toggles between active and bypassed.

import { app } from "/scripts/app.js";
import { MODE_ALWAYS, MODE_NEVER, MODE_BYPASS, changeModeOfNodes, getGroupNodes } from "./mode-utils.js";

const BTN = 20;
const MARGIN = 6;
const SPACING = 6;

interface Rect {
  x: number;
  y: number;
}
interface Button {
  id: "mute" | "bypass";
  rect: Rect;
}

function buttonRects(group: any): { mute: Rect; bypass: Rect } {
  const gx = group.pos?.[0] ?? 0;
  const gy = group.pos?.[1] ?? 0;
  const gw = group.size?.[0] ?? 0;
  const right = gx + gw - MARGIN - BTN;
  const y = gy + MARGIN;
  return {
    mute: { x: right - SPACING - BTN, y },
    bypass: { x: right, y },
  };
}

function inRect(px: number, py: number, r: Rect): boolean {
  return px >= r.x && px <= r.x + BTN && py >= r.y && py <= r.y + BTN;
}

function groupState(group: any): { allMuted: boolean; allBypassed: boolean } {
  const nodes = getGroupNodes(group);
  let allMuted = nodes.length > 0;
  let allBypassed = nodes.length > 0;
  for (const n of nodes) {
    allMuted = allMuted && n.mode === MODE_NEVER;
    allBypassed = allBypassed && n.mode === MODE_BYPASS;
  }
  return { allMuted, allBypassed };
}

function toggleGroup(group: any, id: "mute" | "bypass"): void {
  group.recomputeInsideNodes?.();
  const nodes = getGroupNodes(group);
  if (!nodes.length) return;
  const { allMuted, allBypassed } = groupState(group);
  let mode: number;
  if (id === "mute") {
    mode = allMuted ? MODE_ALWAYS : MODE_NEVER;
  } else {
    mode = allBypassed ? MODE_ALWAYS : MODE_BYPASS;
  }
  changeModeOfNodes(nodes, mode);
  app.canvas.setDirty(true, true);
}

function drawGroupButtons(ctx: CanvasRenderingContext2D): void {
  const canvas = app.canvas as any;
  const graph = canvas?.graph;
  if (!graph) return;
  const groups: any[] = graph._groups || [];
  if (!groups.length) return;

  const m = canvas.mouse;
  const hovered = m ? graph.getGroupOnPos(m[0], m[1]) : null;
  const selected = canvas.selected_group;

  for (const group of groups) {
    const isHover = hovered === group;
    const isSel = selected === group;
    if (!isHover && !isSel) continue;

    const { mute, bypass } = buttonRects(group);
    const state = groupState(group);
    drawButton(ctx, mute, "M", state.allMuted, "#d98c8c");
    drawButton(ctx, bypass, "B", state.allBypassed, "#d9c98c");
  }
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  label: string,
  on: boolean,
  onColor: string,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, BTN, BTN);
  ctx.fillStyle = on ? onColor : "rgba(30,30,30,0.72)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = on ? onColor : "rgba(255,255,255,0.35)";
  ctx.stroke();
  ctx.fillStyle = on ? "#181818" : "#f2f2f2";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, r.x + BTN / 2, r.y + BTN / 2);
  ctx.restore();
}

function handlePointerDown(e: PointerEvent): void {
  const canvas = app.canvas as any;
  const graph = canvas?.graph;
  if (!graph) return;
  const el = canvas.canvas;
  if (!el || !(e.target instanceof Element) || !el.contains(e.target)) return;
  if (e.button !== 0) return;

  canvas.adjustMouseEvent(e);
  const cx = (e as any).canvasX as number;
  const cy = (e as any).canvasY as number;
  const group = graph.getGroupOnPos(cx, cy);
  if (!group) return;
  const { mute, bypass } = buttonRects(group);
  if (!inRect(cx, cy, mute) && !inRect(cx, cy, bypass)) return;

  e.preventDefault();
  e.stopPropagation();
  toggleGroup(group, inRect(cx, cy, mute) ? "mute" : "bypass");
}

function setupGroupToggles(): void {
  // Chain the official foreground hook (like ComfyUI's selectionBorder).
  const canvas = app.canvas as any;
  const original = canvas.onDrawForeground;
  canvas.onDrawForeground = function (ctx: CanvasRenderingContext2D, ...rest: unknown[]) {
    original?.call(this, ctx, ...(rest as [any]));
    try {
      drawGroupButtons(ctx);
    } catch (err) {
      console.warn("[comfort] group toggles draw failed", err);
    }
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerdown", handlePointerDown, true);
}

function onPointerMove(e: PointerEvent): void {
  const canvas = app.canvas as any;
  if (!canvas?.canvas) return;
  if (!(e.target instanceof Element) || !canvas.canvas.contains(e.target)) return;
  try {
    canvas.adjustMouseEvent(e);
  } catch {
    return;
  }
  canvas.setDirty(true, true);
}

export { setupGroupToggles };
