// NInfer Suspend Gate (comfort) — a disconnected virtual node that frees GPU
// memory for ComfyUI by suspending selected NInfer models on queue.
//
// On every "Run", before the prompt is sent, this node:
//   1. GETs /v1/models (via the Python proxy) to see which models are loaded.
//   2. For each checked model that is "loaded", POSTs /v1/models/{id}/suspend
//      and awaits it. NInfer's suspend is synchronous (it returns when done),
//      so "hold the queue until it returns" is just awaiting the call.
//   3. If NInfer is busy (HTTP 409 model_busy), it waits and retries until the
//      model idles or the configured busy-timeout elapses.
// The suspended model stays suspended (this plugin never resumes it).
//
// All NInfer calls go through /comfort/ninfer/forward (see __init__.py) to
// avoid CORS between the browser (:30003) and NInfer (:30001).
//
// Config (url, timeout, selected models) persists in `this.properties`. The
// whole UI is one DOM widget (renders natively in both renderers). Virtual
// node — not sent in the prompt.
//
// Polling is driven by the shared scheduler (see scheduler.ts): an ambient
// model refresh every ~3s (skipped while the tab is hidden) and a 500ms tick
// that advances the elapsed-time display while a suspend is in progress. The
// suspend itself is synchronous, so no polling is needed to detect its
// completion — we refresh once right after it returns.

import { ComfortVirtualNode } from "./virtual-node.js";
import { app } from "/scripts/app.js";
import { scheduler } from "./scheduler.js";

export const NINFER_GATE = "NInfer Suspend Gate (comfort)";

// Layout constants (px) — used for explicit node sizing.
const FIELD_H = 30;
const STATUS_H = 24;
const BULK_H = 32;
const ROW_H = 30;
const PAD_Y = 10;
const MIN_W = 300;

// Scheduler cadences (in 500ms ticks) + retry / cache timing.
const AMBIENT_TICKS = 6; // ~3s between ambient model refreshes
const ELAPSED_TICKS = 1; // 500ms — advance the elapsed-time display
const BUSY_RETRY_MS = 2000; // how often to retry a 409 model_busy
const MODEL_CACHE_MS = 1000; // TTL for the shared /v1/models result cache

const TIMEOUT_OPTIONS = ["indefinite", "1", "5", "10", "15", "30", "60"];

type Phase = "idle" | "suspending" | "busy" | "done" | "error";
type ModelInfo = { id: string; value: string };

type GateState = {
  el: HTMLElement;
  urlInput: HTMLInputElement;
  timeoutSel: HTMLSelectElement;
  statusEl: HTMLElement;
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
};

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

// --- NInfer calls (via the proxy) ----------------------------------------

async function forward(
  url: string,
  body?: unknown,
): Promise<{ status: number; body: any }> {
  const resp =
    body === undefined
      ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(url))
      : await fetch("/comfort/ninfer/forward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, body }),
        });
  const text = await resp.text();
  let parsed: any = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    /* keep raw text */
  }
  return { status: resp.status, body: parsed };
}

// Shared /v1/models cache. Multiple gate nodes pointing at the same NInfer
// share one request per poll: the result cache serves fresh-enough reads
// within MODEL_CACHE_MS, and `inFlight` coalesces concurrent fetches so two
// gates polling in the same tick issue a single request.
const modelCache = new Map<string, { at: number; models: ModelInfo[] }>();
const inFlight = new Map<string, Promise<ModelInfo[]>>();

async function fetchModels(base: string, useCache: boolean): Promise<ModelInfo[]> {
  const key = base + "/v1/models";
  if (useCache) {
    const hit = modelCache.get(key);
    if (hit && Date.now() - hit.at < MODEL_CACHE_MS) return hit.models;
  }
  const pending = inFlight.get(key);
  if (pending) return pending;
  const p = (async () => {
    const r = await forward(key);
    const data = r.body?.data;
    const models: ModelInfo[] = Array.isArray(data)
      ? data.map((m: any) => ({
          id: String(m.id),
          value: String(m.status?.value ?? ""),
        }))
      : [];
    modelCache.set(key, { at: Date.now(), models });
    return models;
  })().finally(() => inFlight.delete(key));
  inFlight.set(key, p);
  return p;
}

function suspendModel(base: string, id: string): Promise<{ status: number; body: any }> {
  return forward(base + "/v1/models/" + encodeURIComponent(id) + "/suspend", {});
}

export class NInferGateNode extends ComfortVirtualNode {
  private st: GateState;

  constructor() {
    super(NINFER_GATE);
    // Defaults. `selected === null` means "default to all loaded models".
    this.properties.url = "";
    this.properties.timeout = "indefinite";
    this.properties.selected = null;
    this.st = this.setupWidget();
    NInferGateRegistry.register(this);
  }

  /**
   * Workflow load. The load path runs `graph.add()` (→ `onAdded`) BEFORE
   * `configure()`, so `onAdded` syncs the inputs from the constructor
   * defaults. `configure()` then restores `this.properties` — re-sync the
   * inputs to the restored values here, or the URL/timeout/selection set in
   * the saved workflow would be lost.
   */
  override configure(info: any): void {
    super.configure(info);
    this.syncFieldsFromProperties();
  }

  /** Runs after the node is added to a graph (creation AND workflow load). */
  onAdded(): void {
    super.onAdded?.();
    // Sync the inputs to the current properties, then fetch the model list.
    this.syncFieldsFromProperties();
    this.refresh();
  }

  onRemoved(): void {
    NInferGateRegistry.unregister(this);
    super.onRemoved?.();
  }

  /**
   * Called every tick by the shared scheduler. Advances the elapsed-time
   * display while a suspend is in progress; a no-op otherwise (so idle nodes
   * don't churn the DOM).
   */
  updateLiveStatus(): void {
    if (this.st.phase === "suspending" || this.st.phase === "busy") {
      this.renderStatus();
    }
  }

  // --- configuration accessors -------------------------------------------

  private baseUrl(): string {
    return String(this.properties.url || "").trim().replace(/\/+$/, "");
  }

  private timeoutMs(): number {
    const t = String(this.properties.timeout || "indefinite");
    if (t === "indefinite") return Infinity;
    const m = parseInt(t, 10);
    return Number.isFinite(m) && m > 0 ? m * 60 * 1000 : Infinity;
  }

  /**
   * Effective checked set. `null` (never explicitly set) means "all loaded";
   * an explicit array (possibly empty) is used as-is.
   */
  private computeSelected(models: ModelInfo[]): Set<string> {
    const saved = this.properties.selected;
    if (saved == null) {
      return new Set(
        models.filter((m) => m.value === "loaded").map((m) => m.id),
      );
    }
    return new Set(Array.isArray(saved) ? saved.map(String) : []);
  }

  // --- UI ----------------------------------------------------------------

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
      o.textContent =
        opt === "indefinite"
          ? "Busy timeout: indefinite"
          : `Busy timeout: ${opt} min`;
      timeoutSel.appendChild(o);
    }
    el.appendChild(timeoutSel);

    const statusEl = document.createElement("div");
    statusEl.className = "comfort-ninfer-status";
    statusEl.textContent = "Set NInfer URL to enable";
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
      el,
      urlInput,
      timeoutSel,
      statusEl,
      bulkEl,
      rowsEl,
      models: [],
      selected: new Set<string>(),
      phase: "idle",
      phaseModel: "",
      phaseStart: 0,
      resultText: "",
      resultHold: 0,
      polling: false,
    };

    // Per-model checkbox toggle → persist an explicit selection.
    rowsEl.addEventListener("change", (e) => {
      const cb = e.target as HTMLInputElement;
      if (cb.type !== "checkbox" || !cb.dataset.id) return;
      const sel = new Set(st.selected);
      if (cb.checked) sel.add(cb.dataset.id);
      else sel.delete(cb.dataset.id);
      st.selected = sel;
      this.properties.selected = Array.from(sel);
    });

    // Bulk select / deselect.
    bulkEl.addEventListener("click", (e) => {
      const action = (e.target as HTMLElement).dataset?.bulk;
      if (action === "all") {
        const ids = st.models
          .filter((m) => m.value === "loaded")
          .map((m) => m.id);
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

    // URL typed → commit to properties on every keystroke, so a save at any
    // moment (Ctrl+S before the field blurs) captures the current value.
    urlInput.addEventListener("input", () => {
      this.properties.url = urlInput.value.trim();
    });

    // URL committed (blur/Enter) → reset any held result, poll immediately.
    urlInput.addEventListener("change", () => {
      this.properties.url = urlInput.value.trim();
      this.properties.selected = null; // fresh default for the new URL
      st.phase = "idle";
      st.resultText = "";
      st.models = [];
      st.selected = new Set();
      this.refresh();
    });

    // Timeout change → store.
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

  /** Push `this.properties` into the input controls (load path). */
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
      // Enabled regardless of live status: a checked model stays checked
      // through its state transitions (loaded -> unloading -> sleeping).
      cb.dataset.id = m.id;
      rowEl.appendChild(cb);

      const title = document.createElement("span");
      title.className = "comfort-node-title";
      title.textContent = m.id;
      title.title = m.id;
      rowEl.appendChild(title);

      const state = m.value || "unknown";
      const badge = document.createElement("span");
      badge.className =
        "comfort-ninfer-badge " +
        (state === "loaded"
          ? "loaded"
          : state === "sleeping"
            ? "suspended"
            : "other");
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
      case "suspending":
        text = `⏳ Suspending ${st.phaseModel}… ${elapsed}s`;
        break;
      case "busy":
        text = `⏳ NInfer busy — waiting… ${elapsed}s`;
        break;
      case "done":
        text = `✓ ${st.resultText}`;
        break;
      case "error":
        text = `✗ ${st.resultText}`;
        break;
      default:
        text = this.idleSummary();
    }
    st.statusEl.textContent = text;
  }

  private layout(): void {
    const n = this.st.models.length;
    const h = PAD_Y * 2 + FIELD_H + FIELD_H + STATUS_H + BULK_H + n * ROW_H;
    const w = Math.max(this.size?.[0] || 0, MIN_W);
    const cur = this.size;
    if (!cur || cur[1] !== h || cur[0] !== w) this.setSize?.([w, h]);
  }

  // --- polling -----------------------------------------------------------

  /**
   * Refresh the model list + status. Driven by the ambient scheduler job and
   * on demand (load, URL change, post-suspend). `fresh` bypasses the shared
   * result cache (used right after a suspend, to see the new state at once).
   */
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
        // First-ever poll: default to all currently-loaded models and freeze
        // the selection, so a checked row stays checked through its state
        // transitions (loaded -> unloading -> sleeping) instead of being
        // recomputed from live status every poll.
        this.properties.selected = models
          .filter((m) => m.value === "loaded")
          .map((m) => m.id);
      }
      st.selected = this.computeSelected(models);
      this.renderRows();
      this.layout();
      // Keep a just-finished result visible for ~2 poll cycles, then go idle.
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

  // --- queue hook --------------------------------------------------------

  /**
   * Called from the queuePrompt wrapper, before the prompt is sent. Suspends
   * each checked+loaded model, holding the queue until every suspend returns.
   * Throws on timeout/unreachable so the queue is aborted rather than sent
   * while VRAM is still held.
   */
  async suspendChecked(): Promise<void> {
    const st = this.st;
    const base = this.baseUrl();
    if (!base) return; // no URL configured → don't block the queue

    let models: ModelInfo[];
    try {
      // Fresh read — we're about to suspend, so the current state matters.
      models = await fetchModels(base, false);
    } catch {
      this.finish("NInfer unreachable", true);
      throw new Error("NInfer unreachable");
    }
    st.models = models;
    const selected = this.computeSelected(models);
    st.selected = selected;
    this.renderRows();

    const targets = models.filter(
      (m) => m.value === "loaded" && selected.has(m.id),
    );
    if (!targets.length) {
      this.finish("Ready (nothing to suspend)", false);
      return;
    }

    const t0 = Date.now();
    const timeoutMs = this.timeoutMs();
    try {
      for (const m of targets) {
        const mStart = Date.now();
        this.beginSuspending(m.id, mStart);
        for (;;) {
          const r = await suspendModel(base, m.id);
          if (r.status === 200) break;
          if (r.status === 409) {
            this.setBusy(m.id, mStart);
            await sleep(BUSY_RETRY_MS);
            if (Date.now() - t0 > timeoutMs) {
              throw new Error("timed out waiting for NInfer to idle");
            }
            continue;
          }
          throw new Error(`suspend failed (HTTP ${r.status})`);
        }
      }
      const total = Math.round((Date.now() - t0) / 1000);
      this.finish(
        `Suspended ${targets.length} model${targets.length === 1 ? "" : "s"} (${total}s)`,
        false,
      );
      st.resultHold = 2;
      // Refresh immediately (bypassing the cache) so the rows/badges reflect
      // the new (suspended) state right away rather than on the next poll.
      try {
        await this.refresh(true);
      } catch {
        /* the periodic poll will retry */
      }
    } finally {
      // The elapsed display is advanced by the shared scheduler; nothing to
      // stop here.
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

// ---------------------------------------------------------------------------
// Registry + shared polling + queue hook
// ---------------------------------------------------------------------------

const registry = new Set<any>();
let hooksInstalled = false;

// Two jobs on the shared scheduler:
//  - ambientJob: refresh the model list (~3s), skipped while the tab is hidden.
//  - elapsedJob: advance the elapsed-time display while a suspend is running.
const ambientJob = (): void => {
  if (document.hidden) return; // no network/CPU while the tab isn't visible
  for (const n of Array.from(registry)) {
    if (n.removed) continue;
    try {
      n.refresh();
    } catch {
      /* ignore */
    }
  }
};
const elapsedJob = (): void => {
  for (const n of Array.from(registry)) {
    if (n.removed) continue;
    try {
      n.updateLiveStatus();
    } catch {
      /* ignore */
    }
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

/**
 * Wrap app.queuePrompt once. Before the real queuePrompt runs, each live gate
 * node suspends its selected models (holding the queue). Composes with the
 * Random Unmuter (both wrap queuePrompt); the gate suspends first, the
 * unmuter acts during the prompt build.
 */
function installHooks(): void {
  if (hooksInstalled) return;
  hooksInstalled = true;
  const appAny = app as any;
  const orig = appAny.queuePrompt;
  appAny.queuePrompt = async function (...args: any[]) {
    for (const gate of Array.from(registry)) {
      if (gate.removed) continue;
      await gate.suspendChecked();
    }
    return await orig.apply(appAny, args);
  };
}

export function isComfortNInferGate(node: any): boolean {
  return node?.type === NINFER_GATE || node?.comfyClass === NINFER_GATE;
}
