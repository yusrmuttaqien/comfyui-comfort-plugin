import { app as v } from "/scripts/app.js";
const O = "Power Lora Loader (comfort)", T = /* @__PURE__ */ new WeakMap(), Ht = 380;
function rt(t) {
  var e;
  return (t == null ? void 0 : t.type) === O || (t == null ? void 0 : t.comfyClass) === O || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === O;
}
function jt(t) {
  return T.get(t);
}
function $t(t) {
  return { lora: t ?? null, on: !0, strength: 1, strengthTwo: null };
}
function Mt(t) {
  let e = !0, o = !0;
  for (const n of t.rows)
    if (e = e && n.on === !0, o = o && n.on === !1, !e && !o) return null;
  return !!(e && t.rows.length > 0);
}
function Vt(t) {
  const e = !Mt(t);
  for (const o of t.rows) o.on = e;
}
function st(t, e, o) {
  const n = o ? "strengthTwo" : "strength", r = t[n] ?? 1;
  t[n] = Math.round((r + e * 0.05) * 100) / 100;
}
function Rt(t, e) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (t ? "on" : "off"), o.textContent = e, o;
}
function D(t) {
  const e = document.createElement("span");
  return e.className = "comfort-col-label", e.textContent = t, e;
}
function G(t, e) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (e === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(e === "two" ? t.strengthTwo ?? 1 : t.strength), s.title = e === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(s), o.appendChild(r), o;
}
function Yt(t, e, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (e.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(Rt(e.on, e.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = e.lora || "None", r.title = e.lora || "No lora selected - click to choose", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", n.appendChild(s), t.showSeparate ? (n.appendChild(G(e, "one")), n.appendChild(G(e, "two"))) : n.appendChild(G(e, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(t) {
  const e = t.el;
  e.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = Mt(t), r = Rt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", t.showSeparate ? (s.appendChild(D("Model")), s.appendChild(D("Clip"))) : s.appendChild(D("Strength")), o.appendChild(s), e.appendChild(o), t.rows.forEach((u, l) => e.appendChild(Yt(t, u, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), e.appendChild(i);
}
function qt(t) {
  const e = T.get(t);
  e && g(e);
}
async function Kt() {
  try {
    const t = await fetch("/api/models/loras");
    if (!t.ok) return [];
    const e = await t.json();
    return Array.isArray(e) ? e : (e == null ? void 0 : e.name) ?? [];
  } catch {
    return [];
  }
}
async function it(t, e, o, n) {
  const r = await Kt() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: o,
    className: "dark",
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Zt(t, e, o, n) {
  const r = e.rows[o];
  if (!r) return;
  const s = o > 0, i = o < e.rows.length - 1, c = (u) => {
    const l = o + u;
    if (l < 0 || l >= e.rows.length) return;
    const a = e.rows[o];
    e.rows[o] = e.rows[l], e.rows[l] = a, g(e);
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
function Jt(t, e) {
  const o = e.el;
  o.addEventListener("click", (n) => {
    const r = n.target;
    if (r.closest(".comfort-toggle-all")) {
      Vt(e), g(e);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      it(e, t, n, (l) => {
        e.rows.push($t(l)), g(e);
      });
      return;
    }
    const s = r.closest(".comfort-lora-row");
    if (!s) return;
    const i = Number(s.dataset.idx), c = e.rows[i];
    if (!c) return;
    const u = !!r.closest(".comfort-strength-clip");
    if (r.closest(".comfort-toggle")) {
      c.on = !c.on, g(e);
      return;
    }
    if (r.closest(".comfort-name")) {
      it(e, t, n, (l) => {
        c.lora = l, g(e);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      st(c, -1, u), g(e);
      return;
    }
    if (r.closest(".comfort-inc")) {
      st(c, 1, u), g(e);
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
    r && (n.preventDefault(), n.stopPropagation(), Zt(t, e, Number(r.dataset.idx), n));
  });
}
function Qt(t) {
  var o, n;
  if (T.has(t)) return;
  const e = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  e.el.className = "comfort-lora-list", T.set(t, e), t.serialize_widgets = !0, typeof t.addDOMWidget == "function" && t.addDOMWidget("loras", "comfort_lora_list", e.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => e.rows,
    setValue: (r) => {
      e.rows = Array.isArray(r) ? r : [], g(e);
    }
  }), Jt(t, e), g(e), t.__comfortLoaded || (n = t.setSize) == null || n.call(t, [Math.max(((o = t.size) == null ? void 0 : o[0]) || 0, Ht), 150]);
}
function Xt(t, e) {
  let o = Object.getPrototypeOf(t);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, e);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class Ot extends LGraphNode {
  constructor(e) {
    super(e), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  installModeInterceptor() {
    const e = Xt(this, "mode"), o = () => e != null && e.get ? e.get.call(this) : this.__comfort_mode;
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
const y = 0, w = 2, _ = 4;
function x(t, e) {
  var n;
  if (Array.isArray(t)) {
    for (const r of t) x(r, e);
    return;
  }
  if (!t) return;
  try {
    t.mode = e;
  } catch {
  }
  const o = (n = t.subgraph) == null ? void 0 : n.nodes;
  if (Array.isArray(o))
    for (const r of o) x(r, e);
}
function ct(t) {
  var o;
  const e = (t == null ? void 0 : t.type) || ((o = t == null ? void 0 : t.constructor) == null ? void 0 : o.type) || "";
  return e.includes("Reroute") || e.includes("Node Collector") || e.includes("Node Combiner");
}
function At(t, e, o) {
  var c, u, l, a;
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
      const m = e === "OUTPUT" ? h.target_id : h.origin_id, b = n.getNodeById(m);
      !b || s.has(b) || (ct(b) ? i(b) : r.push(b));
    }
  };
  if (o != null) {
    const f = e === "OUTPUT" ? ((u = (c = t.outputs) == null ? void 0 : c[o]) == null ? void 0 : u.links) || [] : [(a = (l = t.inputs) == null ? void 0 : l[o]) == null ? void 0 : a.link];
    for (const d of f) {
      if (d == null) continue;
      const p = n.links[d];
      if (!p) continue;
      const h = e === "OUTPUT" ? p.target_id : p.origin_id, m = n.getNodeById(h);
      !m || s.has(m) || (ct(m) ? i(m) : r.push(m));
    }
  } else
    i(t);
  return r;
}
function E(t, e) {
  return At(t, "INPUT", e);
}
function lt(t, e) {
  return At(t, "OUTPUT", e);
}
function U(t) {
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
function te(t) {
  var c, u, l, a, f, d, p, h;
  const e = t.graph;
  if (!e) return null;
  const o = e._groups || e.groups || [], n = ((c = t.pos) == null ? void 0 : c[0]) ?? 0, r = ((u = t.pos) == null ? void 0 : u[1]) ?? 0, s = ((l = t.size) == null ? void 0 : l[0]) ?? 0, i = ((a = t.size) == null ? void 0 : a[1]) ?? 0;
  for (const m of o) {
    const b = ((f = m.pos) == null ? void 0 : f[0]) ?? 0, R = ((d = m.pos) == null ? void 0 : d[1]) ?? 0, Bt = ((p = m.size) == null ? void 0 : p[0]) ?? 0, Wt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= b && r >= R && n + s <= b + Bt && r + i <= R + Wt)
      return m;
  }
  return null;
}
const Y = /* @__PURE__ */ new Set(), at = /* @__PURE__ */ new WeakSet();
let B = !1;
function q(t) {
  Y.add(t);
}
function K(t) {
  Y.delete(t);
}
function Z(t) {
  if (!t || at.has(t)) return;
  at.add(t);
  let e = t.title;
  try {
    Object.defineProperty(t, "title", {
      configurable: !0,
      enumerable: !0,
      get: () => e,
      set: (o) => {
        o !== e && (e = o, ee());
      }
    });
  } catch {
  }
}
function ee() {
  if (B) return;
  B = !0;
  const t = () => {
    var e;
    B = !1;
    for (const o of [...Y])
      try {
        (e = o.refreshTitleRows) == null || e.call(o);
      } catch {
      }
  };
  typeof requestAnimationFrame == "function" ? requestAnimationFrame(t) : setTimeout(t, 16);
}
class M extends Ot {
  constructor(e) {
    super(e), this.addInput("", "*"), q(this);
  }
  onConnectedNodesChanged(e) {
  }
  onConnectionsChange(e, o, n, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, e, o, n, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(E(this));
  }
  /**
   * Rename connected inputs to their source node's current title. Also the
   * title-watch refresh hook: fires when a connected node is renamed, without
   * re-running connection logic (no mode re-application).
   */
  refreshTitleRows() {
    if (!this.inputs) return;
    let e = !1;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link == null) continue;
      const r = E(this, o)[0];
      if (!r) continue;
      Z(r);
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
    K(this), super.onRemoved();
  }
}
function It(t, e, o) {
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
const oe = 260;
class St extends M {
  constructor(e) {
    super(e), this.listEl = null, this.rows = [], this.setSize([oe, 150]), this.setupListWidget(), q(this);
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
    e && It(e, this.rows, "Connect nodes to control them");
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
    const e = E(this), o = [];
    for (const n of e) {
      Z(n);
      const r = n.title || n.type || "node", s = this.rows.find((c) => c.node === n), i = s ? s.on : n.mode === this.modeOn;
      o.push({ node: n, title: r, on: i });
    }
    this.rows = o, this.renderList();
  }
  /** Title-watch hook: rows show connected node titles; refresh on rename. */
  refreshTitleRows() {
    this.syncRows();
  }
  onRemoved() {
    K(this), super.onRemoved();
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
const J = "Fast Muter (comfort)", Q = "Fast Bypasser (comfort)";
class ne extends St {
  constructor() {
    super(J), this.modeOn = y, this.modeOff = w;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class re extends St {
  constructor() {
    super(Q), this.modeOn = y, this.modeOff = _;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const se = ne, ie = re, Lt = "Node Collector (comfort)";
class ce extends M {
  constructor() {
    super(Lt), this.addOutput("Output", "*");
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const le = ce, X = "Mute / Bypass Repeater (comfort)";
class ae extends M {
  constructor() {
    super(X), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(e) {
    if (this.configuring) return;
    const o = e;
    for (const n of o)
      n.mode !== this.mode && x(n, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(e, o) {
    if (this.configuring) return;
    const n = E(this);
    if (n.length) {
      for (const s of n) x(s, o);
      return;
    }
    const r = te(this);
    if (r)
      for (const s of U(r))
        s !== this && x(s, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ue = ae;
function W(t) {
  return (t == null ? void 0 : t.type) === X;
}
const fe = 500;
class pe {
  constructor() {
    this.timer = null, this.counter = 0, this.jobs = /* @__PURE__ */ new Map();
  }
  schedule(e, o) {
    this.jobs.set(e, Math.max(1, o)), this.ensureTimer();
  }
  unschedule(e) {
    this.jobs.delete(e), this.jobs.size || this.stopTimer();
  }
  ensureTimer() {
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), fe));
  }
  stopTimer() {
    this.timer != null && (window.clearInterval(this.timer), this.timer = null);
  }
  tick() {
    this.counter = (this.counter + 1) % 1e6;
    for (const [e, o] of this.jobs)
      if (this.counter % o === 0)
        try {
          e();
        } catch {
        }
  }
}
const P = new pe(), Tt = "Mode Relay (comfort)", de = {
  ACTIVE: y,
  MUTE: w,
  BYPASS: _,
  NOTHING: -99
}, he = {
  [w]: "on_muted_inputs",
  [_]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class me extends M {
  constructor() {
    super(Tt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), ft.register(this);
  }
  onConnectedNodesChanged(e) {
    this.evaluate();
  }
  onModeChange(e, o) {
    if (super.onModeChange(e, o), this.configuring || E(this).length) return;
    const r = lt(this).filter(W);
    for (const s of r)
      s.mode !== o && x(s, o);
  }
  onConnectOutput(e, o, n, r, s) {
    return r ? W(r) : !0;
  }
  evaluate() {
    var c;
    if (this.configuring) return;
    const e = E(this);
    let o;
    for (const u of e) {
      const l = u.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === w || l === _)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = he[o], r = n ? de[String((c = this.properties) == null ? void 0 : c[n])] : o, s = r !== void 0 ? r : o;
    if (s === -99) return;
    const i = lt(this).filter(W);
    for (const u of i)
      u.mode !== s && x(u, s);
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
    ft.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const A = /* @__PURE__ */ new Set(), ut = () => {
  for (const t of A)
    try {
      t.evaluate();
    } catch {
    }
}, ft = {
  register(t) {
    A.add(t), P.schedule(ut, 1);
  },
  unregister(t) {
    A.delete(t), A.size || P.unschedule(ut);
  }
}, ge = me, Pt = "Random Unmuter (comfort)";
class ye extends M {
  constructor() {
    super(Pt), this.tempEnabled = null, pt.register(this);
  }
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const e = E(this);
    if (!e.length || !e.every((r) => r.mode === w)) return;
    const n = e[Math.floor(Math.random() * e.length)];
    n && (x(n, y), this.tempEnabled = n);
  }
  onPromptEnd() {
    this.tempEnabled && (x(this.tempEnabled, w), this.tempEnabled = null);
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
    pt.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const z = /* @__PURE__ */ new Set(), pt = {
  register(t) {
    z.add(t), be();
  },
  unregister(t) {
    z.delete(t);
  }
};
let dt = !1;
function be() {
  if (dt) return;
  dt = !0;
  const t = v, e = t.queuePrompt;
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
      for (const c of z)
        try {
          c.onPromptStart();
        } catch {
        }
    const s = n.apply(t, r), i = () => {
      for (const c of z)
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
const we = ye, tt = "Fast Groups Muter (comfort)", et = "Fast Groups Bypasser (comfort)", xe = 280;
function ve(t) {
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
    const c = ((f = s.pos) == null ? void 0 : f[1]) ?? 0, u = ((d = i.pos) == null ? void 0 : d[1]) ?? 0;
    if (c !== u) return c - u;
    const l = ((p = s.pos) == null ? void 0 : p[0]) ?? 0, a = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== a ? l - a : String(s.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function _e(t) {
  return U(t).some((e) => e.mode === y);
}
class zt extends Ot {
  constructor(e) {
    super(e), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.setSize([xe, 150]), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), mt.register(this), q(this);
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
    const n = U(e.group);
    x(n, o ? this.modeOn : this.modeOff);
  }
  refresh() {
    var s;
    const e = ve(this), o = String(((s = this.properties) == null ? void 0 : s.matchTitle) || "").trim();
    let n = e.map((i) => (Z(i), {
      group: i,
      title: String(i.title || "group"),
      on: _e(i)
    }));
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
    e && It(e, this.rows, "No groups in this workflow");
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
  /** Title-watch hook: rows show group titles; refresh on rename. */
  refreshTitleRows() {
    this.refresh();
  }
  onRemoved() {
    var e;
    mt.unregister(this), K(this), (e = super.onRemoved) == null || e.call(this);
  }
}
class Ce extends zt {
  constructor() {
    super(tt), this.modeOff = w;
  }
}
class Ee extends zt {
  constructor() {
    super(et), this.modeOff = _;
  }
}
const I = /* @__PURE__ */ new Set(), ht = () => {
  for (const t of I)
    try {
      t.refresh();
    } catch {
    }
}, mt = {
  register(t) {
    I.add(t), P.schedule(ht, 2);
  },
  unregister(t) {
    I.delete(t), I.size || P.unschedule(ht);
  }
}, Ne = Ce, ke = Ee, gt = /* @__PURE__ */ new Set();
function C(t, e) {
  gt.has(t) || (gt.add(t), e.category = "comfort", LiteGraph.registerNodeType(t, e));
}
function Me() {
  C(J, se), C(Q, ie), C(Lt, le), C(X, ue), C(Tt, ge), C(Pt, we), C(tt, Ne), C(et, ke);
}
function Re(t) {
  return (t == null ? void 0 : t.type) === J || (t == null ? void 0 : t.type) === Q;
}
function Oe(t) {
  return (t == null ? void 0 : t.type) === tt || (t == null ? void 0 : t.type) === et;
}
const Ae = 10, Ie = /[/\\]/, yt = "__comfort_original";
function Se(t, e) {
  const o = e == null ? void 0 : e.callback, n = /* @__PURE__ */ new Map(), r = [];
  for (const l of t) {
    if (l == null) {
      r.push(l);
      continue;
    }
    const a = String(l), f = a.indexOf("/") > -1 ? "/" : "\\", d = a.indexOf(f);
    if (d > -1) {
      const p = a.slice(0, d), h = a.slice(d + 1);
      n.has(p) || n.set(p, []), n.get(p).push({ full: a, sub: h });
    } else
      r.push(l);
  }
  const s = (l, a) => ({
    content: a,
    [yt]: l,
    callback: (f) => o == null ? void 0 : o(f[yt])
  }), i = [], c = [...n.keys()].sort((l, a) => l.localeCompare(a));
  for (const l of c) {
    const a = n.get(l).map((f) => s(f.full, f.sub));
    i.push({
      content: `📁 ${l}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: a }
    });
  }
  for (const l of r)
    typeof l == "string" ? i.push(s(l, l)) : i.push(l);
  const u = Object.assign({}, e);
  return u.callback = void 0, { values: i, options: u };
}
function bt(t, e) {
  return !Array.isArray(t) || t.length < Ae ? { values: t, options: e } : (e == null ? void 0 : e.className) !== "dark" ? { values: t, options: e } : t.every((o) => o == null || typeof o == "string") ? t.some((o) => typeof o == "string" && Ie.test(o)) ? Se(t, e) : { values: t, options: e } : { values: t, options: e };
}
function Le() {
  const t = LiteGraph.ContextMenu;
  if (!t || t.__comfortAutoNest) return;
  const e = new Proxy(t, {
    construct(o, n, r) {
      const [s, i] = n, c = bt(s, i);
      return Reflect.construct(o, [c.values, c.options], r);
    },
    apply(o, n, r) {
      const [s, i] = r, c = bt(s, i);
      return o.call(n, c.values, c.options);
    }
  });
  e.__comfortAutoNest = !0, LiteGraph.ContextMenu = e;
}
const k = 20, wt = 6, Te = 6;
let F = /* @__PURE__ */ new Map();
function xt(t, e) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + e, o.textContent = t, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Pe(t) {
  let e = F.get(t);
  if (e) return e;
  const o = xt("M", "comfort-btn-mute"), n = xt("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (r) => {
    r.stopPropagation(), r.preventDefault(), _t(t, "mute");
  }), n.addEventListener("pointerdown", (r) => {
    r.stopPropagation(), r.preventDefault(), _t(t, "bypass");
  }), e = { group: t, mute: o, byp: n }, F.set(t, e), document.body.appendChild(o), document.body.appendChild(n), e;
}
function vt(t, e, o, n) {
  t.style.left = `${e}px`, t.style.top = `${o}px`, t.style.width = `${k * n}px`, t.style.height = `${k * n}px`, t.style.fontSize = `${Math.max(9, k * n * 0.5)}px`;
}
function ze(t, e) {
  return !e || e.length < 2 ? !1 : e[0] >= t.pos[0] && e[0] <= t.pos[0] + t.size[0] && e[1] >= t.pos[1] && e[1] <= t.pos[1] + t.size[1];
}
function Fe() {
  const t = v.canvas, e = t == null ? void 0 : t.graph;
  if (!e) return;
  const n = t.canvas.getBoundingClientRect(), r = t.ds.scale, s = t.ds.offset, i = (a) => n.left + (a + s[0]) * r, c = (a) => n.top + (a + s[1]) * r, u = e._groups || [], l = /* @__PURE__ */ new Set();
  for (const a of u)
    (t.selected_group === a || ze(a, t.mouse)) && l.add(a);
  for (const a of l) {
    const f = Pe(a), d = a.pos[0] + a.size[0] - wt - k, p = a.pos[1] + wt;
    vt(f.mute, i(d - Te - k), c(p), r), vt(f.byp, i(d), c(p), r), f.mute.style.display = "block", f.byp.style.display = "block";
  }
  for (const [a, f] of F)
    l.has(a) || (f.mute.style.display = "none", f.byp.style.display = "none"), u.includes(a) || (f.mute.remove(), f.byp.remove(), F.delete(a));
}
function _t(t, e) {
  var u;
  const o = U(t);
  if (!o.length) return;
  const n = o.every((l) => l.mode === w), r = o.every((l) => l.mode === _), s = v.graph, i = s == null ? void 0 : s.version;
  try {
    if (e === "mute") {
      const l = n ? y : w;
      o.forEach((a) => a.mode = l);
    } else {
      const l = r ? y : _;
      o.forEach((a) => a.mode = l);
    }
  } catch (l) {
    console.warn("[comfort] group toggle failed", l);
    return;
  }
  s && s.version === i && s.setVersion(s.version + 1);
  const c = v.canvas;
  (u = c == null ? void 0 : c.setDirty) == null || u.call(c, !0, !0);
}
function Ue() {
  const t = v.canvas;
  if (!t || t.__comfortGroupTogglesInstalled) return;
  t.__comfortGroupTogglesInstalled = !0;
  const e = t.onDrawForeground;
  t.onDrawForeground = function(o, ...n) {
    e == null || e.call(this, o, ...n);
    try {
      Fe();
    } catch (r) {
      console.warn("[comfort] group toggles update failed", r);
    }
  };
}
const S = "Any Router (comfort)", Ft = 5, H = 8;
function N(t) {
  return (t.inputs || []).filter((e) => e && e.name && e.name.startsWith("any_"));
}
function Ut(t) {
  var e;
  return (t == null ? void 0 : t.type) === S || (t == null ? void 0 : t.comfyClass) === S || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === S;
}
function ot(t) {
  const e = N(t).length + 1;
  return "any_" + String(e).padStart(2, "0");
}
function De(t) {
  const e = (t.widgets || []).find((o) => o.name === "selection");
  return e && e.value === "active_source" ? "active_source" : "non_empty";
}
function Ge(t, e, o) {
  var c, u;
  const n = t.graph || v.graph;
  if (!n) return null;
  let r = t, s = o, i = e;
  for (let l = 0; l < 12; l++) {
    const a = i === "input" ? (c = r.inputs) == null ? void 0 : c[s] : (u = r.outputs) == null ? void 0 : u[s];
    if (!a) return null;
    if (a.type != null && a.type !== "*") return String(a.type);
    const f = i === "input" ? a.link : a.links && a.links[0];
    if (f == null) return null;
    const d = n.links && (n.links.get ? n.links.get(f) : n.links[f]) || null;
    if (!d || (i === "input" ? (r = n.getNodeById(d.origin_id), s = d.origin_slot, i = "output") : (r = n.getNodeById(d.target_id), s = d.target_slot, i = "input"), !r)) return null;
  }
  return null;
}
function Be(t) {
  const e = t.inputs || [];
  for (let o = 0; o < e.length; o++) {
    if (e[o].link == null) continue;
    const n = Ge(t, "input", o);
    if (n && n !== "*") return n;
  }
  return "*";
}
function Dt(t) {
  if (t.removed || !t.inputs) return;
  const e = N(t).filter((s) => s.link != null).length, o = Math.max(Ft, e + 1);
  let n = N(t).length;
  for (; n < o; )
    t.addInput(ot(t), "*"), n++;
  for (; n > o; ) {
    const s = t.inputs[t.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      t.removeInput(t.inputs.length - 1), n--;
    else
      break;
  }
  const r = Be(t);
  for (const s of N(t)) s.type = r;
  for (const s of t.outputs || [])
    s.type = r, s.label = String(r);
}
const j = /* @__PURE__ */ new WeakMap();
function We(t) {
  const e = j.get(t);
  e != null && window.clearTimeout(e), j.set(
    t,
    window.setTimeout(() => {
      j.delete(t), t.removed || Dt(t);
    }, 64)
  );
}
function He(t) {
  if (!t || t.__comfortAnyRouter) return;
  t.__comfortAnyRouter = !0, t.prototype.stabilizeComfortAnyRouter = function() {
    Dt(this);
  }, t.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const e = t.prototype.configure;
  t.prototype.configure = function(n) {
    try {
      const s = (n && n.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; N(this).length < s; )
        this.addInput(ot(this), "*");
    } catch {
    }
    const r = e ? e.call(this, n) : void 0;
    try {
      this.removed || (this.__comfortLoaded = !0, this.stabilizeComfortAnyRouter(), Gt(this));
    } catch {
    }
    return r;
  };
  const o = t.prototype.onConnectionsChange;
  t.prototype.onConnectionsChange = function(...n) {
    const r = o ? o.apply(this, n) : void 0;
    try {
      We(this);
    } catch {
    }
    return r;
  };
}
function Gt(t) {
  if (t.__comfortSpacer || typeof t.addDOMWidget != "function") return;
  const e = document.createElement("div");
  e.className = "comfort-spacer", e.style.height = H + "px";
  const o = t.addDOMWidget("comfort_spacer", "comfort_spacer", e, {
    serialize: !1,
    hideOnZoom: !0,
    getValue: () => null,
    setValue: () => {
    },
    getMinHeight: () => H,
    getMaxHeight: () => H
  }), n = t.widgets || [], r = n.indexOf(o);
  r > 0 && (n.splice(r, 1), n.unshift(o)), t.__comfortSpacer = !0;
}
function je(t) {
  try {
    if (typeof t.computeSize != "function" || !t.size) return;
    const e = t.computeSize();
    e && t.size[1] < e[1] && (t.setSize([t.size[0], e[1]]), typeof t.setDirtyCanvas == "function" && t.setDirtyCanvas(!0, !0));
  } catch {
  }
}
function $e(t) {
  let e = 0;
  for (; N(t).length < Ft && e++ < 24; )
    t.addInput(ot(t), "*");
  Gt(t), t.__comfortLoaded || je(t), Ye();
}
function Ve(t) {
  return !!t && t.mode !== w && t.mode !== _;
}
function Ct(t) {
  if (!t || typeof t != "object") return;
  const e = t.output, o = v.graph;
  if (!(!e || !o || !o.nodes))
    for (const n of o.nodes) {
      if (!Ut(n) || n.mode === w || n.mode === _ || De(n) !== "active_source") continue;
      const r = e[n.id];
      if (!r || !r.inputs) continue;
      const s = n.inputs || [];
      let i = null;
      for (let c = 0; c < s.length; c++) {
        const u = n.getInputNode ? n.getInputNode(c) : null;
        if (Ve(u)) {
          i = s[c].name;
          break;
        }
      }
      for (const c of Object.keys(r.inputs))
        c.startsWith("any_") && c !== i && delete r.inputs[c];
    }
}
let Et = !1;
function Ye() {
  if (Et) return;
  Et = !0;
  const t = v, e = t.graphToPrompt;
  typeof e == "function" && (t.graphToPrompt = function(...o) {
    const n = e.apply(t, o);
    return n && typeof n.then == "function" ? n.then(
      (r) => (Ct(r), r),
      (r) => {
        throw r;
      }
    ) : (Ct(n), n);
  });
}
const L = "Image Comparer (comfort)", qe = 512, Nt = 488;
function Ke(t) {
  var e;
  return (t == null ? void 0 : t.type) === L || (t == null ? void 0 : t.comfyClass) === L || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === L;
}
const $ = /* @__PURE__ */ new WeakMap();
function kt(t) {
  var r, s;
  const e = new URLSearchParams({
    filename: t.filename,
    type: t.type,
    subfolder: t.subfolder
  }), o = v;
  let n;
  try {
    n = ((s = (r = o == null ? void 0 : o.api) == null ? void 0 : r.apiURL) == null ? void 0 : s.call(r, `/view?${e.toString()}`)) ?? `/view?${e.toString()}`;
  } catch {
    n = `/view?${e.toString()}`;
  }
  return typeof (o == null ? void 0 : o.getPreviewFormatParam) == "function" && (n += o.getPreviewFormatParam()), typeof (o == null ? void 0 : o.getRandParam) == "function" && (n += o.getRandParam()), n;
}
function V(t, e) {
  t.handle.style.left = `${e}%`, t.leftImg.style.clipPath = `inset(0 ${100 - e}% 0 0)`;
}
function Ze(t) {
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
function Je(t, e, o) {
  t.leftUrls = e, t.rightUrls = o, t.leftIdx >= t.leftUrls.length && (t.leftIdx = 0), t.rightIdx >= t.rightUrls.length && (t.rightIdx = 0);
  const n = t.leftUrls.length > 0, r = t.rightUrls.length > 0;
  t.leftImg.src = n ? t.leftUrls[t.leftIdx] : "", t.rightImg.src = r ? t.rightUrls[t.rightIdx] : "", t.leftImg.style.display = n ? "" : "none", t.rightImg.style.display = r ? "" : "none", t.handle.style.display = "none", t.leftImg.style.clipPath = "none", t.empty.style.display = n || r ? "none" : "", V(t, 100), Ze(t);
}
function Qe(t, e) {
  const o = $.get(t);
  if (!o) return;
  const n = e || {}, r = Array.isArray(n.left_images) ? n.left_images.map(kt) : [], s = Array.isArray(n.right_images) ? n.right_images.map(kt) : [];
  Je(o, r, s);
}
function Xe(t) {
  var f, d;
  if ($.has(t)) return;
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
  const u = {
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
  $.set(t, u), n.addEventListener("mouseenter", () => {
    u.leftUrls.length && u.rightUrls.length && (u.handle.style.display = "");
  }), n.addEventListener("mouseleave", () => {
    u.handle.style.display = "none", V(u, 100);
  }), n.addEventListener("mousemove", (p) => {
    const h = n.getBoundingClientRect();
    if (h.width <= 0) return;
    const m = Math.max(0, Math.min(100, (p.clientX - h.left) / h.width * 100));
    V(u, m);
  }), t.__comfortLoaded || (f = t.setSize) == null || f.call(t, [qe, Nt]), typeof t.addDOMWidget == "function" && t.addDOMWidget("compare", "comfort_image_compare", e, {
    serialize: !1,
    hideOnZoom: !0
  });
  const l = () => {
    var b;
    if (!t.graph) {
      u.rafId = null;
      return;
    }
    const p = t.size ? t.size[1] : Nt, h = (b = t.widgets) == null ? void 0 : b.find((R) => R.name === "compare"), m = h && typeof h.y == "number" ? h.y : 20;
    e.style.height = Math.max(60, p - m - 20) + "px", u.rafId = requestAnimationFrame(l);
  };
  u.rafId = requestAnimationFrame(l);
  const a = (d = t.onRemoved) == null ? void 0 : d.bind(t);
  t.onRemoved = (...p) => {
    u.rafId !== null && cancelAnimationFrame(u.rafId), a == null || a(...p);
  };
}
function to(t) {
  if (!t || t.__comfortImageComparer) return;
  const e = t.prototype.onExecuted;
  t.prototype.onExecuted = function(n) {
    e == null || e.call(this, n), Qe(this, n);
  };
  const o = t.prototype.configure;
  t.prototype.configure = function(n) {
    o == null || o.call(this, n), this.__comfortLoaded = !0;
  }, t.__comfortImageComparer = !0;
}
const eo = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;flex-shrink:0;min-width:118px;justify-content:center}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{min-width:44px;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer;flex-shrink:0;white-space:nowrap}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 0;min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px;flex-shrink:0}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0;flex-shrink:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{width:100%;box-sizing:border-box;padding:4px 6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer;white-space:nowrap;margin:0}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;height:100%;overflow-y:auto;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-image-comparer{display:flex;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0}.ci-nav{min-height:28px;flex-shrink:0;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb;min-width:0}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;min-width:0;flex:1;min-height:100px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}", nt = document.createElement("style");
nt.setAttribute("data-comfort-plugin", "true");
nt.textContent = eo;
document.head.appendChild(nt);
Me();
Le();
v.registerExtension({
  name: "comfort.PowerLoraLoader",
  async init() {
    Ue();
  },
  beforeRegisterNodeDef(t, e) {
    if (e && e.name === S && He(t), e && e.name === L && to(t), e && e.name === O) {
      const o = t.prototype.configure;
      t.prototype.configure = function(n) {
        return this.__comfortLoaded = !0, o.call(this, n);
      };
    }
  },
  nodeCreated(t) {
    if (rt(t)) {
      Qt(t);
      return;
    }
    if (Ut(t)) {
      $e(t);
      return;
    }
    Ke(t) && Xe(t);
  },
  getNodeMenuItems(t) {
    if (rt(t)) {
      const e = jt(t);
      if (e) {
        const o = (n) => {
          e.showSeparate = n, qt(t);
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
    if (Re(t)) {
      const e = (o) => {
        var n;
        return (n = t.setAllRows) == null ? void 0 : n.call(t, o);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    if (Oe(t)) {
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
  O as NODE_NAME
};
