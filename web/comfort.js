import { app as k } from "/scripts/app.js";
const R = "Power Lora Loader (comfort)", I = /* @__PURE__ */ new WeakMap(), Tt = 380;
function et(t) {
  var e;
  return (t == null ? void 0 : t.type) === R || (t == null ? void 0 : t.comfyClass) === R || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === R;
}
function Ft(t) {
  return I.get(t);
}
function Ut(t) {
  return { lora: t ?? null, on: !0, strength: 1, strengthTwo: null };
}
function wt(t) {
  let e = !0, o = !0;
  for (const n of t.rows)
    if (e = e && n.on === !0, o = o && n.on === !1, !e && !o) return null;
  return !!(e && t.rows.length > 0);
}
function zt(t) {
  const e = !wt(t);
  for (const o of t.rows) o.on = e;
}
function ot(t, e, o) {
  const n = o ? "strengthTwo" : "strength", r = t[n] ?? 1;
  t[n] = Math.round((r + e * 0.05) * 100) / 100;
}
function xt(t, e) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (t ? "on" : "off"), o.textContent = e, o;
}
function P(t) {
  const e = document.createElement("span");
  return e.className = "comfort-col-label", e.textContent = t, e;
}
function T(t, e) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (e === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(e === "two" ? t.strengthTwo ?? 1 : t.strength), s.title = e === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(s), o.appendChild(r), o;
}
function Dt(t, e, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (e.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(xt(e.on, e.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = e.lora || "None", r.title = e.lora || "No lora selected - click to choose", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", n.appendChild(s), t.showSeparate ? (n.appendChild(T(e, "one")), n.appendChild(T(e, "two"))) : n.appendChild(T(e, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(t) {
  const e = t.el;
  e.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = wt(t), r = xt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", t.showSeparate ? (s.appendChild(P("Model")), s.appendChild(P("Clip"))) : s.appendChild(P("Strength")), o.appendChild(s), e.appendChild(o), t.rows.forEach((a, l) => e.appendChild(Dt(t, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), e.appendChild(i);
}
function Gt(t) {
  const e = I.get(t);
  e && g(e);
}
async function Wt() {
  try {
    const t = await fetch("/api/models/loras");
    if (!t.ok) return [];
    const e = await t.json();
    return Array.isArray(e) ? e : (e == null ? void 0 : e.name) ?? [];
  } catch {
    return [];
  }
}
async function nt(t, e, o, n) {
  const r = await Wt() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: o,
    className: "dark",
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Ht(t, e, o, n) {
  const r = e.rows[o];
  if (!r) return;
  const s = o > 0, i = o < e.rows.length - 1, c = (a) => {
    const l = o + a;
    if (l < 0 || l >= e.rows.length) return;
    const u = e.rows[o];
    e.rows[o] = e.rows[l], e.rows[l] = u, g(e);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${r.on ? "⚫" : "◯"} Toggle ${r.on ? "Off" : "On"}`,
        callback: () => {
          r.on = !r.on, g(e);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !s, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          e.rows.splice(o, 1), g(e);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function Bt(t, e) {
  const o = e.el;
  o.addEventListener("click", (n) => {
    const r = n.target;
    if (r.closest(".comfort-toggle-all")) {
      zt(e), g(e);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      nt(e, t, n, (l) => {
        e.rows.push(Ut(l)), g(e);
      });
      return;
    }
    const s = r.closest(".comfort-lora-row");
    if (!s) return;
    const i = Number(s.dataset.idx), c = e.rows[i];
    if (!c) return;
    const a = !!r.closest(".comfort-strength-clip");
    if (r.closest(".comfort-toggle")) {
      c.on = !c.on, g(e);
      return;
    }
    if (r.closest(".comfort-name")) {
      nt(e, t, n, (l) => {
        c.lora = l, g(e);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      ot(c, -1, a), g(e);
      return;
    }
    if (r.closest(".comfort-inc")) {
      ot(c, 1, a), g(e);
      return;
    }
    if (r.closest(".comfort-remove")) {
      e.rows.splice(i, 1), g(e);
      return;
    }
  }), o.addEventListener("change", (n) => {
    const r = n.target, s = r.closest(".comfort-lora-row");
    if (!s || !r.matches("input[type='number']")) return;
    const i = e.rows[Number(s.dataset.idx)];
    if (!i) return;
    const c = parseFloat(r.value);
    Number.isFinite(c) && (r.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), o.addEventListener("contextmenu", (n) => {
    const r = n.target.closest(".comfort-lora-row");
    r && (n.preventDefault(), n.stopPropagation(), Ht(t, e, Number(r.dataset.idx), n));
  });
}
function jt(t) {
  var o, n;
  if (I.has(t)) return;
  const e = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  e.el.className = "comfort-lora-list", I.set(t, e), t.serialize_widgets = !0, typeof t.addDOMWidget == "function" && t.addDOMWidget("loras", "comfort_lora_list", e.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => e.rows,
    setValue: (r) => {
      e.rows = Array.isArray(r) ? r : [], g(e);
    }
  }), Bt(t, e), g(e), t.__comfortLoaded || (n = t.setSize) == null || n.call(t, [Math.max(((o = t.size) == null ? void 0 : o[0]) || 0, Tt), 150]);
}
function Vt(t, e) {
  let o = Object.getPrototypeOf(t);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, e);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class _t extends LGraphNode {
  constructor(e) {
    super(e), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  installModeInterceptor() {
    const e = Vt(this, "mode"), o = () => e != null && e.get ? e.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: o,
      set: (n) => {
        const r = o();
        e != null && e.set ? e.set.call(this, n) : this.__comfort_mode = n, r !== n && this.onModeChange(r, n);
      }
    });
  }
  configure(e) {
    this.configuring = !0, super.configure(e), this.configuring = !1;
  }
  onModeChange(e, o) {
  }
  getHelp() {
    return "";
  }
  onRemoved() {
    var e;
    (e = super.onRemoved) == null || e.call(this), this.removed = !0;
  }
}
const b = 0, x = 2, v = 4;
function w(t, e) {
  var n;
  if (Array.isArray(t)) {
    for (const r of t) w(r, e);
    return;
  }
  if (!t) return;
  try {
    t.mode = e;
  } catch {
  }
  const o = (n = t.subgraph) == null ? void 0 : n.nodes;
  if (Array.isArray(o))
    for (const r of o) w(r, e);
}
function rt(t) {
  var o;
  const e = (t == null ? void 0 : t.type) || ((o = t == null ? void 0 : t.constructor) == null ? void 0 : o.type) || "";
  return e.includes("Reroute") || e.includes("Node Collector") || e.includes("Node Combiner");
}
function Ct(t, e, o) {
  var c, a, l, u;
  const n = t.graph;
  if (!n) return [];
  const r = [], s = /* @__PURE__ */ new Set(), i = (f) => {
    if (!f || s.has(f)) return;
    s.add(f);
    let d;
    e === "OUTPUT" ? d = (f.outputs || []).flatMap((p) => p.links || []) : d = (f.inputs || []).map((p) => p.link);
    for (const p of d) {
      if (p == null) continue;
      const h = n.links[p];
      if (!h) continue;
      const m = e === "OUTPUT" ? h.target_id : h.origin_id, y = n.getNodeById(m);
      !y || s.has(y) || (rt(y) ? i(y) : r.push(y));
    }
  };
  if (o != null) {
    const f = e === "OUTPUT" ? ((a = (c = t.outputs) == null ? void 0 : c[o]) == null ? void 0 : a.links) || [] : [(u = (l = t.inputs) == null ? void 0 : l[o]) == null ? void 0 : u.link];
    for (const d of f) {
      if (d == null) continue;
      const p = n.links[d];
      if (!p) continue;
      const h = e === "OUTPUT" ? p.target_id : p.origin_id, m = n.getNodeById(h);
      !m || s.has(m) || (rt(m) ? i(m) : r.push(m));
    }
  } else
    i(t);
  return r;
}
function C(t, e) {
  return Ct(t, "INPUT", e);
}
function st(t, e) {
  return Ct(t, "OUTPUT", e);
}
function W(t) {
  if (t != null && t.graph && typeof t.recomputeInsideNodes == "function")
    try {
      t.recomputeInsideNodes();
    } catch {
    }
  const e = t == null ? void 0 : t._children;
  return e ? Array.from(e).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function $t(t) {
  var c, a, l, u, f, d, p, h;
  const e = t.graph;
  if (!e) return null;
  const o = e._groups || e.groups || [], n = ((c = t.pos) == null ? void 0 : c[0]) ?? 0, r = ((a = t.pos) == null ? void 0 : a[1]) ?? 0, s = ((l = t.size) == null ? void 0 : l[0]) ?? 0, i = ((u = t.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of o) {
    const y = ((f = m.pos) == null ? void 0 : f[0]) ?? 0, M = ((d = m.pos) == null ? void 0 : d[1]) ?? 0, Lt = ((p = m.size) == null ? void 0 : p[0]) ?? 0, Pt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= y && r >= M && n + s <= y + Lt && r + i <= M + Pt)
      return m;
  }
  return null;
}
const V = /* @__PURE__ */ new Set(), it = /* @__PURE__ */ new WeakMap();
let F = !1;
function $(t) {
  V.add(t);
}
function Y(t) {
  V.delete(t);
}
function N(t, e) {
  if (!t) return;
  let o = it.get(t);
  if (!(o != null && o.has(e))) {
    o || (o = /* @__PURE__ */ new Set(), it.set(t, o)), o.add(e);
    try {
      qt(t, e);
    } catch {
    }
  }
}
function U() {
  H();
}
function Yt(t, e) {
  let o = Object.getPrototypeOf(t);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, e);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
function qt(t, e) {
  const o = Object.getOwnPropertyDescriptor(t, e);
  let n, r, s = !1;
  if (o)
    o.get || o.set ? (n = o.get, r = o.set) : s = !0;
  else {
    const i = Yt(t, e);
    i && (i.get || i.set) ? (n = i.get, r = i.set) : s = !0;
  }
  if (!s)
    Object.defineProperty(t, e, {
      configurable: !0,
      enumerable: !0,
      get: () => n ? n.call(t) : void 0,
      set: (i) => {
        const c = n ? n.call(t) : void 0;
        i !== c && (r && r.call(t, i), H());
      }
    });
  else {
    let i = t[e];
    Object.defineProperty(t, e, {
      configurable: !0,
      enumerable: !0,
      get: () => i,
      set: (c) => {
        c !== i && (i = c, H());
      }
    });
  }
}
function H() {
  if (F) return;
  F = !0;
  const t = () => {
    var e;
    F = !1;
    for (const o of [...V])
      try {
        (e = o.refreshTitleRows) == null || e.call(o);
      } catch {
      }
  };
  typeof requestAnimationFrame == "function" ? requestAnimationFrame(t) : setTimeout(t, 16);
}
class O extends _t {
  constructor(e) {
    super(e), this.addInput("", "*"), $(this);
  }
  onConnectedNodesChanged(e) {
  }
  onConnectionsChange(e, o, n, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, e, o, n, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(C(this));
  }
  /**
   * Rename connected inputs to their source node's current title. Also the
   * prop-watch refresh hook: fires when a connected node is renamed or its
   * mode changes, without re-running connection logic (no mode re-application).
   */
  refreshTitleRows() {
    if (!this.inputs) return;
    let e = !1;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link == null) continue;
      const r = C(this, o)[0];
      if (!r) continue;
      N(r, "title"), N(r, "mode");
      const s = r.title || "";
      n.name !== s && (n.name = s, e = !0);
    }
    e && typeof this.setDirtyCanvas == "function" && this.setDirtyCanvas(!0, !1);
  }
  stabilizeFanIn() {
    if (!this.inputs) return;
    this.refreshTitleRows();
    const e = this.inputs[this.inputs.length - 1];
    (!e || e.link != null) && this.addInput("", "*");
  }
  onRemoved() {
    Y(this), super.onRemoved();
  }
}
function vt(t, e, o) {
  if (t.innerHTML = "", !e.length) {
    const n = document.createElement("div");
    n.className = "comfort-node-empty", n.textContent = o, t.appendChild(n);
    return;
  }
  e.forEach((n, r) => {
    const s = document.createElement("div");
    s.className = "comfort-node-row" + (n.on ? "" : " off"), s.dataset.idx = String(r);
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-toggle " + (n.on ? "on" : "off"), i.textContent = n.on ? "ON" : "OFF", s.appendChild(i);
    const c = document.createElement("span");
    c.className = "comfort-node-title", c.textContent = n.title, c.title = n.title, s.appendChild(c), t.appendChild(s);
  });
}
const Kt = 260;
class Et extends O {
  constructor(e) {
    super(e), this.listEl = null, this.rows = [], this.setSize([Kt, 150]), this.setupListWidget(), $(this);
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("nodes", "comfort_node_list", this.listEl, {
      serialize: !0,
      hideOnZoom: !0,
      getValue: () => this.rows.map((e) => ({ title: e.title, on: e.on })),
      setValue: () => {
      }
    }), this.bindListEvents(), this.renderList();
  }
  renderList() {
    const e = this.listEl;
    e && vt(e, this.rows, "Connect nodes to control them");
  }
  bindListEvents() {
    const e = this.listEl;
    e && e.addEventListener("click", (o) => {
      const r = o.target.closest(".comfort-node-row");
      if (!r) return;
      const s = Number(r.dataset.idx), i = this.rows[s];
      i && (i.on = !i.on, this.applyRowMode(i), this.renderList());
    });
  }
  /** Subclass hook: change the connected node's mode to match row.on. */
  applyRowMode(e) {
    if (e.node)
      try {
        e.node.mode = e.on ? this.modeOn : this.modeOff;
      } catch {
      }
  }
  /** Rebuild rows from live connections. Called on connect/disconnect/load. */
  syncRows() {
    const e = C(this), o = [];
    for (const n of e) {
      N(n, "title"), N(n, "mode");
      const r = n.title || n.type || "node", s = n.mode === this.modeOn;
      o.push({ node: n, title: r, on: s });
    }
    this.rows = o, this.renderList();
  }
  /** Prop-watch hook: rows show connected node titles and states. */
  refreshTitleRows() {
    this.syncRows();
  }
  onRemoved() {
    Y(this), super.onRemoved();
  }
  /** Called by the fan-in base whenever the connected-node set changes. */
  onConnectedNodesChanged(e) {
    this.syncRows();
  }
  /** Bulk actions: set every row on, off, or toggle each one. */
  setAllRows(e) {
    for (const o of this.rows)
      o.on = e === null ? !o.on : e, this.applyRowMode(o);
    this.renderList();
  }
}
const q = "Fast Muter (comfort)", K = "Fast Bypasser (comfort)";
class Zt extends Et {
  constructor() {
    super(q), this.modeOn = b, this.modeOff = x;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Qt extends Et {
  constructor() {
    super(K), this.modeOn = b, this.modeOff = v;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Xt = Zt, Jt = Qt, Nt = "Node Collector (comfort)";
class te extends O {
  constructor() {
    super(Nt), this.addOutput("Output", "*");
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ee = te, Z = "Mute / Bypass Repeater (comfort)";
class oe extends O {
  constructor() {
    super(Z), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(e) {
    if (this.configuring) return;
    const o = e;
    for (const n of o)
      n.mode !== this.mode && w(n, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(e, o) {
    if (this.configuring) return;
    const n = C(this);
    if (n.length) {
      for (const s of n) w(s, o);
      return;
    }
    const r = $t(this);
    if (r)
      for (const s of W(r))
        s !== this && w(s, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ne = oe;
function z(t) {
  return (t == null ? void 0 : t.type) === Z;
}
const kt = "Mode Relay (comfort)", re = {
  ACTIVE: b,
  MUTE: x,
  BYPASS: v,
  NOTHING: -99
}, se = {
  [x]: "on_muted_inputs",
  [v]: "on_bypassed_inputs",
  [b]: "on_any_active_inputs"
};
class ie extends O {
  constructor() {
    super(kt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    });
  }
  onConnectedNodesChanged(e) {
    this.evaluate();
  }
  onModeChange(e, o) {
    if (super.onModeChange(e, o), this.configuring || C(this).length) return;
    const r = st(this).filter(z);
    for (const s of r)
      s.mode !== o && w(s, o);
  }
  onConnectOutput(e, o, n, r, s) {
    return r ? z(r) : !0;
  }
  evaluate() {
    var c;
    if (this.configuring) return;
    const e = C(this);
    let o;
    for (const a of e) {
      const l = a.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === x || l === v)) continue;
        l === b || o === b ? o = b : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = se[o], r = n ? re[String((c = this.properties) == null ? void 0 : c[n])] : o, s = r !== void 0 ? r : o;
    if (s === -99) return;
    const i = st(this).filter(z);
    for (const a of i)
      a.mode !== s && w(a, s);
  }
  getHelp() {
    return `<p>Watches the mode of the nodes connected to its inputs and drives
a connected <b>Repeater</b> with the result: all inputs muted → MUTE, all
bypassed → BYPASS, any active → ACTIVE. Set the <code>on_muted_inputs</code>,
<code>on_bypassed_inputs</code> and <code>on_any_active_inputs</code>
properties to remap or suppress (NOTHING) each signal.</p>`;
  }
  /**
   * Title/mode-watch refresh hook: rename the inputs, then re-evaluate.
   * Mode changes on connected nodes arrive here via the prop interceptor,
   * so no polling is needed.
   */
  refreshTitleRows() {
    super.refreshTitleRows(), this.evaluate();
  }
}
const ce = ie, Ot = "Random Unmuter (comfort)";
class le extends O {
  constructor() {
    super(Ot), this.tempEnabled = null, ct.register(this);
  }
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const e = C(this);
    if (!e.length || !e.every((r) => r.mode === x)) return;
    const n = e[Math.floor(Math.random() * e.length)];
    n && (w(n, b), this.tempEnabled = n);
  }
  onPromptEnd() {
    this.tempEnabled && (w(this.tempEnabled, x), this.tempEnabled = null);
  }
  getHelp() {
    return `<p>Each time a prompt is queued, this node temporarily unmutes one
randomly-chosen connected node (which must be muted) for the duration of the
prompt, then mutes it back. All connected nodes must be muted for it to act.
Tip: connect a Repeater's output to this node's input to randomly unmute a whole
group.</p>`;
  }
  onRemoved() {
    var e;
    ct.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const L = /* @__PURE__ */ new Set(), ct = {
  register(t) {
    L.add(t), ae();
  },
  unregister(t) {
    L.delete(t);
  }
};
let lt = !1;
function ae() {
  if (lt) return;
  lt = !0;
  const t = k, e = t.queuePrompt;
  let o = !1;
  t.queuePrompt = async function(...r) {
    o = !0;
    try {
      return await e.apply(t, r);
    } finally {
      o = !1;
    }
  };
  const n = t.graphToPrompt;
  t.graphToPrompt = function(...r) {
    if (o)
      for (const c of L)
        try {
          c.onPromptStart();
        } catch {
        }
    const s = n.apply(t, r), i = () => {
      for (const c of L)
        try {
          c.onPromptEnd();
        } catch {
        }
    };
    return s && typeof s.then == "function" ? s.then((c) => (i(), c), (c) => {
      throw i(), c;
    }) : (i(), s);
  };
}
const ue = le, Q = "Fast Groups Muter (comfort)", X = "Fast Groups Bypasser (comfort)", fe = 280;
function pe(t) {
  const e = t.graph;
  if (!e) return [];
  const o = /* @__PURE__ */ new Set(), n = [], r = (s) => {
    var i;
    if (!(!s || o.has(s))) {
      o.add(s);
      for (const c of s._groups || s.groups || []) n.push(c);
      for (const c of s._subgraphs || []) r(c);
      for (const c of s._nodes || [])
        (i = c.subgraph) != null && i._groups && r(c.subgraph);
    }
  };
  return r(e), n.sort((s, i) => {
    var f, d, p, h;
    const c = ((f = s.pos) == null ? void 0 : f[1]) ?? 0, a = ((d = i.pos) == null ? void 0 : d[1]) ?? 0;
    if (c !== a) return c - a;
    const l = ((p = s.pos) == null ? void 0 : p[0]) ?? 0, u = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== u ? l - u : String(s.title || "").localeCompare(String(i.title || ""));
  }), n;
}
class Mt extends _t {
  constructor(e) {
    super(e), this.modeOn = b, this.listEl = null, this.rows = [], this.lastKey = "", this.setSize([fe, 150]), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), $(this);
  }
  onAdded() {
    var e;
    (e = super.onAdded) == null || e.call(this), this.refresh();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("groups", "comfort_group_list", this.listEl, {
      serialize: !1,
      hideOnZoom: !0,
      getValue: () => this.rows.map((e) => ({ title: e.title, on: e.on })),
      setValue: () => {
      }
    }), this.listEl.addEventListener("click", (e) => {
      const n = e.target.closest(".comfort-node-row");
      if (!n) return;
      const r = this.rows[Number(n.dataset.idx)];
      r && (this.applyGroupMode(r, !r.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(e, o) {
    const n = W(e.group);
    w(n, o ? this.modeOn : this.modeOff);
  }
  refresh() {
    var s;
    this.ensureGraphHooks();
    const e = pe(this), o = String(((s = this.properties) == null ? void 0 : s.matchTitle) || "").trim();
    let n = e.map((i) => {
      N(i, "title");
      const c = W(i);
      for (const a of c) N(a, "mode");
      return {
        group: i,
        title: String(i.title || "group"),
        on: c.some((a) => a.mode === b)
      };
    });
    if (o)
      try {
        const i = new RegExp(o, "i");
        n = n.filter((c) => i.test(c.title));
      } catch {
        n = n.filter((i) => i.title.toLowerCase().includes(o.toLowerCase()));
      }
    const r = n.map((i) => i.title + (i.on ? 1 : 0)).join("|");
    r !== this.lastKey && (this.lastKey = r, this.rows = n, this.renderList());
  }
  renderList() {
    const e = this.listEl;
    e && vt(e, this.rows, "No groups in this workflow");
  }
  setAllGroups(e) {
    for (const o of this.rows) {
      const n = e === null ? !o.on : e;
      this.applyGroupMode(o, n);
    }
    this.refresh();
  }
  getHelp() {
    return `<p>List every group in the workflow and mute or bypass all the nodes
inside a group with one click. Set the <code>matchTitle</code> property (via
right-click → Properties) to filter which groups appear.</p>`;
  }
  /** Title/mode-watch hook: rows show group titles and member state. */
  refreshTitleRows() {
    this.refresh();
  }
  /**
   * Structural changes (group/node add or remove, drags) fire no per-node
   * signals, so hook the graph's change/add/remove callbacks once per graph.
   * Each callback coalesces into a single animation-frame refresh.
   */
  ensureGraphHooks() {
    const e = this.graph;
    if (!e || at.has(e)) return;
    at.add(e);
    const o = e.on_change;
    e.on_change = function(s) {
      o == null || o.call(s, s), U();
    };
    const n = e.add;
    e.add = function(...s) {
      const i = n.apply(this, s);
      return U(), i;
    };
    const r = e.remove;
    e.remove = function(...s) {
      const i = r.apply(this, s);
      return U(), i;
    };
  }
  onRemoved() {
    var e;
    Y(this), (e = super.onRemoved) == null || e.call(this);
  }
}
class de extends Mt {
  constructor() {
    super(Q), this.modeOff = x;
  }
}
class he extends Mt {
  constructor() {
    super(X), this.modeOff = v;
  }
}
const at = /* @__PURE__ */ new WeakSet(), me = de, ge = he, ut = /* @__PURE__ */ new Set();
function _(t, e) {
  ut.has(t) || (ut.add(t), e.category = "comfort", LiteGraph.registerNodeType(t, e));
}
function ye() {
  _(q, Xt), _(K, Jt), _(Nt, ee), _(Z, ne), _(kt, ce), _(Ot, ue), _(Q, me), _(X, ge);
}
function be(t) {
  return (t == null ? void 0 : t.type) === q || (t == null ? void 0 : t.type) === K;
}
function we(t) {
  return (t == null ? void 0 : t.type) === Q || (t == null ? void 0 : t.type) === X;
}
const xe = 10, _e = /[/\\]/, ft = "__comfort_original";
function Ce(t, e) {
  const o = e == null ? void 0 : e.callback, n = /* @__PURE__ */ new Map(), r = [];
  for (const l of t) {
    if (l == null) {
      r.push(l);
      continue;
    }
    const u = String(l), f = u.indexOf("/") > -1 ? "/" : "\\", d = u.indexOf(f);
    if (d > -1) {
      const p = u.slice(0, d), h = u.slice(d + 1);
      n.has(p) || n.set(p, []), n.get(p).push({ full: u, sub: h });
    } else
      r.push(l);
  }
  const s = (l, u) => ({
    content: u,
    [ft]: l,
    callback: (f) => o == null ? void 0 : o(f[ft])
  }), i = [], c = [...n.keys()].sort((l, u) => l.localeCompare(u));
  for (const l of c) {
    const u = n.get(l).map((f) => s(f.full, f.sub));
    i.push({
      content: `📁 ${l}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: u }
    });
  }
  for (const l of r)
    typeof l == "string" ? i.push(s(l, l)) : i.push(l);
  const a = Object.assign({}, e);
  return a.callback = void 0, { values: i, options: a };
}
function pt(t) {
  if (!Array.isArray(t) || !t.every((n) => n == null || typeof n == "string")) return t;
  let e = !1;
  const o = t.filter((n) => {
    if (n == null) return !0;
    const r = String(n).split(/[\/]/);
    return r[r.length - 1].startsWith(".") ? (e = !0, !1) : !0;
  });
  return e ? o : t;
}
function dt(t, e) {
  return !Array.isArray(t) || t.length < xe ? { values: t, options: e } : (e == null ? void 0 : e.className) !== "dark" ? { values: t, options: e } : t.every((o) => o == null || typeof o == "string") ? t.some((o) => typeof o == "string" && _e.test(o)) ? Ce(t, e) : { values: t, options: e } : { values: t, options: e };
}
function ht(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const e = t == null ? void 0 : t.root;
      if (e)
        for (const o of e.querySelectorAll("div.litemenu-entry.has_submenu"))
          o.style.backgroundColor && (o.style.setProperty("background-color", ""), o.style.setProperty("color", ""));
    });
  });
}
function ve() {
  const t = LiteGraph.ContextMenu;
  if (!t || t.__comfortAutoNest) return;
  const e = new Proxy(t, {
    construct(o, n, r) {
      const [s, i] = n, c = pt(s), a = dt(c, i), l = Reflect.construct(o, [a.values, a.options], r);
      return a.values !== c && ht(l), l;
    },
    apply(o, n, r) {
      const [s, i] = r, c = pt(s), a = dt(c, i), l = o.call(n, a.values, a.options);
      return a.values !== c && ht(l), l;
    }
  });
  e.__comfortAutoNest = !0, LiteGraph.ContextMenu = e;
}
const A = "Any Router (comfort)", Rt = 5, D = 8;
function E(t) {
  return (t.inputs || []).filter((e) => e && e.name && e.name.startsWith("any_"));
}
function At(t) {
  var e;
  return (t == null ? void 0 : t.type) === A || (t == null ? void 0 : t.comfyClass) === A || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === A;
}
function J(t) {
  const e = E(t).length + 1;
  return "any_" + String(e).padStart(2, "0");
}
function Ee(t) {
  const e = (t.widgets || []).find((o) => o.name === "selection");
  return e && e.value === "active_source" ? "active_source" : "non_empty";
}
function Ne(t, e, o) {
  var c, a;
  const n = t.graph || k.graph;
  if (!n) return null;
  let r = t, s = o, i = e;
  for (let l = 0; l < 12; l++) {
    const u = i === "input" ? (c = r.inputs) == null ? void 0 : c[s] : (a = r.outputs) == null ? void 0 : a[s];
    if (!u) return null;
    if (u.type != null && u.type !== "*") return String(u.type);
    const f = i === "input" ? u.link : u.links && u.links[0];
    if (f == null) return null;
    const d = n.links && (n.links.get ? n.links.get(f) : n.links[f]) || null;
    if (!d || (i === "input" ? (r = n.getNodeById(d.origin_id), s = d.origin_slot, i = "output") : (r = n.getNodeById(d.target_id), s = d.target_slot, i = "input"), !r)) return null;
  }
  return null;
}
function ke(t) {
  const e = t.inputs || [];
  for (let o = 0; o < e.length; o++) {
    if (e[o].link == null) continue;
    const n = Ne(t, "input", o);
    if (n && n !== "*") return n;
  }
  return "*";
}
function St(t) {
  if (t.removed || !t.inputs) return;
  const e = E(t).filter((s) => s.link != null).length, o = Math.max(Rt, e + 1);
  let n = E(t).length;
  for (; n < o; )
    t.addInput(J(t), "*"), n++;
  for (; n > o; ) {
    const s = t.inputs[t.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      t.removeInput(t.inputs.length - 1), n--;
    else
      break;
  }
  const r = ke(t);
  for (const s of E(t)) s.type = r;
  for (const s of t.outputs || [])
    s.type = r, s.label = String(r);
}
const G = /* @__PURE__ */ new WeakMap();
function Oe(t) {
  const e = G.get(t);
  e != null && window.clearTimeout(e), G.set(
    t,
    window.setTimeout(() => {
      G.delete(t), t.removed || St(t);
    }, 64)
  );
}
function Me(t) {
  if (!t || t.__comfortAnyRouter) return;
  t.__comfortAnyRouter = !0, t.prototype.stabilizeComfortAnyRouter = function() {
    St(this);
  }, t.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const e = t.prototype.configure;
  t.prototype.configure = function(n) {
    try {
      const s = (n && n.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; E(this).length < s; )
        this.addInput(J(this), "*");
    } catch {
    }
    const r = e ? e.call(this, n) : void 0;
    try {
      this.removed || (this.__comfortLoaded = !0, this.stabilizeComfortAnyRouter(), It(this));
    } catch {
    }
    return r;
  };
  const o = t.prototype.onConnectionsChange;
  t.prototype.onConnectionsChange = function(...n) {
    const r = o ? o.apply(this, n) : void 0;
    try {
      Oe(this);
    } catch {
    }
    return r;
  };
}
function It(t) {
  if (t.__comfortSpacer || typeof t.addDOMWidget != "function") return;
  const e = document.createElement("div");
  e.className = "comfort-spacer", e.style.height = D + "px";
  const o = t.addDOMWidget("comfort_spacer", "comfort_spacer", e, {
    serialize: !1,
    hideOnZoom: !0,
    getValue: () => null,
    setValue: () => {
    },
    getMinHeight: () => D,
    getMaxHeight: () => D
  }), n = t.widgets || [], r = n.indexOf(o);
  r > 0 && (n.splice(r, 1), n.unshift(o)), t.__comfortSpacer = !0;
}
function Re(t) {
  try {
    if (typeof t.computeSize != "function" || !t.size) return;
    const e = t.computeSize();
    e && t.size[1] < e[1] && (t.setSize([t.size[0], e[1]]), typeof t.setDirtyCanvas == "function" && t.setDirtyCanvas(!0, !0));
  } catch {
  }
}
function Ae(t) {
  let e = 0;
  for (; E(t).length < Rt && e++ < 24; )
    t.addInput(J(t), "*");
  It(t), t.__comfortLoaded || Re(t), Ie();
}
function Se(t) {
  return !!t && t.mode !== x && t.mode !== v;
}
function mt(t) {
  if (!t || typeof t != "object") return;
  const e = t.output, o = k.graph;
  if (!(!e || !o || !o.nodes))
    for (const n of o.nodes) {
      if (!At(n) || n.mode === x || n.mode === v || Ee(n) !== "active_source") continue;
      const r = e[n.id];
      if (!r || !r.inputs) continue;
      const s = n.inputs || [];
      let i = null;
      for (let c = 0; c < s.length; c++) {
        const a = n.getInputNode ? n.getInputNode(c) : null;
        if (Se(a)) {
          i = s[c].name;
          break;
        }
      }
      for (const c of Object.keys(r.inputs))
        c.startsWith("any_") && c !== i && delete r.inputs[c];
    }
}
let gt = !1;
function Ie() {
  if (gt) return;
  gt = !0;
  const t = k, e = t.graphToPrompt;
  typeof e == "function" && (t.graphToPrompt = function(...o) {
    const n = e.apply(t, o);
    return n && typeof n.then == "function" ? n.then(
      (r) => (mt(r), r),
      (r) => {
        throw r;
      }
    ) : (mt(n), n);
  });
}
const S = "Image Comparer (comfort)", Le = 512, yt = 488;
function Pe(t) {
  var e;
  return (t == null ? void 0 : t.type) === S || (t == null ? void 0 : t.comfyClass) === S || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === S;
}
const B = /* @__PURE__ */ new WeakMap();
function bt(t) {
  var r, s;
  const e = new URLSearchParams({
    filename: t.filename,
    type: t.type,
    subfolder: t.subfolder
  }), o = k;
  let n;
  try {
    n = ((s = (r = o == null ? void 0 : o.api) == null ? void 0 : r.apiURL) == null ? void 0 : s.call(r, `/view?${e.toString()}`)) ?? `/view?${e.toString()}`;
  } catch {
    n = `/view?${e.toString()}`;
  }
  return typeof (o == null ? void 0 : o.getPreviewFormatParam) == "function" && (n += o.getPreviewFormatParam()), typeof (o == null ? void 0 : o.getRandParam) == "function" && (n += o.getRandParam()), n;
}
function j(t, e) {
  t.handle.style.left = `${e}%`, t.leftImg.style.clipPath = `inset(0 ${100 - e}% 0 0)`;
}
function Te(t) {
  t.navEl.innerHTML = "";
  const e = [
    { label: "LEFT", count: t.leftUrls.length, idx: () => t.leftIdx, set: (o) => {
      t.leftIdx = o, t.leftImg.src = t.leftUrls[o] || "";
    } },
    { label: "RIGHT", count: t.rightUrls.length, idx: () => t.rightIdx, set: (o) => {
      t.rightIdx = o, t.rightImg.src = t.rightUrls[o] || "";
    } }
  ];
  for (const o of e) {
    if (o.count <= 1) continue;
    const n = document.createElement("span");
    n.className = "ci-nav-side";
    const r = document.createElement("button");
    r.type = "button", r.textContent = "‹", r.addEventListener("click", () => o.set(Math.max(0, o.idx() - 1)));
    const s = document.createElement("span");
    s.textContent = `${o.label} ${o.idx() + 1}/${o.count}`;
    const i = document.createElement("button");
    i.type = "button", i.textContent = "›", i.addEventListener("click", () => o.set(Math.min(o.count - 1, o.idx() + 1))), n.appendChild(r), n.appendChild(s), n.appendChild(i), t.navEl.appendChild(n);
  }
}
function Fe(t, e, o) {
  t.leftUrls = e, t.rightUrls = o, t.leftIdx >= t.leftUrls.length && (t.leftIdx = 0), t.rightIdx >= t.rightUrls.length && (t.rightIdx = 0);
  const n = t.leftUrls.length > 0, r = t.rightUrls.length > 0;
  t.leftImg.src = n ? t.leftUrls[t.leftIdx] : "", t.rightImg.src = r ? t.rightUrls[t.rightIdx] : "", t.leftImg.style.display = n ? "" : "none", t.rightImg.style.display = r ? "" : "none", t.handle.style.display = "none", t.leftImg.style.clipPath = "none", t.empty.style.display = n || r ? "none" : "", j(t, 100), Te(t);
}
function Ue(t, e) {
  const o = B.get(t);
  if (!o) return;
  const n = e || {}, r = Array.isArray(n.left_images) ? n.left_images.map(bt) : [], s = Array.isArray(n.right_images) ? n.right_images.map(bt) : [];
  Fe(o, r, s);
}
function ze(t) {
  var f, d;
  if (B.has(t)) return;
  const e = document.createElement("div");
  e.className = "comfort-image-comparer";
  const o = document.createElement("div");
  o.className = "ci-nav", e.appendChild(o);
  const n = document.createElement("div");
  n.className = "ci-stage";
  const r = document.createElement("img");
  r.className = "ci-img ci-right", r.draggable = !1;
  const s = document.createElement("img");
  s.className = "ci-img ci-left", s.draggable = !1;
  const i = document.createElement("div");
  i.className = "ci-handle";
  const c = document.createElement("div");
  c.className = "ci-empty", c.textContent = "Connect images and run", n.appendChild(r), n.appendChild(s), n.appendChild(i), n.appendChild(c), e.appendChild(n);
  const a = {
    el: e,
    stage: n,
    leftImg: s,
    rightImg: r,
    handle: i,
    empty: c,
    navEl: o,
    leftUrls: [],
    rightUrls: [],
    leftIdx: 0,
    rightIdx: 0,
    rafId: null
  };
  B.set(t, a), n.addEventListener("mouseenter", () => {
    a.leftUrls.length && a.rightUrls.length && (a.handle.style.display = "");
  }), n.addEventListener("mouseleave", () => {
    a.handle.style.display = "none", j(a, 100);
  }), n.addEventListener("mousemove", (p) => {
    const h = n.getBoundingClientRect();
    if (h.width <= 0) return;
    const m = Math.max(0, Math.min(100, (p.clientX - h.left) / h.width * 100));
    j(a, m);
  }), t.__comfortLoaded || (f = t.setSize) == null || f.call(t, [Le, yt]), typeof t.addDOMWidget == "function" && t.addDOMWidget("compare", "comfort_image_compare", e, {
    serialize: !1,
    hideOnZoom: !0
  });
  const l = () => {
    var y;
    if (!t.graph) {
      a.rafId = null;
      return;
    }
    const p = t.size ? t.size[1] : yt, h = (y = t.widgets) == null ? void 0 : y.find((M) => M.name === "compare"), m = h && typeof h.y == "number" ? h.y : 20;
    e.style.height = Math.max(60, p - m - 20) + "px", a.rafId = requestAnimationFrame(l);
  };
  a.rafId = requestAnimationFrame(l);
  const u = (d = t.onRemoved) == null ? void 0 : d.bind(t);
  t.onRemoved = (...p) => {
    a.rafId !== null && cancelAnimationFrame(a.rafId), u == null || u(...p);
  };
}
function De(t) {
  if (!t || t.__comfortImageComparer) return;
  const e = t.prototype.onExecuted;
  t.prototype.onExecuted = function(n) {
    e == null || e.call(this, n), Ue(this, n);
  };
  const o = t.prototype.configure;
  t.prototype.configure = function(n) {
    o == null || o.call(this, n), this.__comfortLoaded = !0;
  }, t.__comfortImageComparer = !0;
}
const Ge = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;flex-shrink:0;min-width:118px;justify-content:center}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{min-width:44px;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer;flex-shrink:0;white-space:nowrap}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 0;min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px;flex-shrink:0}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0;flex-shrink:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{width:100%;box-sizing:border-box;padding:4px 6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer;white-space:nowrap;margin:0}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-image-comparer{display:flex;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0}.ci-nav{min-height:28px;flex-shrink:0;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb;min-width:0}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;min-width:0;flex:1;min-height:100px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}.litegraph.litecontextmenu.dark .litemenu-entry.submenu:hover:not(.disabled):not(.separator){background-color:var(--secondary, #2e3440);color:var(--foreground, #fff)}", tt = document.createElement("style");
tt.setAttribute("data-comfort-plugin", "true");
tt.textContent = Ge;
document.head.appendChild(tt);
ye();
ve();
k.registerExtension({
  name: "comfort.PowerLoraLoader",
  beforeRegisterNodeDef(t, e) {
    if (e && e.name === A && Me(t), e && e.name === S && De(t), e && e.name === R) {
      const o = t.prototype.configure;
      t.prototype.configure = function(n) {
        return this.__comfortLoaded = !0, o.call(this, n);
      };
    }
  },
  nodeCreated(t) {
    if (et(t)) {
      jt(t);
      return;
    }
    if (At(t)) {
      Ae(t);
      return;
    }
    Pe(t) && ze(t);
  },
  getNodeMenuItems(t) {
    if (et(t)) {
      const e = Ft(t);
      if (e) {
        const o = (n) => {
          e.showSeparate = n, Gt(t);
        };
        return [
          null,
          {
            content: "Show Strengths",
            has_submenu: !0,
            submenu: {
              options: [
                { content: "Single Strength", checked: () => !e.showSeparate, callback: () => o(!1) },
                { content: "Separate Model & Clip", checked: () => e.showSeparate, callback: () => o(!0) }
              ]
            }
          }
        ];
      }
    }
    if (be(t)) {
      const e = (o) => {
        var n;
        return (n = t.setAllRows) == null ? void 0 : n.call(t, o);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    if (we(t)) {
      const e = (o) => {
        var n;
        return (n = t.setAllGroups) == null ? void 0 : n.call(t, o);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    return [];
  }
});
export {
  R as NODE_NAME
};
