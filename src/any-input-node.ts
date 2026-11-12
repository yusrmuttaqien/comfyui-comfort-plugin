// Base for nodes that accept arbitrary incoming connections and show one row
// per connected node (Fast Muter / Fast Bypasser / Random Unmuter / Collector).
//
// Design: the node keeps a pool of `*` inputs. As nodes connect, a row appears
// in a single DOM widget (one per muter node); disconnecting removes it. The
// DOM widget renders identically in legacy LiteGraph and Nodes 2.0.
//
// Re-worked from rgthree-comfy's BaseAnyInputConnectedNode (MIT), simplified to
// a single DOM widget instead of one native widget per connection.

import { ComfortVirtualNode } from "./virtual-node.js";
import { getConnectedInputNodes } from "./mode-utils.js";

const ROW_H = 34;
const PAD_Y = 10;
const MIN_W = 260;

type RowState = {
  node: any;
  title: string;
  on: boolean;
};

export abstract class ComfortAnyInputNode extends ComfortVirtualNode {
  private listEl: HTMLElement | null = null;
  private rows: RowState[] = [];
  private widget: any = null;

  /** Mode a connected node is set to when its row is ON. */
  protected abstract readonly modeOn: number;
  /** Mode a connected node is set to when its row is OFF. */
  protected abstract readonly modeOff: number;

  constructor(title?: string) {
    super(title);
    this.addInput("", "*");
    this.setupListWidget();
    this.constructed();
  }

  private setupListWidget(): void {
    this.listEl = document.createElement("div");
    this.listEl.className = "comfort-node-list";
    if (typeof this.addDOMWidget === "function") {
      this.widget = this.addDOMWidget("nodes", "comfort_node_list", this.listEl, {
        serialize: true,
        hideOnZoom: true,
        getValue: () => this.rows.map((r) => ({ title: r.title, on: r.on })),
        setValue: () => {
          /* rows are rebuilt from live connections */
        },
      });
    }
    this.bindListEvents();
    this.renderList();
  }

  private renderList(): void {
    const el = this.listEl;
    if (!el) return;
    el.innerHTML = "";
    if (!this.rows.length) {
      const empty = document.createElement("div");
      empty.className = "comfort-node-empty";
      empty.textContent = "Connect nodes to control them";
      el.appendChild(empty);
    }
    this.rows.forEach((row, i) => {
      const rowEl = document.createElement("div");
      rowEl.className = "comfort-node-row" + (row.on ? "" : " off");
      rowEl.dataset.idx = String(i);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "comfort-toggle " + (row.on ? "on" : "off");
      btn.textContent = row.on ? "ON" : "OFF";
      rowEl.appendChild(btn);

      const label = document.createElement("span");
      label.className = "comfort-node-title";
      label.textContent = row.title;
      label.title = row.title;
      rowEl.appendChild(label);

      el.appendChild(rowEl);
    });
    this.resizeForRows();
  }

  private resizeForRows(): void {
    if (!this.size) return;
    const h = PAD_Y * 2 + this.rows.length * ROW_H;
    const w = Math.max(this.size[0] || 0, MIN_W);
    if (this.size[1] !== h || this.size[0] !== w) this.setSize?.([w, h]);
  }

  private bindListEvents(): void {
    const el = this.listEl;
    if (!el) return;
    el.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      const rowEl = t.closest(".comfort-node-row") as HTMLElement | null;
      if (!rowEl) return;
      const idx = Number(rowEl.dataset.idx);
      const row = this.rows[idx];
      if (!row) return;
      row.on = !row.on;
      this.applyRowMode(row);
      this.renderList();
    });
  }

  /** Subclass hook: change the connected node's mode to match row.on. */
  protected applyRowMode(row: RowState): void {
    if (row.node) {
      try {
        row.node.mode = row.on ? this.modeOn : this.modeOff;
      } catch {
        /* ignore */
      }
    }
  }

  /** Rebuild rows from live connections. Called on connect/disconnect/load. */
  protected syncRows(): void {
    const connected = getConnectedInputNodes(this);
    const next: RowState[] = [];
    for (const node of connected) {
      const title = node.title || node.type || "node";
      const existing = this.rows.find((r) => r.node === node);
      const on = existing
        ? existing.on
        : node.mode === this.modeOn;
      next.push({ node, title, on });
    }
    this.rows = next;
    this.renderList();
  }

  onConnectionsChange(
    _type: number,
    _index: number,
    _connected: boolean,
    _linkInfo: any,
    _ioSlot: any,
  ): void {
    super.onConnectionsChange?.(
      _type,
      _index,
      _connected,
      _linkInfo,
      _ioSlot,
    );
    this.stabilizeInputs();
    this.syncRows();
  }

  /** Keep a trailing empty `*` input and rename connected inputs to node titles. */
  private stabilizeInputs(): void {
    if (!this.inputs) return;
    // Rename connected inputs to their node's title.
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.link != null) {
        const node = getConnectedInputNodes(this, i)[0];
        const name = node?.title || "";
        if (input.name !== name) input.name = name;
      }
    }
    // Ensure a free input at the end.
    const last = this.inputs[this.inputs.length - 1];
    if (!last || last.link != null) this.addInput("", "*");
  }

  /** Actions: set every row on/off/toggle. */
  protected setAllRows(on: boolean | null): void {
    for (const row of this.rows) {
      if (on !== null) row.on = on;
      this.applyRowMode(row);
    }
    this.renderList();
  }
}
