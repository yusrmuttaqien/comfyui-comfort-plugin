import { app } from "/scripts/app.js";
import { scheduler } from "../scheduler.js";

let focusBtn: HTMLButtonElement | null = null;

function queueButtonAnchor(): HTMLElement | null {
  return document.querySelector('[data-testid="queue-button"]') as HTMLElement | null;
}

function currentGraph(): any {
  const a = app as any;
  return a.canvas?.graph ?? a.graph ?? null;
}

export function findFocusableGate(registry: Set<any>): any | null {
  const g = currentGraph();
  if (!g) return null;
  for (const gate of registry) {
    if (!gate.removed && gate.graph === g) return gate;
  }
  return null;
}

function ensureFocusButton(registry: Set<any>): void {
  if (focusBtn && focusBtn.isConnected) return;
  const anchor = queueButtonAnchor();
  if (!anchor || !anchor.parentElement) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "comfort-topbar-focus";
  btn.title = "Focus NInfer gate";
  btn.textContent = "⚡ NInfer";
  btn.addEventListener("click", () => {
    const gate = findFocusableGate(registry);
    if (!gate) return;
    const graph = gate.graph;
    if (graph) {
      for (const n of (graph as any)._nodes || []) (n as any).selected = false;
      (gate as any).selected = true;
    }
    const canvas = (app as any).canvas;
    if (!canvas) return;
    const size = (gate as any).size || [200, 150];
    const cEl = canvas.canvas;
    const vw = (cEl && cEl.clientWidth) || window.innerWidth;
    const vh = (cEl && cEl.clientHeight) || window.innerHeight;
    const fit = Math.min((vw * 0.5) / (size[0] || 200), (vh * 0.5) / (size[1] || 150));
    canvas.ds.scale = Math.min(Math.max(fit, 0.75), 2.0);
    canvas.centerOnNode(gate);
    canvas.setDirty(true);
  });
  anchor.parentElement.insertBefore(btn, anchor.nextSibling);
  focusBtn = btn;
}

export function setupNInferFocusButton(registry: Set<any>): void {
  const job = (): void => {
    ensureFocusButton(registry);
    if (focusBtn) focusBtn.style.display = findFocusableGate(registry) ? "" : "none";
  };
  scheduler.schedule(job, 1);
}
