// Progress bar — a thin bar at the top of the viewport showing queue position,
// node-execution progress, and per-step progress for the current run.
//
// Re-worked from rgthree-comfy's RgthreeProgressBar + PromptService (MIT). Uses
// the standard ComfyUI API websocket events (status / executing / progress /
// execution_start / execution_error), which fire identically in both renderers,
// plus a wrap of api.queuePrompt to learn the total node count up front.

import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

// ---------------------------------------------------------------------------
// Per-prompt execution state.
// ---------------------------------------------------------------------------
class PromptExecution {
  id: string;
  nodeMap: Record<string, any> | null = null;
  totalNodes = 0;
  executedNodeIds: string[] = [];
  currentlyExecuting: {
    nodeId: string;
    nodeLabel?: string;
    step?: number;
    maxSteps?: number;
    pass: number;
  } | null = null;
  errorDetails: any | null = null;

  constructor(id: string) {
    this.id = id;
  }

  setPrompt(prompt: any): void {
    const map = prompt?.output ?? prompt;
    if (map && typeof map === "object") {
      this.nodeMap = map;
      // Keys are node ids; a few metadata keys may sneak in — count them all,
      // which matches how the server schedules the run.
      this.totalNodes = Object.keys(map).length;
    }
  }

  private labelFor(nodeId: string | number): string | undefined {
    const entry = this.nodeMap?.[String(nodeId)];
    const fromApi = entry?._meta?.title || entry?.class_type;
    if (fromApi) return fromApi;
    const node = app.graph?.getNodeById?.(String(nodeId));
    return node?.title || node?.type;
  }

  executing(nodeId: string | null, step?: number, maxSteps?: number): void {
    if (nodeId == null) {
      this.currentlyExecuting = null;
      return;
    }
    const id = String(nodeId);
    if (this.currentlyExecuting?.nodeId !== id) {
      if (this.currentlyExecuting) this.executedNodeIds.push(this.currentlyExecuting.nodeId);
      this.currentlyExecuting = { nodeId: id, nodeLabel: this.labelFor(nodeId), pass: 0 };
    }
    if (step != null) {
      // A lower step than before means a new pass started.
      if (!this.currentlyExecuting.step || step < this.currentlyExecuting.step) {
        this.currentlyExecuting.pass += 1;
      }
      this.currentlyExecuting.step = step;
      this.currentlyExecuting.maxSteps = maxSteps;
    }
  }

  error(details: any): void {
    this.errorDetails = details;
  }
}

// ---------------------------------------------------------------------------
// Service: tracks the active prompt from API events and re-broadcasts updates.
// ---------------------------------------------------------------------------
class ComfortPromptService extends EventTarget {
  private prompts = new Map<string, PromptExecution>();
  private current: PromptExecution | null = null;
  private queueRemaining = 0;

  constructor() {
    super();
    const that = this;

    // Capture the prompt payload (for totalNodes) as it goes out.
    const originalQueue = api.queuePrompt.bind(api);
    api.queuePrompt = async function (num: number, prompt: any, ...rest: any[]) {
      let response;
      try {
        response = await originalQueue(num, prompt, ...rest);
      } catch (e) {
        const exec = that.getOrMake("error");
        exec.error({ exception_type: "Unknown" });
        that.current = exec;
        that.dispatch();
        throw e;
      }
      const exec = that.getOrMake(response?.prompt_id ?? "unknown");
      exec.setPrompt(prompt);
      if (!that.current) that.current = exec;
      that.prompts.set(response?.prompt_id ?? "unknown", exec);
      that.dispatch();
      return response;
    } as any;

    api.addEventListener("status", (e: CustomEvent<any>) => {
      const q = e.detail?.exec_info?.queue_remaining;
      if (typeof q === "number") {
        this.queueRemaining = q;
        this.dispatch();
      }
    });

    api.addEventListener("execution_start", (e: CustomEvent<any>) => {
      this.current = this.getOrMake(e.detail?.prompt_id ?? "unknown");
      this.dispatch();
    });

    api.addEventListener("executing", (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (!this.current) this.current = this.getOrMake(detail?.prompt_id ?? "unknown");
      this.current.executing(detail?.node ?? null, detail?.value, detail?.max);
      this.dispatch();
      if (detail?.node == null) this.current = null;
    });

    api.addEventListener("progress", (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (!this.current) this.current = this.getOrMake(detail?.prompt_id ?? "unknown");
      this.current.executing(detail?.node, detail?.value, detail?.max);
      this.dispatch();
    });

    api.addEventListener("execution_error", (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (!this.current) this.current = this.getOrMake(detail?.prompt_id ?? "unknown");
      this.current?.error(detail);
      this.dispatch();
    });
  }

  private getOrMake(id: string): PromptExecution {
    let exec = this.prompts.get(id);
    if (!exec) {
      exec = new PromptExecution(id);
      this.prompts.set(id, exec);
    }
    return exec;
  }

  private dispatch(): void {
    this.dispatchEvent(new CustomEvent("comfort-progress-update", {
      detail: { queue: this.queueRemaining, prompt: this.current },
    }));
  }
}

let service: ComfortPromptService | null = null;
function getService(): ComfortPromptService {
  if (!service) service = new ComfortPromptService();
  return service;
}

// ---------------------------------------------------------------------------
// The bar itself (plain DOM, works in both renderers).
// ---------------------------------------------------------------------------
let barEl: HTMLElement | null = null;

function ensureBar(): HTMLElement {
  if (barEl && barEl.isConnected) return barEl;

  const el = document.createElement("div");
  el.className = "comfort-progress";
  el.setAttribute("data-comfort-plugin", "true");

  const nodesBar = document.createElement("div");
  nodesBar.className = "comfort-progress-bar comfort-progress-nodes";
  const stepsBar = document.createElement("div");
  stepsBar.className = "comfort-progress-bar comfort-progress-steps";
  const label = document.createElement("span");
  label.className = "comfort-progress-text";
  label.textContent = "Idle";

  el.append(nodesBar, stepsBar, label);
  document.body.appendChild(el);
  barEl = el;
  return el;
}

function renderBar(detail: { queue: number; prompt: PromptExecution | null }): void {
  const el = ensureBar();
  const nodesBar = el.querySelector(".comfort-progress-nodes") as HTMLElement;
  const stepsBar = el.querySelector(".comfort-progress-bar.comfort-progress-steps") as HTMLElement;
  const label = el.querySelector(".comfort-progress-text") as HTMLElement;
  const prompt = detail.prompt;

  el.classList.remove("comfort-progress-error");
  el.classList.toggle("comfort-progress-idle", !prompt);

  if (prompt?.errorDetails) {
    el.classList.add("comfort-progress-error");
    label.textContent = `${prompt.errorDetails?.exception_type || "Error"} ${
      prompt.errorDetails?.node_id || ""
    } ${prompt.errorDetails?.node_type || ""}`.trim();
    nodesBar.style.width = "100%";
    stepsBar.style.width = "0%";
    return;
  }

  if (prompt?.currentlyExecuting) {
    const cur = prompt.currentlyExecuting;
    let text = `(${detail.queue}) `;

    if (!prompt.totalNodes) {
      text += "??%";
      nodesBar.style.width = "0%";
    } else {
      const pct = (prompt.executedNodeIds.length / prompt.totalNodes) * 100;
      nodesBar.style.width = `${Math.max(2, pct)}%`;
      text += `${Math.round(pct)}%`;
    }

    let stepsText = "";
    if (cur.step != null && cur.maxSteps) {
      const spct = (cur.step / cur.maxSteps) * 100;
      stepsBar.style.width = `${spct}%`;
      let prefix = "";
      if (cur.pass > 1) {
        prefix = `#${cur.pass} `;
      }
      stepsText = `${prefix}${Math.round(spct)}%`;
    } else {
      stepsBar.style.width = "0%";
    }

    if (cur.nodeLabel || stepsText) {
      text += ` - ${cur.nodeLabel || "???"}${stepsText ? ` (${stepsText})` : ""}`;
    }
    label.textContent = text;
  } else {
    nodesBar.style.width = "0%";
    stepsBar.style.width = "0%";
    label.textContent = detail.queue ? `(${detail.queue}) Queued` : "Idle";
  }
}

/** Install the progress bar. Safe to call once. */
export function setupProgressBar(): void {
  if (barEl) return;
  const svc = getService();
  ensureBar();
  svc.addEventListener("comfort-progress-update", (e) => {
    renderBar((e as CustomEvent).detail);
  });
  // Prime the initial state.
  renderBar({ queue: 0, prompt: null });
}
