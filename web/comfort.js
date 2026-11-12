import { app as v } from "/scripts/app.js";
const D = "Power Lora Loader (comfort)", I = /* @__PURE__ */ new WeakMap(), Bt = 32, Ut = 36, Gt = 34, Z = 14, Ht = 380;
function Q(e) {
  var t;
  return (e == null ? void 0 : e.type) === D || (e == null ? void 0 : e.comfyClass) === D || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === D;
}
function $t(e) {
  return I.get(e);
}
function $(e) {
  return Z + Bt + e.rows.length * Ut + Gt + Z;
}
function M(e, t) {
  var s;
  if (!e.size) return;
  const o = $(t), n = Math.max(e.size[0] || 0, Ht);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function Wt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function Nt(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function jt(e) {
  const t = !Nt(e);
  for (const o of e.rows) o.on = t;
}
function X(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function St(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function B(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function U(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(r), o.appendChild(s), o;
}
function Yt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(St(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", n.appendChild(r), e.showSeparate ? (n.appendChild(U(t, "one")), n.appendChild(U(t, "two"))) : n.appendChild(U(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = Nt(e), s = St(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(B("Model")), r.appendChild(B("Clip"))) : r.appendChild(B("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((l, a) => t.appendChild(Yt(e, l, a)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Vt(e) {
  const t = I.get(e);
  t && (g(t), M(e, t));
}
async function qt() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function tt(e, t, o, n) {
  const s = await qt() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Kt(e, t, o, n) {
  const s = t.rows[o];
  if (!s) return;
  const r = o > 0, i = o < t.rows.length - 1, c = (l) => {
    const a = o + l;
    if (a < 0 || a >= t.rows.length) return;
    const u = t.rows[o];
    t.rows[o] = t.rows[a], t.rows[a] = u, g(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${s.on ? "⚫" : "◯"} Toggle ${s.on ? "Off" : "On"}`,
        callback: () => {
          s.on = !s.on, g(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !r, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(o, 1), g(t), M(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function Jt(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      jt(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      tt(t, e, n, (a) => {
        t.rows.push(Wt(a)), g(t), M(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const l = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, g(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      tt(t, e, n, (a) => {
        c.lora = a, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      X(c, -1, l), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      X(c, 1, l), g(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), g(t), M(e, t);
      return;
    }
  }), o.addEventListener("change", (n) => {
    const s = n.target, r = s.closest(".comfort-lora-row");
    if (!r || !s.matches("input[type='number']")) return;
    const i = t.rows[Number(r.dataset.idx)];
    if (!i) return;
    const c = parseFloat(s.value);
    Number.isFinite(c) && (s.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), o.addEventListener("contextmenu", (n) => {
    const s = n.target.closest(".comfort-lora-row");
    s && (n.preventDefault(), n.stopPropagation(), Kt(e, t, Number(s.dataset.idx), n));
  });
}
function Zt(e) {
  if (I.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  t.el.className = "comfort-lora-list", I.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], g(t), M(e, t);
    },
    getMinHeight: () => $(t),
    getMaxHeight: () => $(t)
  }), Jt(e, t), g(t), M(e, t);
}
function Qt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class W extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Qt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: o,
      set: (n) => {
        const s = o();
        t != null && t.set ? t.set.call(this, n) : this.__comfort_mode = n, s !== n && this.onModeChange(s, n);
      }
    });
  }
  configure(t) {
    this.configuring = !0, super.configure(t), this.configuring = !1;
  }
  /**
   * Fire when this node's own mode changes. Guard with `this.configuring`.
   * Subclasses override to react (e.g. the Repeater propagates to its inputs).
   */
  onModeChange(t, o) {
  }
  /** Help HTML shown in the node's help dialog / menu. */
  getHelp() {
    return "";
  }
  onRemoved() {
    var t;
    (t = super.onRemoved) == null || t.call(this), this.removed = !0;
  }
}
const b = 0, C = 2, S = 4;
function w(e, t) {
  var n;
  if (Array.isArray(e)) {
    for (const s of e) w(s, t);
    return;
  }
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const o = (n = e.subgraph) == null ? void 0 : n.nodes;
  if (Array.isArray(o))
    for (const s of o) w(s, t);
}
function et(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function kt(e, t, o) {
  var c, l, a, u;
  const n = e.graph;
  if (!n) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (d) => {
    if (!d || r.has(d)) return;
    r.add(d);
    let p;
    t === "OUTPUT" ? p = (d.outputs || []).flatMap((f) => f.links || []) : p = (d.inputs || []).map((f) => f.link);
    for (const f of p) {
      if (f == null) continue;
      const h = n.links[f];
      if (!h) continue;
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, y = n.getNodeById(m);
      !y || r.has(y) || (et(y) ? i(y) : s.push(y));
    }
  };
  if (o != null) {
    const d = t === "OUTPUT" ? ((l = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : l.links) || [] : [(u = (a = e.inputs) == null ? void 0 : a[o]) == null ? void 0 : u.link];
    for (const p of d) {
      if (p == null) continue;
      const f = n.links[p];
      if (!f) continue;
      const h = t === "OUTPUT" ? f.target_id : f.origin_id, m = n.getNodeById(h);
      !m || r.has(m) || (et(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function k(e, t) {
  return kt(e, "INPUT", t);
}
function ot(e, t) {
  return kt(e, "OUTPUT", t);
}
function F(e) {
  if (e != null && e.graph && typeof e.recomputeInsideNodes == "function")
    try {
      e.recomputeInsideNodes();
    } catch {
    }
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function Xt(e) {
  var c, l, a, u, d, p, f, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((l = e.pos) == null ? void 0 : l[1]) ?? 0, r = ((a = e.size) == null ? void 0 : a[0]) ?? 0, i = ((u = e.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of o) {
    const y = ((d = m.pos) == null ? void 0 : d[0]) ?? 0, _ = ((p = m.pos) == null ? void 0 : p[1]) ?? 0, Ft = ((f = m.size) == null ? void 0 : f[0]) ?? 0, Dt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= y && s >= _ && n + r <= y + Ft && s + i <= _ + Dt)
      return m;
  }
  return null;
}
class R extends W {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, n, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(k(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const s = k(this, o)[0], r = (s == null ? void 0 : s.title) || "";
        n.name !== r && (n.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const te = 34, ee = 10;
function _t(e, t, o) {
  if (e.innerHTML = "", !t.length) {
    const n = document.createElement("div");
    n.className = "comfort-node-empty", n.textContent = o, e.appendChild(n);
    return;
  }
  t.forEach((n, s) => {
    const r = document.createElement("div");
    r.className = "comfort-node-row" + (n.on ? "" : " off"), r.dataset.idx = String(s);
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-toggle " + (n.on ? "on" : "off"), i.textContent = n.on ? "ON" : "OFF", r.appendChild(i);
    const c = document.createElement("span");
    c.className = "comfort-node-title", c.textContent = n.title, c.title = n.title, r.appendChild(c), e.appendChild(r);
  });
}
function Mt(e, t, o) {
  var r;
  if (!e.size) return;
  const n = ee * 2 + t * te, s = Math.max(e.size[0] || 0, o);
  (e.size[1] !== n || e.size[0] !== s) && ((r = e.setSize) == null || r.call(e, [s, n]));
}
const oe = 260;
class Ot extends R {
  constructor(t) {
    super(t), this.listEl = null, this.rows = [], this.setupListWidget();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("nodes", "comfort_node_list", this.listEl, {
      serialize: !0,
      hideOnZoom: !0,
      getValue: () => this.rows.map((t) => ({ title: t.title, on: t.on })),
      setValue: () => {
      }
    }), this.bindListEvents(), this.renderList();
  }
  renderList() {
    const t = this.listEl;
    t && (_t(t, this.rows, "Connect nodes to control them"), Mt(this, this.rows.length, oe));
  }
  bindListEvents() {
    const t = this.listEl;
    t && t.addEventListener("click", (o) => {
      const s = o.target.closest(".comfort-node-row");
      if (!s) return;
      const r = Number(s.dataset.idx), i = this.rows[r];
      i && (i.on = !i.on, this.applyRowMode(i), this.renderList());
    });
  }
  /** Subclass hook: change the connected node's mode to match row.on. */
  applyRowMode(t) {
    if (t.node)
      try {
        t.node.mode = t.on ? this.modeOn : this.modeOff;
      } catch {
      }
  }
  /** Rebuild rows from live connections. Called on connect/disconnect/load. */
  syncRows() {
    const t = k(this), o = [];
    for (const n of t) {
      const s = n.title || n.type || "node", r = this.rows.find((c) => c.node === n), i = r ? r.on : n.mode === this.modeOn;
      o.push({ node: n, title: s, on: i });
    }
    this.rows = o, this.renderList();
  }
  /** Called by the fan-in base whenever the connected-node set changes. */
  onConnectedNodesChanged(t) {
    this.syncRows();
  }
  /** Bulk actions: set every row on, off, or toggle each one. */
  setAllRows(t) {
    for (const o of this.rows)
      o.on = t === null ? !o.on : t, this.applyRowMode(o);
    this.renderList();
  }
}
const j = "Fast Muter (comfort)", Y = "Fast Bypasser (comfort)";
class ne extends Ot {
  constructor() {
    super(j), this.modeOn = b, this.modeOff = C;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class se extends Ot {
  constructor() {
    super(Y), this.modeOn = b, this.modeOff = S;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const re = ne, ie = se, Tt = "Node Collector (comfort)";
class ce extends R {
  constructor() {
    super(Tt), this.addOutput("Output", "*");
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ae = ce, V = "Mute / Bypass Repeater (comfort)";
class le extends R {
  constructor() {
    super(V), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const o = t;
    for (const n of o)
      n.mode !== this.mode && w(n, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, o) {
    if (this.configuring) return;
    const n = k(this);
    if (n.length) {
      for (const r of n) w(r, o);
      return;
    }
    const s = Xt(this);
    if (s)
      for (const r of F(s))
        r !== this && w(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ue = le;
function G(e) {
  return (e == null ? void 0 : e.type) === V;
}
const de = 500;
class pe {
  constructor() {
    this.timer = null, this.counter = 0, this.jobs = /* @__PURE__ */ new Map();
  }
  /** Run `job` every `cadenceTicks` ticks (1 = every 500ms). */
  schedule(t, o) {
    this.jobs.set(t, Math.max(1, o)), this.ensureTimer();
  }
  unschedule(t) {
    this.jobs.delete(t), this.jobs.size || this.stopTimer();
  }
  ensureTimer() {
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), de));
  }
  stopTimer() {
    this.timer != null && (window.clearInterval(this.timer), this.timer = null);
  }
  tick() {
    this.counter = (this.counter + 1) % 1e6;
    for (const [t, o] of this.jobs)
      if (this.counter % o === 0)
        try {
          t();
        } catch {
        }
  }
}
const E = new pe(), Rt = "Mode Relay (comfort)", fe = {
  ACTIVE: b,
  MUTE: C,
  BYPASS: S,
  NOTHING: -99
}, he = {
  [C]: "on_muted_inputs",
  [S]: "on_bypassed_inputs",
  [b]: "on_any_active_inputs"
};
class me extends R {
  constructor() {
    super(Rt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), st.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, o) {
    if (super.onModeChange(t, o), this.configuring || k(this).length) return;
    const s = ot(this).filter(G);
    for (const r of s)
      r.mode !== o && w(r, o);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, n, s, r) {
    return s ? G(s) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = k(this);
    let o;
    for (const l of t) {
      const a = l.mode;
      if (o === void 0) o = a;
      else {
        if (o === a && (a === C || a === S)) continue;
        a === b || o === b ? o = b : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = he[o], s = n ? fe[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = ot(this).filter(G);
    for (const l of i)
      l.mode !== r && w(l, r);
  }
  getHelp() {
    return `<p>Watches the mode of the nodes connected to its inputs and drives
a connected <b>Repeater</b> with the result: all inputs muted → MUTE, all
bypassed → BYPASS, any active → ACTIVE. Set the <code>on_muted_inputs</code>,
<code>on_bypassed_inputs</code> and <code>on_any_active_inputs</code>
properties to remap or suppress (NOTHING) each signal.</p>`;
  }
  onRemoved() {
    var t;
    st.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const A = /* @__PURE__ */ new Set(), nt = () => {
  for (const e of A)
    try {
      e.evaluate();
    } catch {
    }
}, st = {
  register(e) {
    A.add(e), E.schedule(nt, 1);
  },
  unregister(e) {
    A.delete(e), A.size || E.unschedule(nt);
  }
}, ge = me, At = "Random Unmuter (comfort)";
class be extends R {
  constructor() {
    super(At), this.tempEnabled = null, rt.register(this);
  }
  /** No-op: this node only acts on queue, not on connection changes. */
  onConnectedNodesChanged(t) {
  }
  /**
   * Called when a prompt build begins (inside queuePrompt). If all connected
   * nodes are muted, pick one at random and unmute it for the build.
   */
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const t = k(this);
    if (!t.length || !t.every((s) => s.mode === C)) return;
    const n = t[Math.floor(Math.random() * t.length)];
    n && (w(n, b), this.tempEnabled = n);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (w(this.tempEnabled, C), this.tempEnabled = null);
  }
  getHelp() {
    return `<p>Each time a prompt is queued, this node temporarily unmutes one
randomly-chosen connected node (which must be muted) for the duration of the
prompt, then mutes it back. All connected nodes must be muted for it to act.
Tip: connect a Repeater's output to this node's input to randomly unmute a whole
group.</p>`;
  }
  onRemoved() {
    var t;
    rt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const P = /* @__PURE__ */ new Set(), rt = {
  register(e) {
    P.add(e), ye();
  },
  unregister(e) {
    P.delete(e);
  }
};
let it = !1;
function ye() {
  if (it) return;
  it = !0;
  const e = v, t = e.queuePrompt;
  let o = !1;
  e.queuePrompt = async function(...s) {
    o = !0;
    try {
      return await t.apply(e, s);
    } finally {
      o = !1;
    }
  };
  const n = e.graphToPrompt;
  e.graphToPrompt = function(...s) {
    if (o)
      for (const c of P)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of P)
        try {
          c.onPromptEnd();
        } catch {
        }
    };
    return r && typeof r.then == "function" ? r.then((c) => (i(), c), (c) => {
      throw i(), c;
    }) : (i(), r);
  };
}
const we = be, Lt = "NInfer Suspend Gate (comfort)", ct = 30, xe = 24, Ee = 32, ve = 30, Ce = 10, Ne = 300, Se = 6, ke = 1, _e = 2e3, Me = 1e3, at = ["indefinite", "1", "5", "10", "15", "30", "60"], Oe = (e) => new Promise((t) => setTimeout(t, e));
async function It(e, t, o) {
  const n = t === void 0 ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(e), {
    signal: o
  }) : await fetch("/comfort/ninfer/forward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: e, body: t }),
    signal: o
  }), s = await n.text();
  let r = s;
  try {
    r = JSON.parse(s);
  } catch {
  }
  return { status: n.status, body: r };
}
const lt = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
async function ut(e, t, o) {
  const n = e + "/v1/models";
  if (t) {
    const i = lt.get(n);
    if (i && Date.now() - i.at < Me) return i.models;
  }
  const s = H.get(n);
  if (s) return s;
  const r = (async () => {
    var a;
    const c = (a = (await It(n, void 0, o)).body) == null ? void 0 : a.data, l = Array.isArray(c) ? c.map((u) => {
      var d;
      return {
        id: String(u.id),
        value: String(((d = u.status) == null ? void 0 : d.value) ?? "")
      };
    }) : [];
    return lt.set(n, { at: Date.now(), models: l }), l;
  })().finally(() => H.delete(n));
  return H.set(n, r), r;
}
function Te(e, t, o) {
  return It(
    e + "/v1/models/" + encodeURIComponent(t) + "/suspend",
    {},
    o
  );
}
class Re extends W {
  constructor() {
    super(Lt), this.properties.url = "", this.properties.timeout = "indefinite", this.properties.selected = null, this.st = this.setupWidget(), ht.register(this);
  }
  /**
   * Workflow load. The load path runs `graph.add()` (→ `onAdded`) BEFORE
   * `configure()`, so `onAdded` syncs the inputs from the constructor
   * defaults. `configure()` then restores `this.properties` — re-sync the
   * inputs to the restored values here, or the URL/timeout/selection set in
   * the saved workflow would be lost.
   */
  configure(t) {
    super.configure(t), this.syncFieldsFromProperties();
  }
  /** Runs after the node is added to a graph (creation AND workflow load). */
  onAdded() {
    var t;
    (t = super.onAdded) == null || t.call(this), this.syncFieldsFromProperties(), this.refresh();
  }
  onRemoved() {
    var t;
    ht.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
  /**
   * Called every tick by the shared scheduler. Advances the elapsed-time
   * display while a suspend is in progress; a no-op otherwise (so idle nodes
   * don't churn the DOM).
   */
  updateLiveStatus() {
    (this.st.phase === "suspending" || this.st.phase === "busy") && this.renderStatus();
  }
  // --- configuration accessors -------------------------------------------
  baseUrl() {
    return String(this.properties.url || "").trim().replace(/\/+$/, "");
  }
  timeoutMs() {
    const t = String(this.properties.timeout || "indefinite");
    if (t === "indefinite") return 1 / 0;
    const o = parseInt(t, 10);
    return Number.isFinite(o) && o > 0 ? o * 60 * 1e3 : 1 / 0;
  }
  /**
   * Effective checked set. `null` (never explicitly set) means "all loaded";
   * an explicit array (possibly empty) is used as-is.
   */
  computeSelected(t) {
    const o = this.properties.selected;
    return o == null ? new Set(
      t.filter((n) => n.value === "loaded").map((n) => n.id)
    ) : new Set(Array.isArray(o) ? o.map(String) : []);
  }
  // --- UI ----------------------------------------------------------------
  setupWidget() {
    const t = document.createElement("div");
    t.className = "comfort-ninfer";
    const o = document.createElement("input");
    o.type = "text", o.className = "comfort-ninfer-url", o.placeholder = "NInfer URL  (http://host:30001)", t.appendChild(o);
    const n = document.createElement("select");
    n.className = "comfort-ninfer-timeout";
    for (const f of at) {
      const h = document.createElement("option");
      h.value = f, h.textContent = f === "indefinite" ? "Busy timeout: indefinite" : `Busy timeout: ${f} min`, n.appendChild(h);
    }
    t.appendChild(n);
    const s = document.createElement("div");
    s.className = "comfort-ninfer-status";
    const r = document.createElement("span");
    r.className = "comfort-ninfer-status-text", r.textContent = "Set NInfer URL to enable";
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-ninfer-ctrl", i.textContent = "Cancel", i.hidden = !0;
    const c = document.createElement("button");
    c.type = "button", c.className = "comfort-ninfer-ctrl", c.textContent = "Skip", c.hidden = !0, s.appendChild(r), s.appendChild(i), s.appendChild(c), t.appendChild(s);
    const l = document.createElement("div");
    l.className = "comfort-ninfer-bulk";
    const a = document.createElement("button");
    a.type = "button", a.className = "comfort-bulk", a.dataset.bulk = "all", a.textContent = "Select all";
    const u = document.createElement("button");
    u.type = "button", u.className = "comfort-bulk", u.dataset.bulk = "none", u.textContent = "Deselect all", l.appendChild(a), l.appendChild(u), t.appendChild(l);
    const d = document.createElement("div");
    d.className = "comfort-ninfer-rows", t.appendChild(d);
    const p = {
      el: t,
      urlInput: o,
      timeoutSel: n,
      statusEl: s,
      statusText: r,
      cancelBtn: i,
      skipBtn: c,
      bulkEl: l,
      rowsEl: d,
      models: [],
      selected: /* @__PURE__ */ new Set(),
      phase: "idle",
      phaseModel: "",
      phaseStart: 0,
      resultText: "",
      resultHold: 0,
      polling: !1,
      cancel: !1,
      skip: !1,
      abort: null
    };
    return i.addEventListener("click", () => {
      var f;
      p.cancel = !0, (f = p.abort) == null || f.abort();
    }), c.addEventListener("click", () => {
      var f;
      p.skip = !0, (f = p.abort) == null || f.abort();
    }), d.addEventListener("change", (f) => {
      const h = f.target;
      if (h.type !== "checkbox" || !h.dataset.id) return;
      const m = new Set(p.selected);
      h.checked ? m.add(h.dataset.id) : m.delete(h.dataset.id), p.selected = m, this.properties.selected = Array.from(m);
    }), l.addEventListener("click", (f) => {
      var m;
      const h = (m = f.target.dataset) == null ? void 0 : m.bulk;
      if (h === "all") {
        const y = p.models.filter((_) => _.value === "loaded").map((_) => _.id);
        p.selected = new Set(y), this.properties.selected = y;
      } else if (h === "none")
        p.selected = /* @__PURE__ */ new Set(), this.properties.selected = [];
      else
        return;
      this.renderRows();
    }), o.addEventListener("input", () => {
      this.properties.url = o.value.trim();
    }), o.addEventListener("change", () => {
      this.properties.url = o.value.trim(), this.properties.selected = null, p.phase = "idle", p.resultText = "", p.models = [], p.selected = /* @__PURE__ */ new Set(), this.refresh();
    }), n.addEventListener("change", () => {
      this.properties.timeout = n.value;
    }), typeof this.addDOMWidget == "function" && this.addDOMWidget("ninfer", "comfort_ninfer_list", t, {
      serialize: !1,
      hideOnZoom: !0
    }), p;
  }
  /** Push `this.properties` into the input controls (load path). */
  syncFieldsFromProperties() {
    const t = this.st;
    t.urlInput.value = String(this.properties.url || "");
    const o = String(this.properties.timeout || "indefinite");
    t.timeoutSel.value = at.includes(o) ? o : "indefinite", t.selected = this.computeSelected(t.models);
  }
  renderRows() {
    const t = this.st, o = t.rowsEl;
    if (o.innerHTML = "", !t.models.length) {
      const n = document.createElement("div");
      n.className = "comfort-node-empty", n.textContent = this.baseUrl() ? "Loading…" : "Set NInfer URL above", o.appendChild(n);
      return;
    }
    for (const n of t.models) {
      const s = n.value === "loaded", r = document.createElement("div");
      r.className = "comfort-ninfer-row" + (s ? "" : " off"), r.dataset.id = n.id;
      const i = document.createElement("input");
      i.type = "checkbox", i.checked = t.selected.has(n.id), i.dataset.id = n.id, r.appendChild(i);
      const c = document.createElement("span");
      c.className = "comfort-node-title", c.textContent = n.id, c.title = n.id, r.appendChild(c);
      const l = n.value || "unknown", a = document.createElement("span");
      a.className = "comfort-ninfer-badge " + (l === "loaded" ? "loaded" : l === "sleeping" ? "suspended" : "other"), a.textContent = l === "sleeping" ? "suspended" : l, r.appendChild(a), o.appendChild(r);
    }
  }
  idleSummary() {
    if (!this.baseUrl()) return "Set NInfer URL to enable";
    const t = this.st.models;
    if (!t.length) return "Loading models…";
    const o = t.filter((n) => n.value === "loaded").length;
    return o ? `${o} loaded · ${t.length - o} other` : "No loaded models";
  }
  renderStatus() {
    const t = this.st, o = Math.max(0, Math.round((Date.now() - t.phaseStart) / 1e3));
    let n;
    switch (t.phase) {
      case "suspending":
        n = `⏳ Suspending ${t.phaseModel}… ${o}s`;
        break;
      case "busy":
        n = `⏳ NInfer busy — waiting… ${o}s`;
        break;
      case "done":
        n = `✓ ${t.resultText}`;
        break;
      case "error":
        n = `✗ ${t.resultText}`;
        break;
      default:
        n = this.idleSummary();
    }
    t.statusText.textContent = n;
    const s = t.phase === "suspending" || t.phase === "busy";
    t.cancelBtn.hidden = !s, t.skipBtn.hidden = !s;
  }
  layout() {
    var r, i;
    const t = this.st.models.length, o = Ce * 2 + ct + ct + xe + Ee + t * ve, n = Math.max(((r = this.size) == null ? void 0 : r[0]) || 0, Ne), s = this.size;
    (!s || s[1] !== o || s[0] !== n) && ((i = this.setSize) == null || i.call(this, [n, o]));
  }
  // --- polling -----------------------------------------------------------
  /**
   * Refresh the model list + status. Driven by the ambient scheduler job and
   * on demand (load, URL change, post-suspend). `fresh` bypasses the shared
   * result cache (used right after a suspend, to see the new state at once).
   */
  async refresh(t = !1) {
    const o = this.st;
    if (o.polling || o.phase === "suspending" || o.phase === "busy") return;
    const n = this.baseUrl();
    if (!n) {
      o.models = [], o.selected = /* @__PURE__ */ new Set(), this.renderRows(), this.renderStatus(), this.layout();
      return;
    }
    o.polling = !0;
    try {
      const s = await ut(n, !t);
      o.models = s, this.properties.selected == null && (this.properties.selected = s.filter((r) => r.value === "loaded").map((r) => r.id)), o.selected = this.computeSelected(s), this.renderRows(), this.layout(), (o.phase === "done" || o.phase === "error") && o.resultHold > 0 ? o.resultHold-- : o.phase !== "idle" && (o.phase = "idle", o.resultText = ""), this.renderStatus();
    } catch {
      o.phase === "idle" && (o.phase = "error", o.resultText = "NInfer unreachable"), this.renderStatus();
    } finally {
      o.polling = !1;
    }
  }
  // --- queue hook --------------------------------------------------------
  /**
   * Called from the queuePrompt wrapper, before the prompt is sent. Suspends
   * each checked+loaded model, holding the queue until every suspend returns.
   * Returns a verdict: `proceed: true` sends the prompt, `false` aborts the
   * Run (unreachable / timed out / user Cancel). The user can also Skip — stop
   * suspending and send the prompt with whatever is still loaded.
   */
  async suspendChecked() {
    const t = this.st, o = this.baseUrl();
    if (!o) return { proceed: !0 };
    t.cancel = !1, t.skip = !1, t.abort = null;
    let n;
    try {
      n = await ut(o, !1);
    } catch {
      return this.finish("NInfer unreachable", !0), { proceed: !1 };
    }
    t.models = n;
    const s = this.computeSelected(n);
    t.selected = s, this.renderRows();
    const r = n.filter(
      (l) => l.value === "loaded" && s.has(l.id)
    );
    if (!r.length)
      return this.finish("Ready (nothing to suspend)", !1), { proceed: !0 };
    const i = Date.now(), c = this.timeoutMs();
    try {
      for (const a of r) {
        if (t.cancel || t.skip) break;
        const u = Date.now();
        for (this.beginSuspending(a.id, u); !(t.cancel || t.skip); ) {
          const d = new AbortController();
          t.abort = d;
          let p;
          try {
            p = await Te(o, a.id, d.signal);
          } catch {
            if (d.signal.aborted) break;
            throw new Error("suspend request failed");
          }
          if (p.status === 200) break;
          if (p.status === 409) {
            if (this.setBusy(a.id, u), await Oe(_e), t.cancel || t.skip) break;
            if (Date.now() - i > c)
              throw new Error("timed out waiting for NInfer to idle");
            continue;
          }
          throw new Error(`suspend failed (HTTP ${p.status})`);
        }
      }
      if (t.abort = null, t.cancel)
        return this.finish("Cancelled", !1), { proceed: !1 };
      if (t.skip)
        return this.finish("Skipped — running now", !1), { proceed: !0 };
      const l = Math.round((Date.now() - i) / 1e3);
      this.finish(
        `Suspended ${r.length} model${r.length === 1 ? "" : "s"} (${l}s)`,
        !1
      ), t.resultHold = 2;
      try {
        await this.refresh(!0);
      } catch {
      }
      return { proceed: !0 };
    } catch (l) {
      return this.finish(l instanceof Error ? l.message : String(l), !0), { proceed: !1 };
    } finally {
      t.abort = null;
    }
  }
  beginSuspending(t, o) {
    const n = this.st;
    n.phase = "suspending", n.phaseModel = t, n.phaseStart = o, this.renderStatus();
  }
  setBusy(t, o) {
    const n = this.st;
    n.phase = "busy", n.phaseModel = t, n.phaseStart = o, this.renderStatus();
  }
  finish(t, o) {
    const n = this.st;
    n.phase = o ? "error" : "done", n.resultText = t, this.renderStatus();
  }
  getHelp() {
    return `<p>Frees GPU memory for ComfyUI by suspending selected NInfer models
on queue. On each Run, every checked model that is <b>loaded</b> is suspended
(via its NInfer API); the queue is held until each suspend returns. If NInfer
is busy the gate waits (retrying) until it idles or the busy-timeout elapses.
Suspended models stay suspended.</p>
<p>Set the NInfer URL above. "Select all" checks every loaded model.</p>`;
  }
}
const N = /* @__PURE__ */ new Set();
let dt = !1;
const pt = () => {
  if (!document.hidden) {
    for (const e of Array.from(N))
      if (!e.removed)
        try {
          e.refresh();
        } catch {
        }
  }
}, ft = () => {
  for (const e of Array.from(N))
    if (!e.removed)
      try {
        e.updateLiveStatus();
      } catch {
      }
}, ht = {
  register(e) {
    N.add(e), Ae(), E.schedule(pt, Se), E.schedule(ft, ke);
  },
  unregister(e) {
    N.delete(e), N.size || (E.unschedule(pt), E.unschedule(ft));
  }
};
function Ae() {
  if (dt) return;
  dt = !0;
  const e = v, t = e.queuePrompt;
  e.queuePrompt = async function(...o) {
    let n = !0;
    for (const s of Array.from(N)) {
      if (s.removed) continue;
      if (!(await s.suspendChecked()).proceed) {
        n = !1;
        break;
      }
    }
    return n ? await t.apply(e, o) : Promise.resolve();
  };
}
let O = null;
function Le() {
  return document.querySelector('[data-testid="queue-button"]');
}
function Ie() {
  var t;
  const e = v;
  return ((t = e.canvas) == null ? void 0 : t.graph) ?? e.graph ?? null;
}
function Pt() {
  const e = Ie();
  if (!e) return null;
  for (const t of N)
    if (!t.removed && t.graph === e) return t;
  return null;
}
function Pe() {
  if (O && O.isConnected) return;
  const e = Le();
  if (!e || !e.parentElement) return;
  const t = document.createElement("button");
  t.type = "button", t.className = "comfort-topbar-focus", t.title = "Focus NInfer gate", t.textContent = "⚡ NInfer", t.addEventListener("click", () => {
    const o = Pt();
    if (!o) return;
    const n = o.graph;
    if (n) {
      for (const p of n._nodes || []) p.selected = !1;
      o.selected = !0;
    }
    const s = v.canvas;
    if (!s) return;
    const r = o.size || [200, 150], i = r[0] || 200, c = r[1] || 150, l = s.canvas, a = l && l.clientWidth || window.innerWidth, u = l && l.clientHeight || window.innerHeight, d = Math.min(a * 0.5 / i, u * 0.5 / c);
    s.ds.scale = Math.min(Math.max(d, 0.75), 2), s.centerOnNode(o), s.setDirty(!0);
  }), e.parentElement.insertBefore(t, e.nextSibling), O = t;
}
const ze = () => {
  Pe(), O && (O.style.display = Pt() ? "" : "none");
};
function Fe() {
  E.schedule(ze, 1);
}
const q = "Fast Groups Muter (comfort)", K = "Fast Groups Bypasser (comfort)", De = 280;
function Be(e) {
  const t = e.graph;
  if (!t) return [];
  const o = /* @__PURE__ */ new Set(), n = [], s = (r) => {
    var i;
    if (!(!r || o.has(r))) {
      o.add(r);
      for (const c of r._groups || r.groups || []) n.push(c);
      for (const c of r._subgraphs || []) s(c);
      for (const c of r._nodes || [])
        (i = c.subgraph) != null && i._groups && s(c.subgraph);
    }
  };
  return s(t), n.sort((r, i) => {
    var d, p, f, h;
    const c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0, l = ((p = i.pos) == null ? void 0 : p[1]) ?? 0;
    if (c !== l) return c - l;
    const a = ((f = r.pos) == null ? void 0 : f[0]) ?? 0, u = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return a !== u ? a - u : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function Ue(e) {
  return F(e).some((t) => t.mode === b);
}
class zt extends W {
  constructor(t) {
    super(t), this.modeOn = b, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), gt.register(this);
  }
  /**
   * The constructor's refresh runs before we're attached to a graph (so
   * `this.graph` is null and it finds no groups). Re-run now that we're in a
   * graph so the group rows appear immediately instead of waiting for the 1s
   * poll. Also covers the load path (nodes are re-added to the graph on load).
   */
  onAdded() {
    var t;
    (t = super.onAdded) == null || t.call(this), this.refresh();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("groups", "comfort_group_list", this.listEl, {
      serialize: !1,
      hideOnZoom: !0,
      getValue: () => this.rows.map((t) => ({ title: t.title, on: t.on })),
      setValue: () => {
      }
    }), this.listEl.addEventListener("click", (t) => {
      const n = t.target.closest(".comfort-node-row");
      if (!n) return;
      const s = this.rows[Number(n.dataset.idx)];
      s && (this.applyGroupMode(s, !s.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(t, o) {
    const n = F(t.group);
    w(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Be(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: Ue(i)
    }));
    if (o)
      try {
        const i = new RegExp(o, "i");
        n = n.filter((c) => i.test(c.title));
      } catch {
        n = n.filter((i) => i.title.toLowerCase().includes(o.toLowerCase()));
      }
    const s = n.map((i) => i.title + (i.on ? 1 : 0)).join("|");
    s !== this.lastKey && (this.lastKey = s, this.rows = n, this.renderList());
  }
  renderList() {
    const t = this.listEl;
    t && (_t(t, this.rows, "No groups in this workflow"), Mt(this, this.rows.length, De));
  }
  setAllGroups(t) {
    for (const o of this.rows) {
      const n = t === null ? !o.on : t;
      this.applyGroupMode(o, n);
    }
    this.refresh();
  }
  getHelp() {
    return `<p>List every group in the workflow and mute or bypass all the nodes
inside a group with one click. Set the <code>matchTitle</code> property (via
right-click → Properties) to filter which groups appear.</p>`;
  }
  onRemoved() {
    var t;
    gt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class Ge extends zt {
  constructor() {
    super(q), this.modeOff = C;
  }
}
class He extends zt {
  constructor() {
    super(K), this.modeOff = S;
  }
}
const L = /* @__PURE__ */ new Set(), mt = () => {
  for (const e of L)
    try {
      e.refresh();
    } catch {
    }
}, gt = {
  register(e) {
    L.add(e), E.schedule(mt, 2);
  },
  unregister(e) {
    L.delete(e), L.size || E.unschedule(mt);
  }
}, $e = Ge, We = He, bt = /* @__PURE__ */ new Set();
function x(e, t) {
  bt.has(e) || (bt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function je() {
  x(j, re), x(Y, ie), x(Tt, ae), x(V, ue), x(Rt, ge), x(At, we), x(q, $e), x(K, We), x(Lt, Re);
}
function Ye(e) {
  return (e == null ? void 0 : e.type) === j || (e == null ? void 0 : e.type) === Y;
}
function Ve(e) {
  return (e == null ? void 0 : e.type) === q || (e == null ? void 0 : e.type) === K;
}
const qe = 10, Ke = /[/\\]/, yt = "__comfort_original";
function Je(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const a of e) {
    if (a == null) {
      s.push(a);
      continue;
    }
    const u = String(a), d = u.indexOf("/") > -1 ? "/" : "\\", p = u.indexOf(d);
    if (p > -1) {
      const f = u.slice(0, p), h = u.slice(p + 1);
      n.has(f) || n.set(f, []), n.get(f).push({ full: u, sub: h });
    } else
      s.push(a);
  }
  const r = (a, u) => ({
    content: u,
    [yt]: a,
    callback: (d) => o == null ? void 0 : o(d[yt])
  }), i = [], c = [...n.keys()].sort((a, u) => a.localeCompare(u));
  for (const a of c) {
    const u = n.get(a).map((d) => r(d.full, d.sub));
    i.push({
      content: `📁 ${a}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: u }
    });
  }
  for (const a of s)
    typeof a == "string" ? i.push(r(a, a)) : i.push(a);
  const l = Object.assign({}, t);
  return l.callback = void 0, { values: i, options: l };
}
function wt(e, t) {
  return !Array.isArray(e) || e.length < qe ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && Ke.test(o)) ? Je(e, t) : { values: e, options: t } : { values: e, options: t };
}
function Ze() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = wt(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = wt(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const T = 20, xt = 6, Qe = 6;
let z = /* @__PURE__ */ new Map();
function Et(e, t) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + t, o.textContent = e, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Xe(e) {
  let t = z.get(e);
  if (t) return t;
  const o = Et("M", "comfort-btn-mute"), n = Et("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), Ct(e, "mute");
  }), n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), Ct(e, "bypass");
  }), t = { group: e, mute: o, byp: n }, z.set(e, t), document.body.appendChild(o), document.body.appendChild(n), t;
}
function vt(e, t, o, n) {
  e.style.left = `${t}px`, e.style.top = `${o}px`, e.style.width = `${T * n}px`, e.style.height = `${T * n}px`, e.style.fontSize = `${Math.max(9, T * n * 0.5)}px`;
}
function to(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function eo() {
  const e = v.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const n = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (u) => n.left + (u + r[0]) * s, c = (u) => n.top + (u + r[1]) * s, l = t._groups || [], a = /* @__PURE__ */ new Set();
  for (const u of l)
    (e.selected_group === u || to(u, e.mouse)) && a.add(u);
  for (const u of a) {
    const d = Xe(u), p = u.pos[0] + u.size[0] - xt - T, f = u.pos[1] + xt;
    vt(d.mute, i(p - Qe - T), c(f), s), vt(d.byp, i(p), c(f), s), d.mute.style.display = "block", d.byp.style.display = "block";
  }
  for (const [u, d] of z)
    a.has(u) || (d.mute.style.display = "none", d.byp.style.display = "none"), l.includes(u) || (d.mute.remove(), d.byp.remove(), z.delete(u));
}
function Ct(e, t) {
  var l;
  const o = F(e);
  if (!o.length) return;
  const n = o.every((a) => a.mode === C), s = o.every((a) => a.mode === S), r = v.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const a = n ? b : C;
      o.forEach((u) => u.mode = a);
    } else {
      const a = s ? b : S;
      o.forEach((u) => u.mode = a);
    }
  } catch (a) {
    console.warn("[comfort] group toggle failed", a);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = v.canvas;
  (l = c == null ? void 0 : c.setDirty) == null || l.call(c, !0, !0);
}
function oo() {
  const e = v.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(o, ...n) {
    t == null || t.call(this, o, ...n);
    try {
      eo();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const no = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-ninfer{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}.comfort-ninfer-url,.comfort-ninfer-timeout{width:100%;box-sizing:border-box;padding:4px 6px;font-size:12px;font-family:inherit;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-ninfer-status{display:flex;align-items:center;gap:6px;min-height:18px;padding:2px;font-size:11px;opacity:.9}.comfort-ninfer-status-text{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-ninfer-ctrl{flex:0 0 auto;padding:1px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-ninfer-ctrl:hover{background:#7f7f7f33}.comfort-ninfer-bulk{display:flex;gap:6px}.comfort-bulk{flex:1 1 auto;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-bulk:hover{background:#7f7f7f33}.comfort-ninfer-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-ninfer-row.off .comfort-node-title{opacity:.5}.comfort-ninfer-row input[type=checkbox]{margin:0;cursor:pointer}.comfort-ninfer-badge{padding:1px 6px;border-radius:8px;font-size:10px;background:#7f7f7f40}.comfort-ninfer-badge.loaded{background:#7d2e2e;color:#fff}.comfort-ninfer-badge.suspended{background:#2e5d7d;color:#fff}.comfort-ninfer-badge.other{opacity:.7}.comfort-topbar-focus{padding:3px 8px;margin-left:6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-topbar-focus:hover{background:#7f7f7f33}", J = document.createElement("style");
J.setAttribute("data-comfort-plugin", "true");
J.textContent = no;
document.head.appendChild(J);
je();
Ze();
v.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    oo(), Fe();
  },
  nodeCreated(e) {
    Q(e) && Zt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (Q(e)) {
      const t = $t(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, Vt(e);
        };
        return [
          null,
          {
            content: "Show Strengths",
            has_submenu: !0,
            submenu: {
              options: [
                {
                  content: "Single Strength",
                  checked: () => !t.showSeparate,
                  callback: () => o(!1)
                },
                {
                  content: "Separate Model & Clip",
                  checked: () => t.showSeparate,
                  callback: () => o(!0)
                }
              ]
            }
          }
        ];
      }
    }
    if (Ye(e)) {
      const t = (o) => {
        var n;
        return (n = e.setAllRows) == null ? void 0 : n.call(e, o);
      };
      return [
        null,
        { content: "Enable all", callback: () => t(!0) },
        { content: "Disable all", callback: () => t(!1) },
        { content: "Toggle all", callback: () => t(null) }
      ];
    }
    if (Ve(e)) {
      const t = (o) => {
        var n;
        return (n = e.setAllGroups) == null ? void 0 : n.call(e, o);
      };
      return [
        null,
        { content: "Enable all", callback: () => t(!0) },
        { content: "Disable all", callback: () => t(!1) },
        { content: "Toggle all", callback: () => t(null) }
      ];
    }
    return [];
  }
});
export {
  D as NODE_NAME
};
