import { ComfortVirtualNode } from "../virtual-node.js";
import { app } from "/scripts/app.js";
import { scheduler } from "../scheduler.js";
import { fetchModels, suspendModel, sleep, type ModelInfo } from "./api.js";
import { setupNInferFocusButton } from "./focus-button.js";

export const NINFER_GATE = "NInfer Suspend Gate (comfort)";

const FIELD_H = 30;
const STATUS_H = 24;
const BULK_H = 32;
const ROW_H = 30;
const PAD_Y = 10;
const MIN_W = 300;
const AMBIENT_TICKS = 6;
const ELAPSED_TICKS = 1;
const BUSY_RETRY_MS = 2000;
const TIMEOUT_OPTIONS = ["indefinite", "1", "5", "10", "15", "30", "60"];

type Phase = "idle" | "suspending" | "busy" | "done" | "error";

type GateState = {
  el: HTMLElement;
  urlInput: HTMLInputElement;
  timeoutSel: HTMLSelectElement;
  statusEl: HTMLElement;
  statusText: HTMLSpanElement;
  cancelBtn: HTMLButtonElement;
  skipBtn: HTMLButtonElement;
  bulkEl: HTMLElement;
  rowsEl: HTMLElement;
  models: ModelInfo[];
  selected: Set<string>;
  phase: Phase;
  phaseModel: string;
  phaseStart: number;
  resultText: string;
  resultHold: number;
  polling: boolean;
  cancel: boolean;
  skip: boolean;
  abort: AbortController | null;
};

export class NInferGateNode extends ComfortVirtualNode {
  private st: GateState;

  constructor() {
    super(NINFER_GATE);
    this.properties.url = "";
    this.properties.timeout = "indefinite";
    // null = "default to all loaded models"
    this.properties.selected = null;
    this.st = this.setupWidget();
    NInferGateRegistry.register(this);
  }

  override configure(info: any): void {
    super.configure(info);
    this.syncFieldsFromProperties();
  }

  onAdded(): void {
    super.onAdded?.();
    this.syncFieldsFromProperties();
    this.refresh();
  }

  onRemoved(): void {
    NInferGateRegistry.unregister(this);
    super.onRemoved?.();
  }

  updateLiveStatus(): void {
    if (this.st.phase === "suspending" || this.st.phase === "busy") {
      this.renderStatus();
    }
  }

  private baseUrl(): string {
    return String(this.properties.url || "").trim().replace(/\/+$/, "");
  }

  private timeoutMs(): number {
    const t = String(this.properties.timeout || "indefinite");
    if (t === "indefinite") return Infinity;
    const m = parseInt(t, 10);
    return Number.isFinite(m) && m > 0 ? m * 60 * 1000 : Infinity;
  }

  private computeSelected(models: ModelInfo[]): Set<string> {
    const saved = this.properties.selected;
    if (saved == null) {
      return new Set(models.filter((m) => m.value === "loaded").map((m) => m.id));
    }
    return new Set(Array.isArray(saved) ? saved.map(String) : []);
  }

  private setupWidget(): GateState {
    const el = document.createElement("div");
    el.className = "comfort-ninfer";

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.className = "comfort-ninfer-url";
    urlInput.placeholder = "NInfer URL  (http://host:30001)";
    el.appendChild(urlInput);

    const timeoutSel = document.createElement("select");
    timeoutSel.className = "comfort-ninfer-timeout";
    for (const opt of TIMEOUT_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt === "indefinite" ? "Busy timeout: indefinite" : `Busy timeout: ${opt} min`;
      timeoutSel.appendChild(o);
    }
    el.appendChild(timeoutSel);

    const statusEl = document.createElement("div");
    statusEl.className = "comfort-ninfer-status";
    const statusText = document.createElement("span");
    statusText.className = "comfort-ninfer-status-text";
    statusText.textContent = "Set NInfer URL to enable";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "comfort-ninfer-ctrl";
    cancelBtn.textContent = "Cancel";
    cancelBtn.hidden = true;
    const skipBtn = document.createElement("button");
    skipBtn.type = "button";
    skipBtn.className = "comfort-ninfer-ctrl";
    skipBtn.textContent = "Skip";
    skipBtn.hidden = true;
    statusEl.appendChild(statusText);
    statusEl.appendChild(cancelBtn);
    statusEl.appendChild(skipBtn);
    el.appendChild(statusEl);

    const bulkEl = document.createElement("div");
    bulkEl.className = "comfort-ninfer-bulk";
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "comfort-bulk";
    allBtn.dataset.bulk = "all";
    allBtn.textContent = "Select all";
    const noneBtn = document.createElement("button");
    noneBtn.type = "button";
    noneBtn.className = "comfort-bulk";
    noneBtn.dataset.bulk = "none";
    noneBtn.textContent = "Deselect all";
    bulkEl.appendChild(allBtn);
    bulkEl.appendChild(noneBtn);
    el.appendChild(bulkEl);

    const rowsEl = document.createElement("div");
    rowsEl.className = "comfort-ninfer-rows";
    el.appendChild(rowsEl);

    const st: GateState = {
      el, urlInput, timeoutSel, statusEl, statusText, cancelBtn, skipBtn, bulkEl, rowsEl,
      models: [], selected: new Set(), phase: "idle", phaseModel: "", phaseStart: 0,
      resultText: "", resultHold: 0, polling: false, cancel: false, skip: false, abort: null,
    };

    cancelBtn.addEventListener("click", () => { st.cancel = true; st.abort?.abort(); });
    skipBtn.addEventListener("click", () => { st.skip = true; st.abort?.abort(); });

    rowsEl.addEventListener("change", (e) => {
      const cb = e.target as HTMLInputElement;
      if (cb.type !== "checkbox" || !cb.dataset.id) return;
      const sel = new Set(st.selected);
      if (cb.checked) sel.add(cb.dataset.id); else sel.delete(cb.dataset.id);
      st.selected = sel;
      this.properties.selected = Array.from(sel);
    });

    bulkEl.addEventListener("click", (e) => {
      const action = (e.target as HTMLElement).dataset?.bulk;
      if (action === "all") {
        const ids = st.models.filter((m) => m.value === "loaded").map((m) => m.id);
        st.selected = new Set(ids);
        this.properties.selected = ids;
      } else if (action === "none") {
        st.selected = new Set();
        this.properties.selected = [];
      } else {
        return;
      }
      this.renderRows();
    });

    urlInput.addEventListener("input", () => {
      this.properties.url = urlInput.value.trim();
    });
    urlInput.addEventListener("change", () => {
      this.properties.url = urlInput.value.trim();
      this.properties.selected = null;
      st.phase = "idle";
      st.resultText = "";
      st.models = [];
      st.selected = new Set();
      this.refresh();
    });

    timeoutSel.addEventListener("change", () => {
      this.properties.timeout = timeoutSel.value;
    });

    if (typeof this.addDOMWidget === "function") {
      this.addDOMWidget("ninfer", "comfort_ninfer_list", el, {
        serialize: false,
        hideOnZoom: true,
      });
    }

    return st;
  }

  private syncFieldsFromProperties(): void {
    const st = this.st;
    st.urlInput.value = String(this.properties.url || "");
    const t = String(this.properties.timeout || "indefinite");
    st.timeoutSel.value = TIMEOUT_OPTIONS.includes(t) ? t : "indefinite";
    st.selected = this.computeSelected(st.models);
  }

  private renderRows(): void {
    const st = this.st;
    const el = st.rowsEl;
    el.innerHTML = "";
    if (!st.models.length) {
      const empty = document.createElement("div");
      empty.className = "comfort-node-empty";
      empty.textContent = this.baseUrl() ? "Loading…" : "Set NInfer URL above";
      el.appendChild(empty);
      return;
    }
    for (const m of st.models) {
      const loaded = m.value === "loaded";
      const rowEl = document.createElement("div");
      rowEl.className = "comfort-ninfer-row" + (loaded ? "" : " off");
      rowEl.dataset.id = m.id;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = st.selected.has(m.id);
      cb.dataset.id = m.id;
      rowEl.appendChild(cb);

      const title = document.createElement("span");
      title.className = "comfort-node-title";
      title.textContent = m.id;
      title.title = m.id;
      rowEl.appendChild(title);

      const state = m.value || "unknown";
      const badge = document.createElement("span");
      badge.className = "comfort-ninfer-badge " + (state === "loaded" ? "loaded" : state === "sleeping" ? "suspended" : "other");
      badge.textContent = state === "sleeping" ? "suspended" : state;
      rowEl.appendChild(badge);

      el.appendChild(rowEl);
    }
  }

  private idleSummary(): string {
    if (!this.baseUrl()) return "Set NInfer URL to enable";
    const m = this.st.models;
    if (!m.length) return "Loading models…";
    const loaded = m.filter((x) => x.value === "loaded").length;
    if (!loaded) return "No loaded models";
    return `${loaded} loaded · ${m.length - loaded} other`;
  }

  private renderStatus(): void {
    const st = this.st;
    const elapsed = Math.max(0, Math.round((Date.now() - st.phaseStart) / 1000));
    let text: string;
    switch (st.phase) {
      case "suspending": text = `⏳ Suspending ${st.phaseModel}… ${elapsed}s`; break;
      case "busy": text = `⏳ NInfer busy — waiting… ${elapsed}s`; break;
      case "done": text = `✓ ${st.resultText}`; break;
      case "error": text = `✗ ${st.resultText}`; break;
      default: text = this.idleSummary();
    }
    st.statusText.textContent = text;
    const active = st.phase === "suspending" || st.phase === "busy";
    st.cancelBtn.hidden = !active;
    st.skipBtn.hidden = !active;
  }

  private layout(): void {
    const n = this.st.models.length;
    const h = PAD_Y * 2 + FIELD_H + FIELD_H + STATUS_H + BULK_H + n * ROW_H;
    const w = Math.max(this.size?.[0] || 0, MIN_W);
    const cur = this.size;
    if (!cur || cur[1] !== h || cur[0] !== w) this.setSize?.([w, h]);
  }

  async refresh(fresh = false): Promise<void> {
    const st = this.st;
    if (st.polling) return;
    if (st.phase === "suspending" || st.phase === "busy") return;
    const base = this.baseUrl();

    if (!base) {
      st.models = [];
      st.selected = new Set();
      this.renderRows();
      this.renderStatus();
      this.layout();
      return;
    }

    st.polling = true;
    try {
      const models = await fetchModels(base, !fresh);
      st.models = models;
      if (this.properties.selected == null) {
        this.properties.selected = models.filter((m) => m.value === "loaded").map((m) => m.id);
      }
      st.selected = this.computeSelected(models);
      this.renderRows();
      this.layout();
      if ((st.phase === "done" || st.phase === "error") && st.resultHold > 0) {
        st.resultHold--;
      } else if (st.phase !== "idle") {
        st.phase = "idle";
        st.resultText = "";
      }
      this.renderStatus();
    } catch {
      if (st.phase === "idle") {
        st.phase = "error";
        st.resultText = "NInfer unreachable";
      }
      this.renderStatus();
    } finally {
      st.polling = false;
    }
  }

  async suspendChecked(): Promise<{ proceed: boolean }> {
    const st = this.st;
    const base = this.baseUrl();
    if (!base) return { proceed: true };
    st.cancel = false;
    st.skip = false;
    st.abort = null;

    let models: ModelInfo[];
    try {
      models = await fetchModels(base, false);
    } catch {
      this.finish("NInfer unreachable", true);
      return { proceed: false };
    }
    st.models = models;
    const selected = this.computeSelected(models);
    st.selected = selected;
    this.renderRows();

    const targets = models.filter((m) => m.value === "loaded" && selected.has(m.id));
    if (!targets.length) {
      this.finish("Ready (nothing to suspend)", false);
      return { proceed: true };
    }

    const t0 = Date.now();
    const timeoutMs = this.timeoutMs();
    try {
      for (const m of targets) {
        if (st.cancel || st.skip) break;
        const mStart = Date.now();
        this.beginSuspending(m.id, mStart);
        for (;;) {
          if (st.cancel || st.skip) break;
          const ac = new AbortController();
          st.abort = ac;
          let r: { status: number; body: any };
          try {
            r = await suspendModel(base, m.id, ac.signal);
          } catch {
            if (ac.signal.aborted) break;
            throw new Error("suspend request failed");
          }
          if (r.status === 200) break;
          if (r.status === 409) {
            this.setBusy(m.id, mStart);
            await sleep(BUSY_RETRY_MS);
            if (st.cancel || st.skip) break;
            if (Date.now() - t0 > timeoutMs) {
              throw new Error("timed out waiting for NInfer to idle");
            }
            continue;
          }
          throw new Error(`suspend failed (HTTP ${r.status})`);
        }
      }
      st.abort = null;

      if (st.cancel) {
        this.finish("Cancelled", false);
        return { proceed: false };
      }
      if (st.skip) {
        this.finish("Skipped — running now", false);
        return { proceed: true };
      }
      const total = Math.round((Date.now() - t0) / 1000);
      this.finish(`Suspended ${targets.length} model${targets.length === 1 ? "" : "s"} (${total}s)`, false);
      st.resultHold = 2;
      try { await this.refresh(true); } catch { /* periodic poll will retry */ }
      return { proceed: true };
    } catch (e) {
      this.finish(e instanceof Error ? e.message : String(e), true);
      return { proceed: false };
    } finally {
      st.abort = null;
    }
  }

  private beginSuspending(model: string, start: number): void {
    const st = this.st;
    st.phase = "suspending";
    st.phaseModel = model;
    st.phaseStart = start;
    this.renderStatus();
  }

  private setBusy(model: string, start: number): void {
    const st = this.st;
    st.phase = "busy";
    st.phaseModel = model;
    st.phaseStart = start;
    this.renderStatus();
  }

  private finish(text: string, isError: boolean): void {
    const st = this.st;
    st.phase = isError ? "error" : "done";
    st.resultText = text;
    this.renderStatus();
  }

  getHelp(): string {
    return `<p>Frees GPU memory for ComfyUI by suspending selected NInfer models
on queue. On each Run, every checked model that is <b>loaded</b> is suspended
(via its NInfer API); the queue is held until each suspend returns. If NInfer
is busy the gate waits (retrying) until it idles or the busy-timeout elapses.
Suspended models stay suspended.</p>
<p>Set the NInfer URL above. "Select all" checks every loaded model.</p>`;
  }
}

// --- Registry + scheduler jobs + queue hook ---

const registry = new Set<any>();
let hooksInstalled = false;

const ambientJob = (): void => {
  if (document.hidden) return;
  for (const n of Array.from(registry)) {
    if (n.removed) continue;
    try { n.refresh(); } catch { /* ignore */ }
  }
};
const elapsedJob = (): void => {
  for (const n of Array.from(registry)) {
    if (n.removed) continue;
    try { n.updateLiveStatus(); } catch { /* ignore */ }
  }
};

const NInferGateRegistry = {
  register(node: any): void {
    registry.add(node);
    installHooks();
    scheduler.schedule(ambientJob, AMBIENT_TICKS);
    scheduler.schedule(elapsedJob, ELAPSED_TICKS);
  },
  unregister(node: any): void {
    registry.delete(node);
    if (!registry.size) {
      scheduler.unschedule(ambientJob);
      scheduler.unschedule(elapsedJob);
    }
  },
};

function installHooks(): void {
  if (hooksInstalled) return;
  hooksInstalled = true;
  const appAny = app as any;
  const orig = appAny.queuePrompt;
  appAny.queuePrompt = async function (...args: any[]) {
    let proceed = true;
    for (const gate of Array.from(registry)) {
      if (gate.removed) continue;
      const v = await gate.suspendChecked();
      if (!v.proceed) { proceed = false; break; }
    }
    if (!proceed) return Promise.resolve();
    return await orig.apply(appAny, args);
  };
}

export function setupNInferGateFocusButton(): void {
  setupNInferFocusButton(registry);
}

export function isComfortNInferGate(node: any): boolean {
  return node?.type === NINFER_GATE || node?.comfyClass === NINFER_GATE;
}
