// Shared rendering for the "one toggle row per item" lists used by the Fast
// Muter / Bypasser (per connected node) and the Fast Groups Muter / Bypasser
// (per workflow group). Both draw an identical row (a toggle button + a title
// span) inside a `comfort-node-list` container, so the DOM building and the
// resulting node size live here once.
//
// Rows are addressed by index (`data-idx`). The caller click handler reads
// that index back to find the matching row in its own state.

export const ROW_H = 34;
export const PAD_Y = 10;

export interface ToggleRow {
  title: string;
  on: boolean;
}

/** Build the row list (or the empty placeholder) inside `el`. */
export function renderToggleRows(el: HTMLElement, rows: ToggleRow[], emptyText: string): void {
  el.innerHTML = "";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "comfort-node-empty";
    empty.textContent = emptyText;
    el.appendChild(empty);
    return;
  }
  rows.forEach((row, i) => {
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
}
