// Fast Groups Muter / Bypasser: mute/bypass all nodes inside a group with one click.
// Re-worked from rgthree-comfy (MIT). Virtual node.

import { ComfortVirtualNode } from "./virtual-node.js";
import {
  MODE_ALWAYS,
  MODE_NEVER,
  MODE_BYPASS,
  changeModeOfNodes,
  getGroupNodes,
} from "./mode-utils.js";
import { renderToggleRows } from "./toggle-list.js";
import {
  trackDep,
  untrackDep,
  watchProp,
  notifyStructuralChange,
} from "./prop-watch.js";

export const FAST_GROUPS_MUTER = "Fast Groups Muter (comfort)";
export const FAST_GROUPS_BYPASSER = "Fast Groups Bypasser (comfort)";

const MIN_W = 280;

type GroupRow = {
  group: any;
  title: string;
  on: boolean;
};


function collectGroups(node: any): any[] {
  const graph = node.graph;
  if (!graph) return [];
  const seen = new Set<any>();
  const out: any[] = [];
  const walk = (g: any) => {
    if (!g || seen.has(g)) return;
    seen.add(g);
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


abstract class FastGroupsMuterNode extends ComfortVirtualNode {
  protected abstract readonly modeOff: number;
  protected readonly modeOn = MODE_ALWAYS;
  private listEl: HTMLElement | null = null;
  private rows: GroupRow[] = [];
  private lastKey = "";

  constructor(title?: string) {
    super(title);
    this.setSize([MIN_W, 150]);
    this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
    this.setupListWidget();
    trackDep(this);
  }


  onAdded(): void {
    super.onAdded?.();
    this.refresh();
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


  refresh(): void {
    this.ensureGraphHooks();
    const groups = collectGroups(this);
    const titleFilter = String(this.properties?.["matchTitle"] || "").trim();
    let next: GroupRow[] = groups.map((group) => {
      watchProp(group, "title");
      const nodes = getGroupNodes(group);
      for (const n of nodes) watchProp(n, "mode");
      return {
        group,
        title: String(group.title || "group"),
        on: nodes.some((n) => n.mode === MODE_ALWAYS),
      };
    });
    if (titleFilter) {
      try {
        const re = new RegExp(titleFilter, "i");
        next = next.filter((r) => re.test(r.title));
      } catch {
        next = next.filter((r) => r.title.toLowerCase().includes(titleFilter.toLowerCase()));
      }
    }

    const key = next.map((r) => r.title + (r.on ? 1 : 0)).join("|");
    if (key === this.lastKey) return;
    this.lastKey = key;
    this.rows = next;
    this.renderList();
  }
  private renderList(): void {
    const el = this.listEl;
    if (!el) return;
    renderToggleRows(el, this.rows, "No groups in this workflow");
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

  /** Title/mode-watch hook: rows show group titles and member state. */
  refreshTitleRows(): void {
    this.refresh();
  }

  /**
   * Structural changes (group/node add or remove, drags) fire no per-node
   * signals, so hook the graph's change/add/remove callbacks once per graph.
   * Each callback coalesces into a single animation-frame refresh.
   */
  private ensureGraphHooks(): void {
    const graph = this.graph;
    if (!graph || hookedGraphs.has(graph)) return;
    hookedGraphs.add(graph);
    const origOnChange = graph.on_change;
    graph.on_change = function (g: any) {
      origOnChange?.call(g, g);
      notifyStructuralChange();
    };
    const origAdd = graph.add;
    graph.add = function (...args: any[]) {
      const r = origAdd.apply(this, args);
      notifyStructuralChange();
      return r;
    };
    const origRemove = graph.remove;
    graph.remove = function (...args: any[]) {
      const r = origRemove.apply(this, args);
      notifyStructuralChange();
      return r;
    };
  }

  onRemoved(): void {
    untrackDep(this);
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


const hookedGraphs = new WeakSet<any>();

export const FastGroupsMuterClass = FastGroupsMuter;
export const FastGroupsBypasserClass = FastGroupsBypasser;
