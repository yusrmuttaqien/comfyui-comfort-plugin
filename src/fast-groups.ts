// Fast Groups Muter / Bypasser — an input-less node that lists every group in
// the workflow and lets you mute/bypass all nodes inside a group with one
// click. The toggle reflects whether the group has any active (Always) nodes.
//
// Re-worked from rgthree-comfy's BaseFastGroupsModeChanger (MIT). Virtual node.
// Uses the same DOM-widget pattern as the Fast Muter for dual-renderer support.

import { ComfortVirtualNode } from "./virtual-node.js";
import {
  MODE_ALWAYS,
  MODE_NEVER,
  MODE_BYPASS,
  changeModeOfNodes,
  getGroupNodes,
} from "./mode-utils.js";

export const FAST_GROUPS_MUTER = "Fast Groups Muter (comfort)";
export const FAST_GROUPS_BYPASSER = "Fast Groups Bypasser (comfort)";

const ROW_H = 34;
const PAD_Y = 10;
const MIN_W = 280;

type GroupRow = {
  group: any;
  title: string;
  on: boolean;
};

/** Enumerate groups in the given graph (or all subgraphs if includeAll). */
function collectGroups(node: any): any[] {
  const graph = node.graph;
  if (!graph) return [];
  const out: any[] = [];
  const walk = (g: any) => {
    for (const group of g._groups || g.groups || []) out.push(group);
    // Recurse into subgraphs (child graphs).
    for (const child of g._subgraphs || []) walk(child);
    // Nodes that are subgraph proxies carry their children in `subgraph`.
    for (const n of g._nodes || []) {
      if (n.subgraph?._groups) walk(n.subgraph);
    }
  };
  walk(graph);
  // Sort by position (top-left), then title.
  out.sort((a, b) => {
    const ay = a.pos?.[1] ?? 0, by = b.pos?.[1] ?? 0;
    if (ay !== by) return ay - by;
    const ax = a.pos?.[0] ?? 0, bx = b.pos?.[0] ?? 0;
    if (ax !== bx) return ax - bx;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
  return out;
}

/** A group is "on" (active) if any node inside it is in Always mode. */
function groupIsActive(group: any): boolean {
  return getGroupNodes(group).some((n) => n.mode === MODE_ALWAYS);
}

abstract class FastGroupsMuterNode extends ComfortVirtualNode {
  protected abstract readonly modeOff: number;
  protected readonly modeOn = MODE_ALWAYS;
  private listEl: HTMLElement | null = null;
  private rows: GroupRow[] = [];

  constructor(title?: string) {
    super(title);
    this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
    this.setupListWidget();
    FastGroupsRegistry.register(this);
    this.constructed();
  }

  private setupListWidget(): void {
    this.listEl = document.createElement("div");
    this.listEl.className = "comfort-node-list";
    if (typeof this.addDOMWidget === "function") {
      this.addDOMWidget("groups", "comfort_group_list", this.listEl, {
        serialize: false,
        hideOnZoom: true,
        getValue: () => this.rows.map((r) => ({ title: r.title, on: r.on })),
        setValue: () => {
          /* rebuilt from live groups */
        },
      });
    }
    this.listEl.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      const rowEl = t.closest(".comfort-node-row") as HTMLElement | null;
      if (!rowEl) return;
      const row = this.rows[Number(rowEl.dataset.idx)];
      if (!row) return;
      this.applyGroupMode(row, !row.on);
      this.refresh();
    });
    this.refresh();
  }

  private applyGroupMode(row: GroupRow, on: boolean): void {
    const nodes = getGroupNodes(row.group);
    changeModeOfNodes(nodes, on ? this.modeOn : this.modeOff);
  }

  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh(): void {
    const groups = collectGroups(this);
    const titleFilter = String(this.properties?.["matchTitle"] || "").trim();
    let next: GroupRow[] = groups.map((group) => ({
      group,
      title: String(group.title || "group"),
      on: groupIsActive(group),
    }));
    if (titleFilter) {
      try {
        const re = new RegExp(titleFilter, "i");
        next = next.filter((r) => re.test(r.title));
      } catch {
        next = next.filter((r) => r.title.toLowerCase().includes(titleFilter.toLowerCase()));
      }
    }
    // Preserve existing toggle state for groups that persist.
    const prev = new Map(this.rows.map((r) => [r.group, r.on]));
    next = next.map((r) => ({ ...r, on: prev.has(r.group) ? prev.get(r.group)! : r.on }));
    // Only re-render if the set actually changed (avoid flicker).
    const key = next.map((r) => r.title + (r.on ? 1 : 0)).join("|");
    if (key === this.lastKey) return;
    this.lastKey = key;
    this.rows = next;
    this.renderList();
  }
  private lastKey = "";

  private renderList(): void {
    const el = this.listEl;
    if (!el) return;
    el.innerHTML = "";
    if (!this.rows.length) {
      const empty = document.createElement("div");
      empty.className = "comfort-node-empty";
      empty.textContent = "No groups in this workflow";
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
    if (this.size) {
      const h = PAD_Y * 2 + this.rows.length * ROW_H;
      const w = Math.max(this.size[0] || 0, MIN_W);
      if (this.size[1] !== h || this.size[0] !== w) this.setSize?.([w, h]);
    }
  }

  setAllGroups(on: boolean | null): void {
    for (const row of this.rows) {
      const next = on === null ? !row.on : on;
      this.applyGroupMode(row, next);
    }
    this.refresh();
  }

  getHelp(): string {
    return `<p>List every group in the workflow and mute or bypass all the nodes
inside a group with one click. Set the <code>matchTitle</code> property (via
right-click → Properties) to filter which groups appear.</p>`;
  }

  onRemoved(): void {
    FastGroupsRegistry.unregister(this);
    super.onRemoved?.();
  }
}

class FastGroupsMuter extends FastGroupsMuterNode {
  protected override readonly modeOff = MODE_NEVER;
  constructor() {
    super(FAST_GROUPS_MUTER);
  }
}

class FastGroupsBypasser extends FastGroupsMuterNode {
  protected override readonly modeOff = MODE_BYPASS;
  constructor() {
    super(FAST_GROUPS_BYPASSER);
  }
}

// Shared registry + a single refresh loop for all Fast Groups nodes.
const registry = new Set<any>();
let timer: any = null;
const FastGroupsRegistry = {
  register(node: any) {
    registry.add(node);
    if (timer == null) {
      timer = setInterval(() => {
        for (const n of registry) {
          try {
            n.refresh();
          } catch {
            /* ignore */
          }
        }
      }, 1000);
    }
  },
  unregister(node: any) {
    registry.delete(node);
    if (!registry.size && timer != null) {
      clearInterval(timer);
      timer = null;
    }
  },
};

export const FastGroupsMuterClass = FastGroupsMuter;
export const FastGroupsBypasserClass = FastGroupsBypasser;
