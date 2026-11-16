import { app as N } from "/scripts/app.js";
const R = "Power Lora Loader (comfort)", L = /* @__PURE__ */ new WeakMap(), Ft = 380;
function ot(t) {
  var e;
  return (t == null ? void 0 : t.type) === R || (t == null ? void 0 : t.comfyClass) === R || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === R;
}
function Ut(t) {
  return L.get(t);
}
function Dt(t) {
  return { lora: t ?? null, on: !0, strength: 1, strengthTwo: null };
}
function Ct(t) {
  let e = !0, n = !0;
  for (const o of t.rows)
    if (e = e && o.on === !0, n = n && o.on === !1, !e && !n) return null;
  return !!(e && t.rows.length > 0);
}
function Gt(t) {
  const e = !Ct(t);
  for (const n of t.rows) n.on = e;
}
function nt(t, e, n) {
  const o = n ? "strengthTwo" : "strength", r = t[o] ?? 1;
  t[o] = Math.round((r + e * 0.05) * 100) / 100;
}
function _t(t, e) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (t ? "on" : "off"), n.textContent = e, n;
}
function z(t) {
  const e = document.createElement("span");
  return e.className = "comfort-col-label", e.textContent = t, e;
}
function F(t, e) {
  const n = document.createElement("div");
  n.className = "comfort-strength" + (e === "two" ? " comfort-strength-clip" : "");
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-dec", o.textContent = "−", o.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(e === "two" ? t.strengthTwo ?? 1 : t.strength), s.title = e === "two" ? "Clip strength" : "Strength", n.appendChild(o), n.appendChild(s), n.appendChild(r), n;
}
function Wt(t, e, n) {
  const o = document.createElement("div");
  o.className = "comfort-lora-row" + (e.on ? "" : " off"), o.dataset.idx = String(n), o.appendChild(_t(e.on, e.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = e.lora || "None", r.title = e.lora || "No lora selected - click to choose", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", o.appendChild(s), t.showSeparate ? (o.appendChild(F(e, "one")), o.appendChild(F(e, "two"))) : o.appendChild(F(e, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", o.appendChild(i), o;
}
function g(t) {
  const e = t.el;
  e.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const o = Ct(t), r = _t(o !== !1, o === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", t.showSeparate ? (s.appendChild(z("Model")), s.appendChild(z("Clip"))) : s.appendChild(z("Strength")), n.appendChild(s), e.appendChild(n), t.rows.forEach((a, l) => e.appendChild(Wt(t, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), e.appendChild(i);
}
function Ht(t) {
  const e = L.get(t);
  e && g(e);
}
async function Bt() {
  try {
    const t = await fetch("/api/models/loras");
    if (!t.ok) return [];
    const e = await t.json();
    return Array.isArray(e) ? e : (e == null ? void 0 : e.name) ?? [];
  } catch {
    return [];
  }
}
async function rt(t, e, n, o) {
  const r = await Bt() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: n,
    className: "dark",
    callback: (i) => {
      i !== "(no loras found)" && o(i);
    }
  });
}
function jt(t, e, n, o) {
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
function Vt(t, e) {
  const n = e.el;
  n.addEventListener("click", (o) => {
    const r = o.target;
    if (r.closest(".comfort-toggle-all")) {
      Gt(e), g(e);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      rt(e, t, o, (l) => {
        e.rows.push(Dt(l)), g(e);
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
      rt(e, t, o, (l) => {
        c.lora = l, g(e);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      nt(c, -1, a), g(e);
      return;
    }
    if (r.closest(".comfort-inc")) {
      nt(c, 1, a), g(e);
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
    r && (o.preventDefault(), o.stopPropagation(), jt(t, e, Number(r.dataset.idx), o));
  });
}
function $t(t) {
  var n, o;
  if (L.has(t)) return;
  const e = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  e.el.className = "comfort-lora-list", L.set(t, e), t.serialize_widgets = !0, typeof t.addDOMWidget == "function" && t.addDOMWidget("loras", "comfort_lora_list", e.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => e.rows,
    setValue: (r) => {
      e.rows = Array.isArray(r) ? r : [], g(e);
    }
  }), Vt(t, e), g(e), t.__comfortLoaded || (o = t.setSize) == null || o.call(t, [Math.max(((n = t.size) == null ? void 0 : n[0]) || 0, Ft), 150]);
}
function Yt(t, e) {
  let n = Object.getPrototypeOf(t);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, e);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
class vt extends LGraphNode {
  constructor(e) {
    super(e), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  installModeInterceptor() {
    const e = Yt(this, "mode"), n = () => e != null && e.get ? e.get.call(this) : this.__comfort_mode;
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
const b = 0, x = 2, v = 4;
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
function st(t) {
  var n;
  const e = (t == null ? void 0 : t.type) || ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.type) || "";
  return e.includes("Reroute") || e.includes("Node Collector") || e.includes("Node Combiner");
}
function Et(t, e, n) {
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
      !y || s.has(y) || (st(y) ? i(y) : r.push(y));
    }
  };
  if (n != null) {
    const f = e === "OUTPUT" ? ((a = (c = t.outputs) == null ? void 0 : c[n]) == null ? void 0 : a.links) || [] : [(u = (l = t.inputs) == null ? void 0 : l[n]) == null ? void 0 : u.link];
    for (const d of f) {
      if (d == null) continue;
      const p = o.links[d];
      if (!p) continue;
      const h = e === "OUTPUT" ? p.target_id : p.origin_id, m = o.getNodeById(h);
      !m || s.has(m) || (st(m) ? i(m) : r.push(m));
    }
  } else
    i(t);
  return r;
}
function _(t, e) {
  return Et(t, "INPUT", e);
}
function it(t, e) {
  return Et(t, "OUTPUT", e);
}
function j(t) {
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
function qt(t) {
  var c, a, l, u, f, d, p, h;
  const e = t.graph;
  if (!e) return null;
  const n = e._groups || e.groups || [], o = ((c = t.pos) == null ? void 0 : c[0]) ?? 0, r = ((a = t.pos) == null ? void 0 : a[1]) ?? 0, s = ((l = t.size) == null ? void 0 : l[0]) ?? 0, i = ((u = t.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of n) {
    const y = ((f = m.pos) == null ? void 0 : f[0]) ?? 0, M = ((d = m.pos) == null ? void 0 : d[1]) ?? 0, Pt = ((p = m.size) == null ? void 0 : p[0]) ?? 0, zt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (o >= y && r >= M && o + s <= y + Pt && r + i <= M + zt)
      return m;
  }
  return null;
}
const V = /* @__PURE__ */ new Set(), ct = /* @__PURE__ */ new WeakSet();
let U = !1;
function $(t) {
  V.add(t);
}
function Y(t) {
  V.delete(t);
}
function q(t) {
  if (!t || ct.has(t)) return;
  ct.add(t);
  let e = t.title;
  try {
    Object.defineProperty(t, "title", {
      configurable: !0,
      enumerable: !0,
      get: () => e,
      set: (n) => {
        n !== e && (e = n, Kt());
      }
    });
  } catch {
  }
}
function Kt() {
  if (U) return;
  U = !0;
  const t = () => {
    var e;
    U = !1;
    for (const n of [...V])
      try {
        (e = n.refreshTitleRows) == null || e.call(n);
      } catch {
      }
  };
  typeof requestAnimationFrame == "function" ? requestAnimationFrame(t) : setTimeout(t, 16);
}
class k extends vt {
  constructor(e) {
    super(e), this.addInput("", "*"), $(this);
  }
  onConnectedNodesChanged(e) {
  }
  onConnectionsChange(e, n, o, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, e, n, o, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(_(this));
  }
  /**
   * Rename connected inputs to their source node's current title. Also the
   * title-watch refresh hook: fires when a connected node is renamed, without
   * re-running connection logic (no mode re-application).
   */
  refreshTitleRows() {
    if (!this.inputs) return;
    let e = !1;
    for (let n = 0; n < this.inputs.length; n++) {
      const o = this.inputs[n];
      if (o.link == null) continue;
      const r = _(this, n)[0];
      if (!r) continue;
      q(r);
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
function Nt(t, e, n) {
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
const Zt = 260;
class kt extends k {
  constructor(e) {
    super(e), this.listEl = null, this.rows = [], this.setSize([Zt, 150]), this.setupListWidget(), $(this);
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
    e && Nt(e, this.rows, "Connect nodes to control them");
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
    const e = _(this), n = [];
    for (const o of e) {
      q(o);
      const r = o.title || o.type || "node", s = this.rows.find((c) => c.node === o), i = s ? s.on : o.mode === this.modeOn;
      n.push({ node: o, title: r, on: i });
    }
    this.rows = n, this.renderList();
  }
  /** Title-watch hook: rows show connected node titles; refresh on rename. */
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
const K = "Fast Muter (comfort)", Z = "Fast Bypasser (comfort)";
class Jt extends kt {
  constructor() {
    super(K), this.modeOn = b, this.modeOff = x;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Qt extends kt {
  constructor() {
    super(Z), this.modeOn = b, this.modeOff = v;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Xt = Jt, te = Qt, Mt = "Node Collector (comfort)";
class ee extends k {
  constructor() {
    super(Mt), this.addOutput("Output", "*");
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const oe = ee, J = "Mute / Bypass Repeater (comfort)";
class ne extends k {
  constructor() {
    super(J), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
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
    const o = _(this);
    if (o.length) {
      for (const s of o) w(s, n);
      return;
    }
    const r = qt(this);
    if (r)
      for (const s of j(r))
        s !== this && w(s, n);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const re = ne;
function D(t) {
  return (t == null ? void 0 : t.type) === J;
}
const se = 500;
class ie {
  constructor() {
    this.timer = null, this.counter = 0, this.jobs = /* @__PURE__ */ new Map();
  }
  schedule(e, n) {
    this.jobs.set(e, Math.max(1, n)), this.ensureTimer();
  }
  unschedule(e) {
    this.jobs.delete(e), this.jobs.size || this.stopTimer();
  }
  ensureTimer() {
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), se));
  }
  stopTimer() {
    this.timer != null && (window.clearInterval(this.timer), this.timer = null);
  }
  tick() {
    this.counter = (this.counter + 1) % 1e6;
    for (const [e, n] of this.jobs)
      if (this.counter % n === 0)
        try {
          e();
        } catch {
        }
  }
}
const T = new ie(), Rt = "Mode Relay (comfort)", ce = {
  ACTIVE: b,
  MUTE: x,
  BYPASS: v,
  NOTHING: -99
}, le = {
  [x]: "on_muted_inputs",
  [v]: "on_bypassed_inputs",
  [b]: "on_any_active_inputs"
};
class ae extends k {
  constructor() {
    super(Rt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), at.register(this);
  }
  onConnectedNodesChanged(e) {
    this.evaluate();
  }
  onModeChange(e, n) {
    if (super.onModeChange(e, n), this.configuring || _(this).length) return;
    const r = it(this).filter(D);
    for (const s of r)
      s.mode !== n && w(s, n);
  }
  onConnectOutput(e, n, o, r, s) {
    return r ? D(r) : !0;
  }
  evaluate() {
    var c;
    if (this.configuring) return;
    const e = _(this);
    let n;
    for (const a of e) {
      const l = a.mode;
      if (n === void 0) n = l;
      else {
        if (n === l && (l === x || l === v)) continue;
        l === b || n === b ? n = b : n = void 0;
      }
    }
    if (n === void 0) return;
    const o = le[n], r = o ? ce[String((c = this.properties) == null ? void 0 : c[o])] : n, s = r !== void 0 ? r : n;
    if (s === -99) return;
    const i = it(this).filter(D);
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
  onRemoved() {
    var e;
    at.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const O = /* @__PURE__ */ new Set(), lt = () => {
  for (const t of O)
    try {
      t.evaluate();
    } catch {
    }
}, at = {
  register(t) {
    O.add(t), T.schedule(lt, 1);
  },
  unregister(t) {
    O.delete(t), O.size || T.unschedule(lt);
  }
}, ue = ae, Ot = "Random Unmuter (comfort)";
class fe extends k {
  constructor() {
    super(Ot), this.tempEnabled = null, ut.register(this);
  }
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const e = _(this);
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
    ut.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const P = /* @__PURE__ */ new Set(), ut = {
  register(t) {
    P.add(t), pe();
  },
  unregister(t) {
    P.delete(t);
  }
};
let ft = !1;
function pe() {
  if (ft) return;
  ft = !0;
  const t = N, e = t.queuePrompt;
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
      for (const c of P)
        try {
          c.onPromptStart();
        } catch {
        }
    const s = o.apply(t, r), i = () => {
      for (const c of P)
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
const de = fe, Q = "Fast Groups Muter (comfort)", X = "Fast Groups Bypasser (comfort)", he = 280;
function me(t) {
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
function ge(t) {
  return j(t).some((e) => e.mode === b);
}
class At extends vt {
  constructor(e) {
    super(e), this.modeOn = b, this.listEl = null, this.rows = [], this.lastKey = "", this.setSize([he, 150]), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), dt.register(this), $(this);
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
    const o = j(e.group);
    w(o, n ? this.modeOn : this.modeOff);
  }
  refresh() {
    var s;
    const e = me(this), n = String(((s = this.properties) == null ? void 0 : s.matchTitle) || "").trim();
    let o = e.map((i) => (q(i), {
      group: i,
      title: String(i.title || "group"),
      on: ge(i)
    }));
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
    e && Nt(e, this.rows, "No groups in this workflow");
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
  /** Title-watch hook: rows show group titles; refresh on rename. */
  refreshTitleRows() {
    this.refresh();
  }
  onRemoved() {
    var e;
    dt.unregister(this), Y(this), (e = super.onRemoved) == null || e.call(this);
  }
}
class ye extends At {
  constructor() {
    super(Q), this.modeOff = x;
  }
}
class be extends At {
  constructor() {
    super(X), this.modeOff = v;
  }
}
const A = /* @__PURE__ */ new Set(), pt = () => {
  for (const t of A)
    try {
      t.refresh();
    } catch {
    }
}, dt = {
  register(t) {
    A.add(t), T.schedule(pt, 2);
  },
  unregister(t) {
    A.delete(t), A.size || T.unschedule(pt);
  }
}, we = ye, xe = be, ht = /* @__PURE__ */ new Set();
function C(t, e) {
  ht.has(t) || (ht.add(t), e.category = "comfort", LiteGraph.registerNodeType(t, e));
}
function Ce() {
  C(K, Xt), C(Z, te), C(Mt, oe), C(J, re), C(Rt, ue), C(Ot, de), C(Q, we), C(X, xe);
}
function _e(t) {
  return (t == null ? void 0 : t.type) === K || (t == null ? void 0 : t.type) === Z;
}
function ve(t) {
  return (t == null ? void 0 : t.type) === Q || (t == null ? void 0 : t.type) === X;
}
const Ee = 10, Ne = /[/\\]/, mt = "__comfort_original";
function ke(t, e) {
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
    [mt]: l,
    callback: (f) => n == null ? void 0 : n(f[mt])
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
function gt(t, e) {
  return !Array.isArray(t) || t.length < Ee ? { values: t, options: e } : (e == null ? void 0 : e.className) !== "dark" ? { values: t, options: e } : t.every((n) => n == null || typeof n == "string") ? t.some((n) => typeof n == "string" && Ne.test(n)) ? ke(t, e) : { values: t, options: e } : { values: t, options: e };
}
function Me() {
  const t = LiteGraph.ContextMenu;
  if (!t || t.__comfortAutoNest) return;
  const e = new Proxy(t, {
    construct(n, o, r) {
      const [s, i] = o, c = gt(s, i);
      return Reflect.construct(n, [c.values, c.options], r);
    },
    apply(n, o, r) {
      const [s, i] = r, c = gt(s, i);
      return n.call(o, c.values, c.options);
    }
  });
  e.__comfortAutoNest = !0, LiteGraph.ContextMenu = e;
}
const I = "Any Router (comfort)", It = 5, G = 8;
function E(t) {
  return (t.inputs || []).filter((e) => e && e.name && e.name.startsWith("any_"));
}
function St(t) {
  var e;
  return (t == null ? void 0 : t.type) === I || (t == null ? void 0 : t.comfyClass) === I || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === I;
}
function tt(t) {
  const e = E(t).length + 1;
  return "any_" + String(e).padStart(2, "0");
}
function Re(t) {
  const e = (t.widgets || []).find((n) => n.name === "selection");
  return e && e.value === "active_source" ? "active_source" : "non_empty";
}
function Oe(t, e, n) {
  var c, a;
  const o = t.graph || N.graph;
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
function Ae(t) {
  const e = t.inputs || [];
  for (let n = 0; n < e.length; n++) {
    if (e[n].link == null) continue;
    const o = Oe(t, "input", n);
    if (o && o !== "*") return o;
  }
  return "*";
}
function Lt(t) {
  if (t.removed || !t.inputs) return;
  const e = E(t).filter((s) => s.link != null).length, n = Math.max(It, e + 1);
  let o = E(t).length;
  for (; o < n; )
    t.addInput(tt(t), "*"), o++;
  for (; o > n; ) {
    const s = t.inputs[t.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      t.removeInput(t.inputs.length - 1), o--;
    else
      break;
  }
  const r = Ae(t);
  for (const s of E(t)) s.type = r;
  for (const s of t.outputs || [])
    s.type = r, s.label = String(r);
}
const W = /* @__PURE__ */ new WeakMap();
function Ie(t) {
  const e = W.get(t);
  e != null && window.clearTimeout(e), W.set(
    t,
    window.setTimeout(() => {
      W.delete(t), t.removed || Lt(t);
    }, 64)
  );
}
function Se(t) {
  if (!t || t.__comfortAnyRouter) return;
  t.__comfortAnyRouter = !0, t.prototype.stabilizeComfortAnyRouter = function() {
    Lt(this);
  }, t.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const e = t.prototype.configure;
  t.prototype.configure = function(o) {
    try {
      const s = (o && o.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; E(this).length < s; )
        this.addInput(tt(this), "*");
    } catch {
    }
    const r = e ? e.call(this, o) : void 0;
    try {
      this.removed || (this.__comfortLoaded = !0, this.stabilizeComfortAnyRouter(), Tt(this));
    } catch {
    }
    return r;
  };
  const n = t.prototype.onConnectionsChange;
  t.prototype.onConnectionsChange = function(...o) {
    const r = n ? n.apply(this, o) : void 0;
    try {
      Ie(this);
    } catch {
    }
    return r;
  };
}
function Tt(t) {
  if (t.__comfortSpacer || typeof t.addDOMWidget != "function") return;
  const e = document.createElement("div");
  e.className = "comfort-spacer", e.style.height = G + "px";
  const n = t.addDOMWidget("comfort_spacer", "comfort_spacer", e, {
    serialize: !1,
    hideOnZoom: !0,
    getValue: () => null,
    setValue: () => {
    },
    getMinHeight: () => G,
    getMaxHeight: () => G
  }), o = t.widgets || [], r = o.indexOf(n);
  r > 0 && (o.splice(r, 1), o.unshift(n)), t.__comfortSpacer = !0;
}
function Le(t) {
  try {
    if (typeof t.computeSize != "function" || !t.size) return;
    const e = t.computeSize();
    e && t.size[1] < e[1] && (t.setSize([t.size[0], e[1]]), typeof t.setDirtyCanvas == "function" && t.setDirtyCanvas(!0, !0));
  } catch {
  }
}
function Te(t) {
  let e = 0;
  for (; E(t).length < It && e++ < 24; )
    t.addInput(tt(t), "*");
  Tt(t), t.__comfortLoaded || Le(t), ze();
}
function Pe(t) {
  return !!t && t.mode !== x && t.mode !== v;
}
function yt(t) {
  if (!t || typeof t != "object") return;
  const e = t.output, n = N.graph;
  if (!(!e || !n || !n.nodes))
    for (const o of n.nodes) {
      if (!St(o) || o.mode === x || o.mode === v || Re(o) !== "active_source") continue;
      const r = e[o.id];
      if (!r || !r.inputs) continue;
      const s = o.inputs || [];
      let i = null;
      for (let c = 0; c < s.length; c++) {
        const a = o.getInputNode ? o.getInputNode(c) : null;
        if (Pe(a)) {
          i = s[c].name;
          break;
        }
      }
      for (const c of Object.keys(r.inputs))
        c.startsWith("any_") && c !== i && delete r.inputs[c];
    }
}
let bt = !1;
function ze() {
  if (bt) return;
  bt = !0;
  const t = N, e = t.graphToPrompt;
  typeof e == "function" && (t.graphToPrompt = function(...n) {
    const o = e.apply(t, n);
    return o && typeof o.then == "function" ? o.then(
      (r) => (yt(r), r),
      (r) => {
        throw r;
      }
    ) : (yt(o), o);
  });
}
const S = "Image Comparer (comfort)", Fe = 512, wt = 488;
function Ue(t) {
  var e;
  return (t == null ? void 0 : t.type) === S || (t == null ? void 0 : t.comfyClass) === S || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === S;
}
const H = /* @__PURE__ */ new WeakMap();
function xt(t) {
  var r, s;
  const e = new URLSearchParams({
    filename: t.filename,
    type: t.type,
    subfolder: t.subfolder
  }), n = N;
  let o;
  try {
    o = ((s = (r = n == null ? void 0 : n.api) == null ? void 0 : r.apiURL) == null ? void 0 : s.call(r, `/view?${e.toString()}`)) ?? `/view?${e.toString()}`;
  } catch {
    o = `/view?${e.toString()}`;
  }
  return typeof (n == null ? void 0 : n.getPreviewFormatParam) == "function" && (o += n.getPreviewFormatParam()), typeof (n == null ? void 0 : n.getRandParam) == "function" && (o += n.getRandParam()), o;
}
function B(t, e) {
  t.handle.style.left = `${e}%`, t.leftImg.style.clipPath = `inset(0 ${100 - e}% 0 0)`;
}
function De(t) {
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
function Ge(t, e, n) {
  t.leftUrls = e, t.rightUrls = n, t.leftIdx >= t.leftUrls.length && (t.leftIdx = 0), t.rightIdx >= t.rightUrls.length && (t.rightIdx = 0);
  const o = t.leftUrls.length > 0, r = t.rightUrls.length > 0;
  t.leftImg.src = o ? t.leftUrls[t.leftIdx] : "", t.rightImg.src = r ? t.rightUrls[t.rightIdx] : "", t.leftImg.style.display = o ? "" : "none", t.rightImg.style.display = r ? "" : "none", t.handle.style.display = "none", t.leftImg.style.clipPath = "none", t.empty.style.display = o || r ? "none" : "", B(t, 100), De(t);
}
function We(t, e) {
  const n = H.get(t);
  if (!n) return;
  const o = e || {}, r = Array.isArray(o.left_images) ? o.left_images.map(xt) : [], s = Array.isArray(o.right_images) ? o.right_images.map(xt) : [];
  Ge(n, r, s);
}
function He(t) {
  var f, d;
  if (H.has(t)) return;
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
  H.set(t, a), o.addEventListener("mouseenter", () => {
    a.leftUrls.length && a.rightUrls.length && (a.handle.style.display = "");
  }), o.addEventListener("mouseleave", () => {
    a.handle.style.display = "none", B(a, 100);
  }), o.addEventListener("mousemove", (p) => {
    const h = o.getBoundingClientRect();
    if (h.width <= 0) return;
    const m = Math.max(0, Math.min(100, (p.clientX - h.left) / h.width * 100));
    B(a, m);
  }), t.__comfortLoaded || (f = t.setSize) == null || f.call(t, [Fe, wt]), typeof t.addDOMWidget == "function" && t.addDOMWidget("compare", "comfort_image_compare", e, {
    serialize: !1,
    hideOnZoom: !0
  });
  const l = () => {
    var y;
    if (!t.graph) {
      a.rafId = null;
      return;
    }
    const p = t.size ? t.size[1] : wt, h = (y = t.widgets) == null ? void 0 : y.find((M) => M.name === "compare"), m = h && typeof h.y == "number" ? h.y : 20;
    e.style.height = Math.max(60, p - m - 20) + "px", a.rafId = requestAnimationFrame(l);
  };
  a.rafId = requestAnimationFrame(l);
  const u = (d = t.onRemoved) == null ? void 0 : d.bind(t);
  t.onRemoved = (...p) => {
    a.rafId !== null && cancelAnimationFrame(a.rafId), u == null || u(...p);
  };
}
function Be(t) {
  if (!t || t.__comfortImageComparer) return;
  const e = t.prototype.onExecuted;
  t.prototype.onExecuted = function(o) {
    e == null || e.call(this, o), We(this, o);
  };
  const n = t.prototype.configure;
  t.prototype.configure = function(o) {
    n == null || n.call(this, o), this.__comfortLoaded = !0;
  }, t.__comfortImageComparer = !0;
}
const je = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;flex-shrink:0;min-width:118px;justify-content:center}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{min-width:44px;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer;flex-shrink:0;white-space:nowrap}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 0;min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px;flex-shrink:0}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0;flex-shrink:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{width:100%;box-sizing:border-box;padding:4px 6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer;white-space:nowrap;margin:0}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-image-comparer{display:flex;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0}.ci-nav{min-height:28px;flex-shrink:0;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb;min-width:0}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;min-width:0;flex:1;min-height:100px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}", et = document.createElement("style");
et.setAttribute("data-comfort-plugin", "true");
et.textContent = je;
document.head.appendChild(et);
Ce();
Me();
N.registerExtension({
  name: "comfort.PowerLoraLoader",
  beforeRegisterNodeDef(t, e) {
    if (e && e.name === I && Se(t), e && e.name === S && Be(t), e && e.name === R) {
      const n = t.prototype.configure;
      t.prototype.configure = function(o) {
        return this.__comfortLoaded = !0, n.call(this, o);
      };
    }
  },
  nodeCreated(t) {
    if (ot(t)) {
      $t(t);
      return;
    }
    if (St(t)) {
      Te(t);
      return;
    }
    Ue(t) && He(t);
  },
  getNodeMenuItems(t) {
    if (ot(t)) {
      const e = Ut(t);
      if (e) {
        const n = (o) => {
          e.showSeparate = o, Ht(t);
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
    if (_e(t)) {
      const e = (n) => {
        var o;
        return (o = t.setAllRows) == null ? void 0 : o.call(t, n);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    if (ve(t)) {
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
