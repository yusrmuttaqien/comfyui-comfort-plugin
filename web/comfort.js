import { app as k } from "/scripts/app.js";
const R = "Power Lora Loader (comfort)", I = /* @__PURE__ */ new WeakMap(), Pt = 380;
function et(t) {
  var e;
  return (t == null ? void 0 : t.type) === R || (t == null ? void 0 : t.comfyClass) === R || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === R;
}
function Tt(t) {
  return I.get(t);
}
function Ft(t) {
  return { lora: t ?? null, on: !0, strength: 1, strengthTwo: null };
}
function bt(t) {
  let e = !0, n = !0;
  for (const o of t.rows)
    if (e = e && o.on === !0, n = n && o.on === !1, !e && !n) return null;
  return !!(e && t.rows.length > 0);
}
function Ut(t) {
  const e = !bt(t);
  for (const n of t.rows) n.on = e;
}
function ot(t, e, n) {
  const o = n ? "strengthTwo" : "strength", r = t[o] ?? 1;
  t[o] = Math.round((r + e * 0.05) * 100) / 100;
}
function wt(t, e) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (t ? "on" : "off"), n.textContent = e, n;
}
function P(t) {
  const e = document.createElement("span");
  return e.className = "comfort-col-label", e.textContent = t, e;
}
function T(t, e) {
  const n = document.createElement("div");
  n.className = "comfort-strength" + (e === "two" ? " comfort-strength-clip" : "");
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-dec", o.textContent = "−", o.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(e === "two" ? t.strengthTwo ?? 1 : t.strength), s.title = e === "two" ? "Clip strength" : "Strength", n.appendChild(o), n.appendChild(s), n.appendChild(r), n;
}
function zt(t, e, n) {
  const o = document.createElement("div");
  o.className = "comfort-lora-row" + (e.on ? "" : " off"), o.dataset.idx = String(n), o.appendChild(wt(e.on, e.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = e.lora || "None", r.title = e.lora || "No lora selected - click to choose", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", o.appendChild(s), t.showSeparate ? (o.appendChild(T(e, "one")), o.appendChild(T(e, "two"))) : o.appendChild(T(e, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", o.appendChild(i), o;
}
function g(t) {
  const e = t.el;
  e.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const o = bt(t), r = wt(o !== !1, o === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", t.showSeparate ? (s.appendChild(P("Model")), s.appendChild(P("Clip"))) : s.appendChild(P("Strength")), n.appendChild(s), e.appendChild(n), t.rows.forEach((a, l) => e.appendChild(zt(t, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), e.appendChild(i);
}
function Dt(t) {
  const e = I.get(t);
  e && g(e);
}
async function Gt() {
  try {
    const t = await fetch("/api/models/loras");
    if (!t.ok) return [];
    const e = await t.json();
    return Array.isArray(e) ? e : (e == null ? void 0 : e.name) ?? [];
  } catch {
    return [];
  }
}
async function nt(t, e, n, o) {
  const r = await Gt() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: n,
    className: "dark",
    callback: (i) => {
      i !== "(no loras found)" && o(i);
    }
  });
}
function Wt(t, e, n, o) {
  const r = e.rows[n];
  if (!r) return;
  const s = n > 0, i = n < e.rows.length - 1, c = (a) => {
    const l = n + a;
    if (l < 0 || l >= e.rows.length) return;
    const u = e.rows[n];
    e.rows[n] = e.rows[l], e.rows[l] = u, g(e);
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
          e.rows.splice(n, 1), g(e);
        }
      }
    ],
    { title: "LORA", event: o }
  );
}
function Ht(t, e) {
  const n = e.el;
  n.addEventListener("click", (o) => {
    const r = o.target;
    if (r.closest(".comfort-toggle-all")) {
      Ut(e), g(e);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      nt(e, t, o, (l) => {
        e.rows.push(Ft(l)), g(e);
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
      nt(e, t, o, (l) => {
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
  }), n.addEventListener("change", (o) => {
    const r = o.target, s = r.closest(".comfort-lora-row");
    if (!s || !r.matches("input[type='number']")) return;
    const i = e.rows[Number(s.dataset.idx)];
    if (!i) return;
    const c = parseFloat(r.value);
    Number.isFinite(c) && (r.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), n.addEventListener("contextmenu", (o) => {
    const r = o.target.closest(".comfort-lora-row");
    r && (o.preventDefault(), o.stopPropagation(), Wt(t, e, Number(r.dataset.idx), o));
  });
}
function Bt(t) {
  var n, o;
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
  }), Ht(t, e), g(e), t.__comfortLoaded || (o = t.setSize) == null || o.call(t, [Math.max(((n = t.size) == null ? void 0 : n[0]) || 0, Pt), 150]);
}
function jt(t, e) {
  let n = Object.getPrototypeOf(t);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, e);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
class xt extends LGraphNode {
  constructor(e) {
    super(e), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  installModeInterceptor() {
    const e = jt(this, "mode"), n = () => e != null && e.get ? e.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: n,
      set: (o) => {
        const r = n();
        e != null && e.set ? e.set.call(this, o) : this.__comfort_mode = o, r !== o && this.onModeChange(r, o);
      }
    });
  }
  configure(e) {
    this.configuring = !0, super.configure(e), this.configuring = !1;
  }
  onModeChange(e, n) {
  }
  getHelp() {
    return "";
  }
  onRemoved() {
    var e;
    (e = super.onRemoved) == null || e.call(this), this.removed = !0;
  }
}
const b = 0, x = 2, E = 4;
function w(t, e) {
  var o;
  if (Array.isArray(t)) {
    for (const r of t) w(r, e);
    return;
  }
  if (!t) return;
  try {
    t.mode = e;
  } catch {
  }
  const n = (o = t.subgraph) == null ? void 0 : o.nodes;
  if (Array.isArray(n))
    for (const r of n) w(r, e);
}
function rt(t) {
  var n;
  const e = (t == null ? void 0 : t.type) || ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.type) || "";
  return e.includes("Reroute") || e.includes("Node Collector") || e.includes("Node Combiner");
}
function _t(t, e, n) {
  var c, a, l, u;
  const o = t.graph;
  if (!o) return [];
  const r = [], s = /* @__PURE__ */ new Set(), i = (f) => {
    if (!f || s.has(f)) return;
    s.add(f);
    let d;
    e === "OUTPUT" ? d = (f.outputs || []).flatMap((p) => p.links || []) : d = (f.inputs || []).map((p) => p.link);
    for (const p of d) {
      if (p == null) continue;
      const h = o.links[p];
      if (!h) continue;
      const m = e === "OUTPUT" ? h.target_id : h.origin_id, y = o.getNodeById(m);
      !y || s.has(y) || (rt(y) ? i(y) : r.push(y));
    }
  };
  if (n != null) {
    const f = e === "OUTPUT" ? ((a = (c = t.outputs) == null ? void 0 : c[n]) == null ? void 0 : a.links) || [] : [(u = (l = t.inputs) == null ? void 0 : l[n]) == null ? void 0 : u.link];
    for (const d of f) {
      if (d == null) continue;
      const p = o.links[d];
      if (!p) continue;
      const h = e === "OUTPUT" ? p.target_id : p.origin_id, m = o.getNodeById(h);
      !m || s.has(m) || (rt(m) ? i(m) : r.push(m));
    }
  } else
    i(t);
  return r;
}
function C(t, e) {
  return _t(t, "INPUT", e);
}
function st(t, e) {
  return _t(t, "OUTPUT", e);
}
function W(t) {
  if (t != null && t.graph && typeof t.recomputeInsideNodes == "function")
    try {
      t.recomputeInsideNodes();
    } catch {
    }
  const e = t == null ? void 0 : t._children;
  return e ? Array.from(e).filter((n) => {
    var o;
    return n && (n.isLGraphNode || ((o = n.constructor) == null ? void 0 : o.type));
  }) : [];
}
function Vt(t) {
  var c, a, l, u, f, d, p, h;
  const e = t.graph;
  if (!e) return null;
  const n = e._groups || e.groups || [], o = ((c = t.pos) == null ? void 0 : c[0]) ?? 0, r = ((a = t.pos) == null ? void 0 : a[1]) ?? 0, s = ((l = t.size) == null ? void 0 : l[0]) ?? 0, i = ((u = t.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of n) {
    const y = ((f = m.pos) == null ? void 0 : f[0]) ?? 0, M = ((d = m.pos) == null ? void 0 : d[1]) ?? 0, It = ((p = m.size) == null ? void 0 : p[0]) ?? 0, Lt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (o >= y && r >= M && o + s <= y + It && r + i <= M + Lt)
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
  let n = it.get(t);
  if (!(n != null && n.has(e))) {
    n || (n = /* @__PURE__ */ new Set(), it.set(t, n)), n.add(e);
    try {
      Yt(t, e);
    } catch {
    }
  }
}
function U() {
  H();
}
function $t(t, e) {
  let n = Object.getPrototypeOf(t);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, e);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
function Yt(t, e) {
  const n = Object.getOwnPropertyDescriptor(t, e);
  let o, r, s = !1;
  if (n)
    n.get || n.set ? (o = n.get, r = n.set) : s = !0;
  else {
    const i = $t(t, e);
    i && (i.get || i.set) ? (o = i.get, r = i.set) : s = !0;
  }
  if (!s)
    Object.defineProperty(t, e, {
      configurable: !0,
      enumerable: !0,
      get: () => o ? o.call(t) : void 0,
      set: (i) => {
        const c = o ? o.call(t) : void 0;
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
    for (const n of [...V])
      try {
        (e = n.refreshTitleRows) == null || e.call(n);
      } catch {
      }
  };
  typeof requestAnimationFrame == "function" ? requestAnimationFrame(t) : setTimeout(t, 16);
}
class O extends xt {
  constructor(e) {
    super(e), this.addInput("", "*"), $(this);
  }
  onConnectedNodesChanged(e) {
  }
  onConnectionsChange(e, n, o, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, e, n, o, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(C(this));
  }
  /**
   * Rename connected inputs to their source node's current title. Also the
   * prop-watch refresh hook: fires when a connected node is renamed or its
   * mode changes, without re-running connection logic (no mode re-application).
   */
  refreshTitleRows() {
    if (!this.inputs) return;
    let e = !1;
    for (let n = 0; n < this.inputs.length; n++) {
      const o = this.inputs[n];
      if (o.link == null) continue;
      const r = C(this, n)[0];
      if (!r) continue;
      N(r, "title"), N(r, "mode");
      const s = r.title || "";
      o.name !== s && (o.name = s, e = !0);
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
function Ct(t, e, n) {
  if (t.innerHTML = "", !e.length) {
    const o = document.createElement("div");
    o.className = "comfort-node-empty", o.textContent = n, t.appendChild(o);
    return;
  }
  e.forEach((o, r) => {
    const s = document.createElement("div");
    s.className = "comfort-node-row" + (o.on ? "" : " off"), s.dataset.idx = String(r);
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-toggle " + (o.on ? "on" : "off"), i.textContent = o.on ? "ON" : "OFF", s.appendChild(i);
    const c = document.createElement("span");
    c.className = "comfort-node-title", c.textContent = o.title, c.title = o.title, s.appendChild(c), t.appendChild(s);
  });
}
const qt = 260;
class Et extends O {
  constructor(e) {
    super(e), this.listEl = null, this.rows = [], this.setSize([qt, 150]), this.setupListWidget(), $(this);
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
    e && Ct(e, this.rows, "Connect nodes to control them");
  }
  bindListEvents() {
    const e = this.listEl;
    e && e.addEventListener("click", (n) => {
      const r = n.target.closest(".comfort-node-row");
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
    const e = C(this), n = [];
    for (const o of e) {
      N(o, "title"), N(o, "mode");
      const r = o.title || o.type || "node", s = o.mode === this.modeOn;
      n.push({ node: o, title: r, on: s });
    }
    this.rows = n, this.renderList();
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
    for (const n of this.rows)
      n.on = e === null ? !n.on : e, this.applyRowMode(n);
    this.renderList();
  }
}
const q = "Fast Muter (comfort)", K = "Fast Bypasser (comfort)";
class Kt extends Et {
  constructor() {
    super(q), this.modeOn = b, this.modeOff = x;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Zt extends Et {
  constructor() {
    super(K), this.modeOn = b, this.modeOff = E;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Qt = Kt, Xt = Zt, vt = "Node Collector (comfort)";
class Jt extends O {
  constructor() {
    super(vt), this.addOutput("Output", "*");
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const te = Jt, Z = "Mute / Bypass Repeater (comfort)";
class ee extends O {
  constructor() {
    super(Z), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(e) {
    if (this.configuring) return;
    const n = e;
    for (const o of n)
      o.mode !== this.mode && w(o, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(e, n) {
    if (this.configuring) return;
    const o = C(this);
    if (o.length) {
      for (const s of o) w(s, n);
      return;
    }
    const r = Vt(this);
    if (r)
      for (const s of W(r))
        s !== this && w(s, n);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const oe = ee;
function z(t) {
  return (t == null ? void 0 : t.type) === Z;
}
const Nt = "Mode Relay (comfort)", ne = {
  ACTIVE: b,
  MUTE: x,
  BYPASS: E,
  NOTHING: -99
}, re = {
  [x]: "on_muted_inputs",
  [E]: "on_bypassed_inputs",
  [b]: "on_any_active_inputs"
};
class se extends O {
  constructor() {
    super(Nt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    });
  }
  onConnectedNodesChanged(e) {
    this.evaluate();
  }
  onModeChange(e, n) {
    if (super.onModeChange(e, n), this.configuring || C(this).length) return;
    const r = st(this).filter(z);
    for (const s of r)
      s.mode !== n && w(s, n);
  }
  onConnectOutput(e, n, o, r, s) {
    return r ? z(r) : !0;
  }
  evaluate() {
    var c;
    if (this.configuring) return;
    const e = C(this);
    let n;
    for (const a of e) {
      const l = a.mode;
      if (n === void 0) n = l;
      else {
        if (n === l && (l === x || l === E)) continue;
        l === b || n === b ? n = b : n = void 0;
      }
    }
    if (n === void 0) return;
    const o = re[n], r = o ? ne[String((c = this.properties) == null ? void 0 : c[o])] : n, s = r !== void 0 ? r : n;
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
const ie = se, kt = "Random Unmuter (comfort)";
class ce extends O {
  constructor() {
    super(kt), this.tempEnabled = null, ct.register(this);
  }
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const e = C(this);
    if (!e.length || !e.every((r) => r.mode === x)) return;
    const o = e[Math.floor(Math.random() * e.length)];
    o && (w(o, b), this.tempEnabled = o);
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
    L.add(t), le();
  },
  unregister(t) {
    L.delete(t);
  }
};
let lt = !1;
function le() {
  if (lt) return;
  lt = !0;
  const t = k, e = t.queuePrompt;
  let n = !1;
  t.queuePrompt = async function(...r) {
    n = !0;
    try {
      return await e.apply(t, r);
    } finally {
      n = !1;
    }
  };
  const o = t.graphToPrompt;
  t.graphToPrompt = function(...r) {
    if (n)
      for (const c of L)
        try {
          c.onPromptStart();
        } catch {
        }
    const s = o.apply(t, r), i = () => {
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
const ae = ce, Q = "Fast Groups Muter (comfort)", X = "Fast Groups Bypasser (comfort)", ue = 280;
function fe(t) {
  const e = t.graph;
  if (!e) return [];
  const n = /* @__PURE__ */ new Set(), o = [], r = (s) => {
    var i;
    if (!(!s || n.has(s))) {
      n.add(s);
      for (const c of s._groups || s.groups || []) o.push(c);
      for (const c of s._subgraphs || []) r(c);
      for (const c of s._nodes || [])
        (i = c.subgraph) != null && i._groups && r(c.subgraph);
    }
  };
  return r(e), o.sort((s, i) => {
    var f, d, p, h;
    const c = ((f = s.pos) == null ? void 0 : f[1]) ?? 0, a = ((d = i.pos) == null ? void 0 : d[1]) ?? 0;
    if (c !== a) return c - a;
    const l = ((p = s.pos) == null ? void 0 : p[0]) ?? 0, u = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== u ? l - u : String(s.title || "").localeCompare(String(i.title || ""));
  }), o;
}
class Ot extends xt {
  constructor(e) {
    super(e), this.modeOn = b, this.listEl = null, this.rows = [], this.lastKey = "", this.setSize([ue, 150]), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), $(this);
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
      const o = e.target.closest(".comfort-node-row");
      if (!o) return;
      const r = this.rows[Number(o.dataset.idx)];
      r && (this.applyGroupMode(r, !r.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(e, n) {
    const o = W(e.group);
    w(o, n ? this.modeOn : this.modeOff);
  }
  refresh() {
    var s;
    this.ensureGraphHooks();
    const e = fe(this), n = String(((s = this.properties) == null ? void 0 : s.matchTitle) || "").trim();
    let o = e.map((i) => {
      N(i, "title");
      const c = W(i);
      for (const a of c) N(a, "mode");
      return {
        group: i,
        title: String(i.title || "group"),
        on: c.some((a) => a.mode === b)
      };
    });
    if (n)
      try {
        const i = new RegExp(n, "i");
        o = o.filter((c) => i.test(c.title));
      } catch {
        o = o.filter((i) => i.title.toLowerCase().includes(n.toLowerCase()));
      }
    const r = o.map((i) => i.title + (i.on ? 1 : 0)).join("|");
    r !== this.lastKey && (this.lastKey = r, this.rows = o, this.renderList());
  }
  renderList() {
    const e = this.listEl;
    e && Ct(e, this.rows, "No groups in this workflow");
  }
  setAllGroups(e) {
    for (const n of this.rows) {
      const o = e === null ? !n.on : e;
      this.applyGroupMode(n, o);
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
    const n = e.on_change;
    e.on_change = function(s) {
      n == null || n.call(s, s), U();
    };
    const o = e.add;
    e.add = function(...s) {
      const i = o.apply(this, s);
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
class pe extends Ot {
  constructor() {
    super(Q), this.modeOff = x;
  }
}
class de extends Ot {
  constructor() {
    super(X), this.modeOff = E;
  }
}
const at = /* @__PURE__ */ new WeakSet(), he = pe, me = de, ut = /* @__PURE__ */ new Set();
function _(t, e) {
  ut.has(t) || (ut.add(t), e.category = "comfort", LiteGraph.registerNodeType(t, e));
}
function ge() {
  _(q, Qt), _(K, Xt), _(vt, te), _(Z, oe), _(Nt, ie), _(kt, ae), _(Q, he), _(X, me);
}
function ye(t) {
  return (t == null ? void 0 : t.type) === q || (t == null ? void 0 : t.type) === K;
}
function be(t) {
  return (t == null ? void 0 : t.type) === Q || (t == null ? void 0 : t.type) === X;
}
const we = 10, xe = /[/\\]/, ft = "__comfort_original";
function _e(t, e) {
  const n = e == null ? void 0 : e.callback, o = /* @__PURE__ */ new Map(), r = [];
  for (const l of t) {
    if (l == null) {
      r.push(l);
      continue;
    }
    const u = String(l), f = u.indexOf("/") > -1 ? "/" : "\\", d = u.indexOf(f);
    if (d > -1) {
      const p = u.slice(0, d), h = u.slice(d + 1);
      o.has(p) || o.set(p, []), o.get(p).push({ full: u, sub: h });
    } else
      r.push(l);
  }
  const s = (l, u) => ({
    content: u,
    [ft]: l,
    callback: (f) => n == null ? void 0 : n(f[ft])
  }), i = [], c = [...o.keys()].sort((l, u) => l.localeCompare(u));
  for (const l of c) {
    const u = o.get(l).map((f) => s(f.full, f.sub));
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
  if (!Array.isArray(t) || !t.every((o) => o == null || typeof o == "string")) return t;
  let e = !1;
  const n = t.filter((o) => {
    if (o == null) return !0;
    const r = String(o).split(/[\/]/);
    return r[r.length - 1].startsWith(".") ? (e = !0, !1) : !0;
  });
  return e ? n : t;
}
function dt(t, e) {
  return !Array.isArray(t) || t.length < we ? { values: t, options: e } : (e == null ? void 0 : e.className) !== "dark" ? { values: t, options: e } : t.every((n) => n == null || typeof n == "string") ? t.some((n) => typeof n == "string" && xe.test(n)) ? _e(t, e) : { values: t, options: e } : { values: t, options: e };
}
function Ce() {
  const t = LiteGraph.ContextMenu;
  if (!t || t.__comfortAutoNest) return;
  const e = new Proxy(t, {
    construct(n, o, r) {
      const [s, i] = o, c = dt(pt(s), i);
      return Reflect.construct(n, [c.values, c.options], r);
    },
    apply(n, o, r) {
      const [s, i] = r, c = dt(pt(s), i);
      return n.call(o, c.values, c.options);
    }
  });
  e.__comfortAutoNest = !0, LiteGraph.ContextMenu = e;
}
const A = "Any Router (comfort)", Mt = 5, D = 8;
function v(t) {
  return (t.inputs || []).filter((e) => e && e.name && e.name.startsWith("any_"));
}
function Rt(t) {
  var e;
  return (t == null ? void 0 : t.type) === A || (t == null ? void 0 : t.comfyClass) === A || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === A;
}
function J(t) {
  const e = v(t).length + 1;
  return "any_" + String(e).padStart(2, "0");
}
function Ee(t) {
  const e = (t.widgets || []).find((n) => n.name === "selection");
  return e && e.value === "active_source" ? "active_source" : "non_empty";
}
function ve(t, e, n) {
  var c, a;
  const o = t.graph || k.graph;
  if (!o) return null;
  let r = t, s = n, i = e;
  for (let l = 0; l < 12; l++) {
    const u = i === "input" ? (c = r.inputs) == null ? void 0 : c[s] : (a = r.outputs) == null ? void 0 : a[s];
    if (!u) return null;
    if (u.type != null && u.type !== "*") return String(u.type);
    const f = i === "input" ? u.link : u.links && u.links[0];
    if (f == null) return null;
    const d = o.links && (o.links.get ? o.links.get(f) : o.links[f]) || null;
    if (!d || (i === "input" ? (r = o.getNodeById(d.origin_id), s = d.origin_slot, i = "output") : (r = o.getNodeById(d.target_id), s = d.target_slot, i = "input"), !r)) return null;
  }
  return null;
}
function Ne(t) {
  const e = t.inputs || [];
  for (let n = 0; n < e.length; n++) {
    if (e[n].link == null) continue;
    const o = ve(t, "input", n);
    if (o && o !== "*") return o;
  }
  return "*";
}
function At(t) {
  if (t.removed || !t.inputs) return;
  const e = v(t).filter((s) => s.link != null).length, n = Math.max(Mt, e + 1);
  let o = v(t).length;
  for (; o < n; )
    t.addInput(J(t), "*"), o++;
  for (; o > n; ) {
    const s = t.inputs[t.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      t.removeInput(t.inputs.length - 1), o--;
    else
      break;
  }
  const r = Ne(t);
  for (const s of v(t)) s.type = r;
  for (const s of t.outputs || [])
    s.type = r, s.label = String(r);
}
const G = /* @__PURE__ */ new WeakMap();
function ke(t) {
  const e = G.get(t);
  e != null && window.clearTimeout(e), G.set(
    t,
    window.setTimeout(() => {
      G.delete(t), t.removed || At(t);
    }, 64)
  );
}
function Oe(t) {
  if (!t || t.__comfortAnyRouter) return;
  t.__comfortAnyRouter = !0, t.prototype.stabilizeComfortAnyRouter = function() {
    At(this);
  }, t.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const e = t.prototype.configure;
  t.prototype.configure = function(o) {
    try {
      const s = (o && o.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; v(this).length < s; )
        this.addInput(J(this), "*");
    } catch {
    }
    const r = e ? e.call(this, o) : void 0;
    try {
      this.removed || (this.__comfortLoaded = !0, this.stabilizeComfortAnyRouter(), St(this));
    } catch {
    }
    return r;
  };
  const n = t.prototype.onConnectionsChange;
  t.prototype.onConnectionsChange = function(...o) {
    const r = n ? n.apply(this, o) : void 0;
    try {
      ke(this);
    } catch {
    }
    return r;
  };
}
function St(t) {
  if (t.__comfortSpacer || typeof t.addDOMWidget != "function") return;
  const e = document.createElement("div");
  e.className = "comfort-spacer", e.style.height = D + "px";
  const n = t.addDOMWidget("comfort_spacer", "comfort_spacer", e, {
    serialize: !1,
    hideOnZoom: !0,
    getValue: () => null,
    setValue: () => {
    },
    getMinHeight: () => D,
    getMaxHeight: () => D
  }), o = t.widgets || [], r = o.indexOf(n);
  r > 0 && (o.splice(r, 1), o.unshift(n)), t.__comfortSpacer = !0;
}
function Me(t) {
  try {
    if (typeof t.computeSize != "function" || !t.size) return;
    const e = t.computeSize();
    e && t.size[1] < e[1] && (t.setSize([t.size[0], e[1]]), typeof t.setDirtyCanvas == "function" && t.setDirtyCanvas(!0, !0));
  } catch {
  }
}
function Re(t) {
  let e = 0;
  for (; v(t).length < Mt && e++ < 24; )
    t.addInput(J(t), "*");
  St(t), t.__comfortLoaded || Me(t), Se();
}
function Ae(t) {
  return !!t && t.mode !== x && t.mode !== E;
}
function ht(t) {
  if (!t || typeof t != "object") return;
  const e = t.output, n = k.graph;
  if (!(!e || !n || !n.nodes))
    for (const o of n.nodes) {
      if (!Rt(o) || o.mode === x || o.mode === E || Ee(o) !== "active_source") continue;
      const r = e[o.id];
      if (!r || !r.inputs) continue;
      const s = o.inputs || [];
      let i = null;
      for (let c = 0; c < s.length; c++) {
        const a = o.getInputNode ? o.getInputNode(c) : null;
        if (Ae(a)) {
          i = s[c].name;
          break;
        }
      }
      for (const c of Object.keys(r.inputs))
        c.startsWith("any_") && c !== i && delete r.inputs[c];
    }
}
let mt = !1;
function Se() {
  if (mt) return;
  mt = !0;
  const t = k, e = t.graphToPrompt;
  typeof e == "function" && (t.graphToPrompt = function(...n) {
    const o = e.apply(t, n);
    return o && typeof o.then == "function" ? o.then(
      (r) => (ht(r), r),
      (r) => {
        throw r;
      }
    ) : (ht(o), o);
  });
}
const S = "Image Comparer (comfort)", Ie = 512, gt = 488;
function Le(t) {
  var e;
  return (t == null ? void 0 : t.type) === S || (t == null ? void 0 : t.comfyClass) === S || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === S;
}
const B = /* @__PURE__ */ new WeakMap();
function yt(t) {
  var r, s;
  const e = new URLSearchParams({
    filename: t.filename,
    type: t.type,
    subfolder: t.subfolder
  }), n = k;
  let o;
  try {
    o = ((s = (r = n == null ? void 0 : n.api) == null ? void 0 : r.apiURL) == null ? void 0 : s.call(r, `/view?${e.toString()}`)) ?? `/view?${e.toString()}`;
  } catch {
    o = `/view?${e.toString()}`;
  }
  return typeof (n == null ? void 0 : n.getPreviewFormatParam) == "function" && (o += n.getPreviewFormatParam()), typeof (n == null ? void 0 : n.getRandParam) == "function" && (o += n.getRandParam()), o;
}
function j(t, e) {
  t.handle.style.left = `${e}%`, t.leftImg.style.clipPath = `inset(0 ${100 - e}% 0 0)`;
}
function Pe(t) {
  t.navEl.innerHTML = "";
  const e = [
    { label: "LEFT", count: t.leftUrls.length, idx: () => t.leftIdx, set: (n) => {
      t.leftIdx = n, t.leftImg.src = t.leftUrls[n] || "";
    } },
    { label: "RIGHT", count: t.rightUrls.length, idx: () => t.rightIdx, set: (n) => {
      t.rightIdx = n, t.rightImg.src = t.rightUrls[n] || "";
    } }
  ];
  for (const n of e) {
    if (n.count <= 1) continue;
    const o = document.createElement("span");
    o.className = "ci-nav-side";
    const r = document.createElement("button");
    r.type = "button", r.textContent = "‹", r.addEventListener("click", () => n.set(Math.max(0, n.idx() - 1)));
    const s = document.createElement("span");
    s.textContent = `${n.label} ${n.idx() + 1}/${n.count}`;
    const i = document.createElement("button");
    i.type = "button", i.textContent = "›", i.addEventListener("click", () => n.set(Math.min(n.count - 1, n.idx() + 1))), o.appendChild(r), o.appendChild(s), o.appendChild(i), t.navEl.appendChild(o);
  }
}
function Te(t, e, n) {
  t.leftUrls = e, t.rightUrls = n, t.leftIdx >= t.leftUrls.length && (t.leftIdx = 0), t.rightIdx >= t.rightUrls.length && (t.rightIdx = 0);
  const o = t.leftUrls.length > 0, r = t.rightUrls.length > 0;
  t.leftImg.src = o ? t.leftUrls[t.leftIdx] : "", t.rightImg.src = r ? t.rightUrls[t.rightIdx] : "", t.leftImg.style.display = o ? "" : "none", t.rightImg.style.display = r ? "" : "none", t.handle.style.display = "none", t.leftImg.style.clipPath = "none", t.empty.style.display = o || r ? "none" : "", j(t, 100), Pe(t);
}
function Fe(t, e) {
  const n = B.get(t);
  if (!n) return;
  const o = e || {}, r = Array.isArray(o.left_images) ? o.left_images.map(yt) : [], s = Array.isArray(o.right_images) ? o.right_images.map(yt) : [];
  Te(n, r, s);
}
function Ue(t) {
  var f, d;
  if (B.has(t)) return;
  const e = document.createElement("div");
  e.className = "comfort-image-comparer";
  const n = document.createElement("div");
  n.className = "ci-nav", e.appendChild(n);
  const o = document.createElement("div");
  o.className = "ci-stage";
  const r = document.createElement("img");
  r.className = "ci-img ci-right", r.draggable = !1;
  const s = document.createElement("img");
  s.className = "ci-img ci-left", s.draggable = !1;
  const i = document.createElement("div");
  i.className = "ci-handle";
  const c = document.createElement("div");
  c.className = "ci-empty", c.textContent = "Connect images and run", o.appendChild(r), o.appendChild(s), o.appendChild(i), o.appendChild(c), e.appendChild(o);
  const a = {
    el: e,
    stage: o,
    leftImg: s,
    rightImg: r,
    handle: i,
    empty: c,
    navEl: n,
    leftUrls: [],
    rightUrls: [],
    leftIdx: 0,
    rightIdx: 0,
    rafId: null
  };
  B.set(t, a), o.addEventListener("mouseenter", () => {
    a.leftUrls.length && a.rightUrls.length && (a.handle.style.display = "");
  }), o.addEventListener("mouseleave", () => {
    a.handle.style.display = "none", j(a, 100);
  }), o.addEventListener("mousemove", (p) => {
    const h = o.getBoundingClientRect();
    if (h.width <= 0) return;
    const m = Math.max(0, Math.min(100, (p.clientX - h.left) / h.width * 100));
    j(a, m);
  }), t.__comfortLoaded || (f = t.setSize) == null || f.call(t, [Ie, gt]), typeof t.addDOMWidget == "function" && t.addDOMWidget("compare", "comfort_image_compare", e, {
    serialize: !1,
    hideOnZoom: !0
  });
  const l = () => {
    var y;
    if (!t.graph) {
      a.rafId = null;
      return;
    }
    const p = t.size ? t.size[1] : gt, h = (y = t.widgets) == null ? void 0 : y.find((M) => M.name === "compare"), m = h && typeof h.y == "number" ? h.y : 20;
    e.style.height = Math.max(60, p - m - 20) + "px", a.rafId = requestAnimationFrame(l);
  };
  a.rafId = requestAnimationFrame(l);
  const u = (d = t.onRemoved) == null ? void 0 : d.bind(t);
  t.onRemoved = (...p) => {
    a.rafId !== null && cancelAnimationFrame(a.rafId), u == null || u(...p);
  };
}
function ze(t) {
  if (!t || t.__comfortImageComparer) return;
  const e = t.prototype.onExecuted;
  t.prototype.onExecuted = function(o) {
    e == null || e.call(this, o), Fe(this, o);
  };
  const n = t.prototype.configure;
  t.prototype.configure = function(o) {
    n == null || n.call(this, o), this.__comfortLoaded = !0;
  }, t.__comfortImageComparer = !0;
}
const De = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;flex-shrink:0;min-width:118px;justify-content:center}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{min-width:44px;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer;flex-shrink:0;white-space:nowrap}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 0;min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px;flex-shrink:0}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0;flex-shrink:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{width:100%;box-sizing:border-box;padding:4px 6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer;white-space:nowrap;margin:0}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-image-comparer{display:flex;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0}.ci-nav{min-height:28px;flex-shrink:0;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb;min-width:0}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;min-width:0;flex:1;min-height:100px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}", tt = document.createElement("style");
tt.setAttribute("data-comfort-plugin", "true");
tt.textContent = De;
document.head.appendChild(tt);
ge();
Ce();
k.registerExtension({
  name: "comfort.PowerLoraLoader",
  beforeRegisterNodeDef(t, e) {
    if (e && e.name === A && Oe(t), e && e.name === S && ze(t), e && e.name === R) {
      const n = t.prototype.configure;
      t.prototype.configure = function(o) {
        return this.__comfortLoaded = !0, n.call(this, o);
      };
    }
  },
  nodeCreated(t) {
    if (et(t)) {
      Bt(t);
      return;
    }
    if (Rt(t)) {
      Re(t);
      return;
    }
    Le(t) && Ue(t);
  },
  getNodeMenuItems(t) {
    if (et(t)) {
      const e = Tt(t);
      if (e) {
        const n = (o) => {
          e.showSeparate = o, Dt(t);
        };
        return [
          null,
          {
            content: "Show Strengths",
            has_submenu: !0,
            submenu: {
              options: [
                { content: "Single Strength", checked: () => !e.showSeparate, callback: () => n(!1) },
                { content: "Separate Model & Clip", checked: () => e.showSeparate, callback: () => n(!0) }
              ]
            }
          }
        ];
      }
    }
    if (ye(t)) {
      const e = (n) => {
        var o;
        return (o = t.setAllRows) == null ? void 0 : o.call(t, n);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    if (be(t)) {
      const e = (n) => {
        var o;
        return (o = t.setAllGroups) == null ? void 0 : o.call(t, n);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    return [];
  }
});
export {
  R as NODE_NAME
};
