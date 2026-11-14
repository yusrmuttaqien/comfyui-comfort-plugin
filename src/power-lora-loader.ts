// Power Lora Loader (comfort) — dual-renderer. Re-worked from rgthree-comfy (MIT).

export const NODE_NAME = "Power Lora Loader (comfort)";

export type LoraRow = {
  lora: string | null;
  on: boolean;
  strength: number;
  strengthTwo: number | null;
};

export type LoraNodeState = {
  rows: LoraRow[];
  showSeparate: boolean;
  el: HTMLElement;
};


const states = new WeakMap<any, LoraNodeState>();

const HEADER_H = 32;
const ROW_H = 36;
const FOOTER_H = 34;
const PAD_Y = 14;
const MIN_W = 380;

export function isComfortLoraNode(node: any): boolean {
  return (
    node?.type === NODE_NAME ||
    node?.comfyClass === NODE_NAME ||
    node?.constructor?.comfyClass === NODE_NAME
  );
}

export function getLoraNodeState(node: any): LoraNodeState | undefined {
  return states.get(node);
}

function totalHeight(state: LoraNodeState): number {
  return (
    PAD_Y +
    HEADER_H +
    state.rows.length * ROW_H +
    FOOTER_H +
    PAD_Y
  );
}

function resize(node: any, state: LoraNodeState): void {
  if (!node.size) return;
  const h = totalHeight(state);
  const w = Math.max(node.size[0] || 0, MIN_W);
  if (node.size[1] !== h || node.size[0] !== w) {
    node.setSize?.([w, h]);
  }
}

function defaultRow(lora?: string | null): LoraRow {
  return { lora: lora ?? null, on: true, strength: 1, strengthTwo: null };
}

function allLorasState(state: LoraNodeState): boolean | null {
  let allOn = true;
  let allOff = true;
  for (const row of state.rows) {
    allOn = allOn && row.on === true;
    allOff = allOff && row.on === false;
    if (!allOn && !allOff) return null;
  }
  return allOn && state.rows.length > 0 ? true : false;
}

function toggleAllLoras(state: LoraNodeState): void {
  const target = allLorasState(state) ? false : true;
  for (const row of state.rows) row.on = target;
}

function stepStrength(row: LoraRow, dir: -1 | 1, isTwo: boolean): void {
  const key = isTwo ? "strengthTwo" : "strength";
  const cur = row[key] ?? 1;
  row[key] = Math.round((cur + dir * 0.05) * 100) / 100;
}


function makeToggle(on: boolean, text: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "comfort-toggle " + (on ? "on" : "off");
  b.textContent = text;
  return b;
}

function makeLabel(text: string): HTMLSpanElement {
  const s = document.createElement("span");
  s.className = "comfort-col-label";
  s.textContent = text;
  return s;
}

function makeStrengthGroup(row: LoraRow, which: "one" | "two"): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className =
    "comfort-strength" + (which === "two" ? " comfort-strength-clip" : "");

  const dec = document.createElement("button");
  dec.type = "button";
  dec.className = "comfort-dec";
  dec.textContent = "\u2212";
  dec.title = "Decrease strength";

  const inc = document.createElement("button");
  inc.type = "button";
  inc.className = "comfort-inc";
  inc.textContent = "+";
  inc.title = "Increase strength";

  const input = document.createElement("input");
  input.type = "number";
  input.step = "0.05";
  input.min = "-2";
  input.max = "3";
  input.value = String(which === "two" ? row.strengthTwo ?? 1 : row.strength);
  input.title = which === "two" ? "Clip strength" : "Strength";

  wrap.appendChild(dec);
  wrap.appendChild(input);
  wrap.appendChild(inc);
  return wrap;
}

function makeRow(state: LoraNodeState, row: LoraRow, idx: number): HTMLElement {
  const rowEl = document.createElement("div");
  rowEl.className = "comfort-lora-row" + (row.on ? "" : " off");
  rowEl.dataset.idx = String(idx);

  rowEl.appendChild(makeToggle(row.on, row.on ? "ON" : "OFF"));

  const name = document.createElement("span");
  name.className = "comfort-name";
  name.textContent = row.lora || "None";
  name.title = row.lora || "No lora selected — click to choose";
  rowEl.appendChild(name);

  const spacer = document.createElement("span");
  spacer.className = "comfort-spacer";
  rowEl.appendChild(spacer);

  if (state.showSeparate) {
    rowEl.appendChild(makeStrengthGroup(row, "one"));
    rowEl.appendChild(makeStrengthGroup(row, "two"));
  } else {
    rowEl.appendChild(makeStrengthGroup(row, "one"));
  }

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "comfort-remove";
  remove.textContent = "\u00d7";
  remove.title = "Remove lora";
  rowEl.appendChild(remove);

  return rowEl;
}

function render(state: LoraNodeState): void {
  const el = state.el;
  el.innerHTML = "";

  // Header: toggle-all + column labels.
  const header = document.createElement("div");
  header.className = "comfort-lora-header";
  const all = allLorasState(state);
  const toggleAll = makeToggle(all !== false, all === false ? "ALL OFF" : "ALL ON");
  toggleAll.className += " comfort-toggle-all";
  toggleAll.title = "Toggle all loras";
  header.appendChild(toggleAll);
  const labels = document.createElement("span");
  labels.className = "comfort-header-labels";
  if (state.showSeparate) {
    labels.appendChild(makeLabel("Model"));
    labels.appendChild(makeLabel("Clip"));
  } else {
    labels.appendChild(makeLabel("Strength"));
  }
  header.appendChild(labels);
  el.appendChild(header);

  // Rows.
  state.rows.forEach((row, i) => el.appendChild(makeRow(state, row, i)));

  // Footer: add lora.
  const footer = document.createElement("div");
  footer.className = "comfort-lora-footer";
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "comfort-add-btn";
  addBtn.textContent = "\u2795 Add Lora";
  footer.appendChild(addBtn);
  el.appendChild(footer);
}

export function renderLoraNode(node: any): void {
  const state = states.get(node);
  if (state) {
    render(state);
    resize(node, state);
  }
}


async function fetchLoras(): Promise<string[]> {
  try {
    const res = await fetch("/api/models/loras");
    if (!res.ok) return [];
    const data = await res.json();
    // New backend: plain array. Old backend: { name: [...] }.
    if (Array.isArray(data)) return data;
    return data?.name ?? [];
  } catch {
    return [];
  }
}

async function showLoraChooser(
  state: LoraNodeState,
  node: any,
  e: MouseEvent,
  onChoose: (lora: string) => void,
): Promise<void> {
  const loras = (await fetchLoras()) || ["(no loras found)"];
  const items = loras.length ? loras : ["(no loras found)"];
  new LiteGraph.ContextMenu(items, {
    title: "Choose Lora",
    event: e,
    callback: (v: string) => {
      if (v !== "(no loras found)") onChoose(v);
    },
  });
}

function showRowMenu(node: any, state: LoraNodeState, idx: number, e: MouseEvent): void {
  const row = state.rows[idx];
  if (!row) return;
  const canUp = idx > 0;
  const canDown = idx < state.rows.length - 1;
  const move = (dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= state.rows.length) return;
    const tmp = state.rows[idx];
    state.rows[idx] = state.rows[target];
    state.rows[target] = tmp;
    render(state);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${row.on ? "\u26ab" : "\u25ef"} Toggle ${row.on ? "Off" : "On"}`,
        callback: () => {
          row.on = !row.on;
          render(state);
        },
      },
      null,
      { content: "\u2b06\ufe0f Move Up", disabled: !canUp, callback: () => move(-1) },
      { content: "\u2b07\ufe0f Move Down", disabled: !canDown, callback: () => move(1) },
      {
        content: "\u{1F5D1}\uFE0F Remove",
        callback: () => {
          state.rows.splice(idx, 1);
          render(state);
          resize(node, state);
        },
      },
    ],
    { title: "LORA", event: e },
  );
}


function bindEvents(node: any, state: LoraNodeState): void {
  const el = state.el;

  el.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;

    if (t.closest(".comfort-toggle-all")) {
      toggleAllLoras(state);
      render(state);
      return;
    }
    if (t.closest(".comfort-add-btn")) {
      showLoraChooser(state, node, e, (lora) => {
        state.rows.push(defaultRow(lora));
        render(state);
        resize(node, state);
      });
      return;
    }

    const rowEl = t.closest(".comfort-lora-row") as HTMLElement | null;
    if (!rowEl) return;
    const idx = Number(rowEl.dataset.idx);
    const row = state.rows[idx];
    if (!row) return;

    const isTwo = !!t.closest(".comfort-strength-clip");

    if (t.closest(".comfort-toggle")) {
      row.on = !row.on;
      render(state);
      return;
    }
    if (t.closest(".comfort-name")) {
      showLoraChooser(state, node, e, (lora) => {
        row.lora = lora;
        render(state);
      });
      return;
    }
    if (t.closest(".comfort-dec")) {
      stepStrength(row, -1, isTwo);
      render(state);
      return;
    }
    if (t.closest(".comfort-inc")) {
      stepStrength(row, 1, isTwo);
      render(state);
      return;
    }
    if (t.closest(".comfort-remove")) {
      state.rows.splice(idx, 1);
      render(state);
      resize(node, state);
      return;
    }
  });

  el.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    const rowEl = t.closest(".comfort-lora-row") as HTMLElement | null;
    if (!rowEl || !t.matches("input[type='number']")) return;
    const row = state.rows[Number(rowEl.dataset.idx)];
    if (!row) return;
    const v = parseFloat(t.value);
    if (!Number.isFinite(v)) return;
    if (t.closest(".comfort-strength-clip")) row.strengthTwo = v;
    else row.strength = v;
  });

  el.addEventListener("contextmenu", (e) => {
    const rowEl = (e.target as HTMLElement).closest(".comfort-lora-row") as
      | HTMLElement
      | null;
    if (!rowEl) return;
    e.preventDefault();
    e.stopPropagation();
    showRowMenu(node, state, Number(rowEl.dataset.idx), e);
  });
}


export function setupPowerLoraLoader(node: any): void {
  if (states.has(node)) return;

  const state: LoraNodeState = {
    rows: [],
    showSeparate: false,
    el: document.createElement("div"),
  };
  state.el.className = "comfort-lora-list";
  states.set(node, state);


  node.serialize_widgets = true;

  if (typeof node.addDOMWidget === "function") {
    node.addDOMWidget("loras", "comfort_lora_list", state.el, {
      serialize: true,
      hideOnZoom: true,
      getValue: () => state.rows,
      setValue: (v: unknown) => {
        state.rows = Array.isArray(v) ? (v as LoraRow[]) : [];
        render(state);
        resize(node, state);
      },
      getMinHeight: () => totalHeight(state),
      getMaxHeight: () => totalHeight(state),
    });
  }

  bindEvents(node, state);
  render(state);
  resize(node, state);
}
