import { app as C } from "/scripts/app.js";
const z = "Power Lora Loader (comfort)", A = /* @__PURE__ */ new WeakMap(), Ft = 32, Dt = 36, Ut = 34, J = 14, Gt = 380;
function Z(e) {
  var t;
  return (e == null ? void 0 : e.type) === z || (e == null ? void 0 : e.comfyClass) === z || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === z;
}
function Ht(e) {
  return A.get(e);
}
function H(e) {
  return J + Ft + e.rows.length * Dt + Ut + J;
}
function M(e, t) {
  var s;
  if (!e.size) return;
  const o = H(t), n = Math.max(e.size[0] || 0, Gt);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function Bt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function Ct(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function $t(e) {
  const t = !Ct(e);
  for (const o of e.rows) o.on = t;
}
function Q(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function Nt(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function F(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function D(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(r), o.appendChild(s), o;
}
function Wt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(Nt(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", n.appendChild(r), e.showSeparate ? (n.appendChild(D(t, "one")), n.appendChild(D(t, "two"))) : n.appendChild(D(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = Ct(e), s = Nt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(F("Model")), r.appendChild(F("Clip"))) : r.appendChild(F("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((d, a) => t.appendChild(Wt(e, d, a)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function jt(e) {
  const t = A.get(e);
  t && (g(t), M(e, t));
}
async function Yt() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function X(e, t, o, n) {
  const s = await Yt() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Vt(e, t, o, n) {
  const s = t.rows[o];
  if (!s) return;
  const r = o > 0, i = o < t.rows.length - 1, c = (d) => {
    const a = o + d;
    if (a < 0 || a >= t.rows.length) return;
    const l = t.rows[o];
    t.rows[o] = t.rows[a], t.rows[a] = l, g(t);
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
function qt(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      $t(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      X(t, e, n, (a) => {
        t.rows.push(Bt(a)), g(t), M(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const d = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, g(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      X(t, e, n, (a) => {
        c.lora = a, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      Q(c, -1, d), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      Q(c, 1, d), g(t);
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
    s && (n.preventDefault(), n.stopPropagation(), Vt(e, t, Number(s.dataset.idx), n));
  });
}
function Kt(e) {
  if (A.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  t.el.className = "comfort-lora-list", A.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], g(t), M(e, t);
    },
    getMinHeight: () => H(t),
    getMaxHeight: () => H(t)
  }), qt(e, t), g(t), M(e, t);
}
function Jt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class B extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Jt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const y = 0, x = 2, N = 4;
function b(e, t) {
  var n;
  if (Array.isArray(e)) {
    for (const s of e) b(s, t);
    return;
  }
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const o = (n = e.subgraph) == null ? void 0 : n.nodes;
  if (Array.isArray(o))
    for (const s of o) b(s, t);
}
function tt(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function St(e, t, o) {
  var c, d, a, l;
  const n = e.graph;
  if (!n) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (u) => {
    if (!u || r.has(u)) return;
    r.add(u);
    let p;
    t === "OUTPUT" ? p = (u.outputs || []).flatMap((f) => f.links || []) : p = (u.inputs || []).map((f) => f.link);
    for (const f of p) {
      if (f == null) continue;
      const h = n.links[f];
      if (!h) continue;
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, E = n.getNodeById(m);
      !E || r.has(E) || (tt(E) ? i(E) : s.push(E));
    }
  };
  if (o != null) {
    const u = t === "OUTPUT" ? ((d = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : d.links) || [] : [(l = (a = e.inputs) == null ? void 0 : a[o]) == null ? void 0 : l.link];
    for (const p of u) {
      if (p == null) continue;
      const f = n.links[p];
      if (!f) continue;
      const h = t === "OUTPUT" ? f.target_id : f.origin_id, m = n.getNodeById(h);
      !m || r.has(m) || (tt(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function S(e, t) {
  return St(e, "INPUT", t);
}
function et(e, t) {
  return St(e, "OUTPUT", t);
}
function P(e) {
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
function Zt(e) {
  var c, d, a, l, u, p, f, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((d = e.pos) == null ? void 0 : d[1]) ?? 0, r = ((a = e.size) == null ? void 0 : a[0]) ?? 0, i = ((l = e.size) == null ? void 0 : l[1]) ?? 0;
  for (const m of o) {
    const E = ((u = m.pos) == null ? void 0 : u[0]) ?? 0, K = ((p = m.pos) == null ? void 0 : p[1]) ?? 0, Pt = ((f = m.size) == null ? void 0 : f[0]) ?? 0, zt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= E && s >= K && n + r <= E + Pt && s + i <= K + zt)
      return m;
  }
  return null;
}
class O extends B {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, n, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(S(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const s = S(this, o)[0], r = (s == null ? void 0 : s.title) || "";
        n.name !== r && (n.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const Qt = 34, Xt = 10;
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
  const n = Xt * 2 + t * Qt, s = Math.max(e.size[0] || 0, o);
  (e.size[1] !== n || e.size[0] !== s) && ((r = e.setSize) == null || r.call(e, [s, n]));
}
const te = 260;
class kt extends O {
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
    t && (_t(t, this.rows, "Connect nodes to control them"), Mt(this, this.rows.length, te));
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
    const t = S(this), o = [];
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
const $ = "Fast Muter (comfort)", W = "Fast Bypasser (comfort)";
class ee extends kt {
  constructor() {
    super($), this.modeOn = y, this.modeOff = x;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class oe extends kt {
  constructor() {
    super(W), this.modeOn = y, this.modeOff = N;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const ne = ee, se = oe, Ot = "Node Collector (comfort)";
class re extends O {
  constructor() {
    super(Ot), this.addOutput("Output", "*");
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ie = re, j = "Mute / Bypass Repeater (comfort)";
class ce extends O {
  constructor() {
    super(j), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const o = t;
    for (const n of o)
      n.mode !== this.mode && b(n, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, o) {
    if (this.configuring) return;
    const n = S(this);
    if (n.length) {
      for (const r of n) b(r, o);
      return;
    }
    const s = Zt(this);
    if (s)
      for (const r of P(s))
        r !== this && b(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ae = ce;
function U(e) {
  return (e == null ? void 0 : e.type) === j;
}
const le = 500;
class de {
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
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), le));
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
const v = new de(), Tt = "Mode Relay (comfort)", ue = {
  ACTIVE: y,
  MUTE: x,
  BYPASS: N,
  NOTHING: -99
}, pe = {
  [x]: "on_muted_inputs",
  [N]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class fe extends O {
  constructor() {
    super(Tt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), nt.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, o) {
    if (super.onModeChange(t, o), this.configuring || S(this).length) return;
    const s = et(this).filter(U);
    for (const r of s)
      r.mode !== o && b(r, o);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, n, s, r) {
    return s ? U(s) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = S(this);
    let o;
    for (const d of t) {
      const a = d.mode;
      if (o === void 0) o = a;
      else {
        if (o === a && (a === x || a === N)) continue;
        a === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = pe[o], s = n ? ue[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = et(this).filter(U);
    for (const d of i)
      d.mode !== r && b(d, r);
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
    nt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const T = /* @__PURE__ */ new Set(), ot = () => {
  for (const e of T)
    try {
      e.evaluate();
    } catch {
    }
}, nt = {
  register(e) {
    T.add(e), v.schedule(ot, 1);
  },
  unregister(e) {
    T.delete(e), T.size || v.unschedule(ot);
  }
}, he = fe, Rt = "Random Unmuter (comfort)";
class me extends O {
  constructor() {
    super(Rt), this.tempEnabled = null, st.register(this);
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
    const t = S(this);
    if (!t.length || !t.every((s) => s.mode === x)) return;
    const n = t[Math.floor(Math.random() * t.length)];
    n && (b(n, y), this.tempEnabled = n);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (b(this.tempEnabled, x), this.tempEnabled = null);
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
    st.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const L = /* @__PURE__ */ new Set(), st = {
  register(e) {
    L.add(e), ge();
  },
  unregister(e) {
    L.delete(e);
  }
};
let rt = !1;
function ge() {
  if (rt) return;
  rt = !0;
  const e = C, t = e.queuePrompt;
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
      for (const c of L)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of L)
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
const ye = me, At = "NInfer Suspend Gate (comfort)", it = 30, be = 24, we = 32, xe = 30, Ee = 10, ve = 300, Ce = 6, Ne = 1, Se = 2e3, _e = 1e3, ct = ["indefinite", "1", "5", "10", "15", "30", "60"], Me = (e) => new Promise((t) => setTimeout(t, e));
async function Lt(e, t) {
  const o = t === void 0 ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(e)) : await fetch("/comfort/ninfer/forward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: e, body: t })
  }), n = await o.text();
  let s = n;
  try {
    s = JSON.parse(n);
  } catch {
  }
  return { status: o.status, body: s };
}
const at = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map();
async function lt(e, t) {
  const o = e + "/v1/models";
  if (t) {
    const r = at.get(o);
    if (r && Date.now() - r.at < _e) return r.models;
  }
  const n = G.get(o);
  if (n) return n;
  const s = (async () => {
    var d;
    const i = (d = (await Lt(o)).body) == null ? void 0 : d.data, c = Array.isArray(i) ? i.map((a) => {
      var l;
      return {
        id: String(a.id),
        value: String(((l = a.status) == null ? void 0 : l.value) ?? "")
      };
    }) : [];
    return at.set(o, { at: Date.now(), models: c }), c;
  })().finally(() => G.delete(o));
  return G.set(o, s), s;
}
function ke(e, t) {
  return Lt(e + "/v1/models/" + encodeURIComponent(t) + "/suspend", {});
}
class Oe extends B {
  constructor() {
    super(At), this.properties.url = "", this.properties.timeout = "indefinite", this.properties.selected = null, this.st = this.setupWidget(), ft.register(this);
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
    ft.unregister(this), (t = super.onRemoved) == null || t.call(this);
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
    for (const l of ct) {
      const u = document.createElement("option");
      u.value = l, u.textContent = l === "indefinite" ? "Busy timeout: indefinite" : `Busy timeout: ${l} min`, n.appendChild(u);
    }
    t.appendChild(n);
    const s = document.createElement("div");
    s.className = "comfort-ninfer-status", s.textContent = "Set NInfer URL to enable", t.appendChild(s);
    const r = document.createElement("div");
    r.className = "comfort-ninfer-bulk";
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-bulk", i.dataset.bulk = "all", i.textContent = "Select all";
    const c = document.createElement("button");
    c.type = "button", c.className = "comfort-bulk", c.dataset.bulk = "none", c.textContent = "Deselect all", r.appendChild(i), r.appendChild(c), t.appendChild(r);
    const d = document.createElement("div");
    d.className = "comfort-ninfer-rows", t.appendChild(d);
    const a = {
      el: t,
      urlInput: o,
      timeoutSel: n,
      statusEl: s,
      bulkEl: r,
      rowsEl: d,
      models: [],
      selected: /* @__PURE__ */ new Set(),
      phase: "idle",
      phaseModel: "",
      phaseStart: 0,
      resultText: "",
      resultHold: 0,
      polling: !1
    };
    return d.addEventListener("change", (l) => {
      const u = l.target;
      if (u.type !== "checkbox" || !u.dataset.id) return;
      const p = new Set(a.selected);
      u.checked ? p.add(u.dataset.id) : p.delete(u.dataset.id), a.selected = p, this.properties.selected = Array.from(p);
    }), r.addEventListener("click", (l) => {
      var p;
      const u = (p = l.target.dataset) == null ? void 0 : p.bulk;
      if (u === "all") {
        const f = a.models.filter((h) => h.value === "loaded").map((h) => h.id);
        a.selected = new Set(f), this.properties.selected = f;
      } else if (u === "none")
        a.selected = /* @__PURE__ */ new Set(), this.properties.selected = [];
      else
        return;
      this.renderRows();
    }), o.addEventListener("input", () => {
      this.properties.url = o.value.trim();
    }), o.addEventListener("change", () => {
      this.properties.url = o.value.trim(), this.properties.selected = null, a.phase = "idle", a.resultText = "", a.models = [], a.selected = /* @__PURE__ */ new Set(), this.refresh();
    }), n.addEventListener("change", () => {
      this.properties.timeout = n.value;
    }), typeof this.addDOMWidget == "function" && this.addDOMWidget("ninfer", "comfort_ninfer_list", t, {
      serialize: !1,
      hideOnZoom: !0
    }), a;
  }
  /** Push `this.properties` into the input controls (load path). */
  syncFieldsFromProperties() {
    const t = this.st;
    t.urlInput.value = String(this.properties.url || "");
    const o = String(this.properties.timeout || "indefinite");
    t.timeoutSel.value = ct.includes(o) ? o : "indefinite", t.selected = this.computeSelected(t.models);
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
      const d = n.value || "unknown", a = document.createElement("span");
      a.className = "comfort-ninfer-badge " + (d === "loaded" ? "loaded" : d === "sleeping" ? "suspended" : "other"), a.textContent = d === "sleeping" ? "suspended" : d, r.appendChild(a), o.appendChild(r);
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
    t.statusEl.textContent = n;
  }
  layout() {
    var r, i;
    const t = this.st.models.length, o = Ee * 2 + it + it + be + we + t * xe, n = Math.max(((r = this.size) == null ? void 0 : r[0]) || 0, ve), s = this.size;
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
      const s = await lt(n, !t);
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
   * Throws on timeout/unreachable so the queue is aborted rather than sent
   * while VRAM is still held.
   */
  async suspendChecked() {
    const t = this.st, o = this.baseUrl();
    if (!o) return;
    let n;
    try {
      n = await lt(o, !1);
    } catch {
      throw this.finish("NInfer unreachable", !0), new Error("NInfer unreachable");
    }
    t.models = n;
    const s = this.computeSelected(n);
    t.selected = s, this.renderRows();
    const r = n.filter(
      (d) => d.value === "loaded" && s.has(d.id)
    );
    if (!r.length) {
      this.finish("Ready (nothing to suspend)", !1);
      return;
    }
    const i = Date.now(), c = this.timeoutMs();
    try {
      for (const a of r) {
        const l = Date.now();
        for (this.beginSuspending(a.id, l); ; ) {
          const u = await ke(o, a.id);
          if (u.status === 200) break;
          if (u.status === 409) {
            if (this.setBusy(a.id, l), await Me(Se), Date.now() - i > c)
              throw new Error("timed out waiting for NInfer to idle");
            continue;
          }
          throw new Error(`suspend failed (HTTP ${u.status})`);
        }
      }
      const d = Math.round((Date.now() - i) / 1e3);
      this.finish(
        `Suspended ${r.length} model${r.length === 1 ? "" : "s"} (${d}s)`,
        !1
      ), t.resultHold = 2;
      try {
        await this.refresh(!0);
      } catch {
      }
    } finally {
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
const _ = /* @__PURE__ */ new Set();
let dt = !1;
const ut = () => {
  if (!document.hidden) {
    for (const e of Array.from(_))
      if (!e.removed)
        try {
          e.refresh();
        } catch {
        }
  }
}, pt = () => {
  for (const e of Array.from(_))
    if (!e.removed)
      try {
        e.updateLiveStatus();
      } catch {
      }
}, ft = {
  register(e) {
    _.add(e), Te(), v.schedule(ut, Ce), v.schedule(pt, Ne);
  },
  unregister(e) {
    _.delete(e), _.size || (v.unschedule(ut), v.unschedule(pt));
  }
};
function Te() {
  if (dt) return;
  dt = !0;
  const e = C, t = e.queuePrompt;
  e.queuePrompt = async function(...o) {
    for (const n of Array.from(_))
      n.removed || await n.suspendChecked();
    return await t.apply(e, o);
  };
}
const Y = "Fast Groups Muter (comfort)", V = "Fast Groups Bypasser (comfort)", Re = 280;
function Ae(e) {
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
    var u, p, f, h;
    const c = ((u = r.pos) == null ? void 0 : u[1]) ?? 0, d = ((p = i.pos) == null ? void 0 : p[1]) ?? 0;
    if (c !== d) return c - d;
    const a = ((f = r.pos) == null ? void 0 : f[0]) ?? 0, l = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return a !== l ? a - l : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function Le(e) {
  return P(e).some((t) => t.mode === y);
}
class It extends B {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), mt.register(this);
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
    const n = P(t.group);
    b(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Ae(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: Le(i)
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
    t && (_t(t, this.rows, "No groups in this workflow"), Mt(this, this.rows.length, Re));
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
    mt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class Ie extends It {
  constructor() {
    super(Y), this.modeOff = x;
  }
}
class Pe extends It {
  constructor() {
    super(V), this.modeOff = N;
  }
}
const R = /* @__PURE__ */ new Set(), ht = () => {
  for (const e of R)
    try {
      e.refresh();
    } catch {
    }
}, mt = {
  register(e) {
    R.add(e), v.schedule(ht, 2);
  },
  unregister(e) {
    R.delete(e), R.size || v.unschedule(ht);
  }
}, ze = Ie, Fe = Pe, gt = /* @__PURE__ */ new Set();
function w(e, t) {
  gt.has(e) || (gt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function De() {
  w($, ne), w(W, se), w(Ot, ie), w(j, ae), w(Tt, he), w(Rt, ye), w(Y, ze), w(V, Fe), w(At, Oe);
}
function Ue(e) {
  return (e == null ? void 0 : e.type) === $ || (e == null ? void 0 : e.type) === W;
}
function Ge(e) {
  return (e == null ? void 0 : e.type) === Y || (e == null ? void 0 : e.type) === V;
}
const He = 10, Be = /[/\\]/, yt = "__comfort_original";
function $e(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const a of e) {
    if (a == null) {
      s.push(a);
      continue;
    }
    const l = String(a), u = l.indexOf("/") > -1 ? "/" : "\\", p = l.indexOf(u);
    if (p > -1) {
      const f = l.slice(0, p), h = l.slice(p + 1);
      n.has(f) || n.set(f, []), n.get(f).push({ full: l, sub: h });
    } else
      s.push(a);
  }
  const r = (a, l) => ({
    content: l,
    [yt]: a,
    callback: (u) => o == null ? void 0 : o(u[yt])
  }), i = [], c = [...n.keys()].sort((a, l) => a.localeCompare(l));
  for (const a of c) {
    const l = n.get(a).map((u) => r(u.full, u.sub));
    i.push({
      content: `📁 ${a}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: l }
    });
  }
  for (const a of s)
    typeof a == "string" ? i.push(r(a, a)) : i.push(a);
  const d = Object.assign({}, t);
  return d.callback = void 0, { values: i, options: d };
}
function bt(e, t) {
  return !Array.isArray(e) || e.length < He ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && Be.test(o)) ? $e(e, t) : { values: e, options: t } : { values: e, options: t };
}
function We() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = bt(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = bt(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const k = 20, wt = 6, je = 6;
let I = /* @__PURE__ */ new Map();
function xt(e, t) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + t, o.textContent = e, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Ye(e) {
  let t = I.get(e);
  if (t) return t;
  const o = xt("M", "comfort-btn-mute"), n = xt("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), vt(e, "mute");
  }), n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), vt(e, "bypass");
  }), t = { group: e, mute: o, byp: n }, I.set(e, t), document.body.appendChild(o), document.body.appendChild(n), t;
}
function Et(e, t, o, n) {
  e.style.left = `${t}px`, e.style.top = `${o}px`, e.style.width = `${k * n}px`, e.style.height = `${k * n}px`, e.style.fontSize = `${Math.max(9, k * n * 0.5)}px`;
}
function Ve(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function qe() {
  const e = C.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const n = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (l) => n.left + (l + r[0]) * s, c = (l) => n.top + (l + r[1]) * s, d = t._groups || [], a = /* @__PURE__ */ new Set();
  for (const l of d)
    (e.selected_group === l || Ve(l, e.mouse)) && a.add(l);
  for (const l of a) {
    const u = Ye(l), p = l.pos[0] + l.size[0] - wt - k, f = l.pos[1] + wt;
    Et(u.mute, i(p - je - k), c(f), s), Et(u.byp, i(p), c(f), s), u.mute.style.display = "block", u.byp.style.display = "block";
  }
  for (const [l, u] of I)
    a.has(l) || (u.mute.style.display = "none", u.byp.style.display = "none"), d.includes(l) || (u.mute.remove(), u.byp.remove(), I.delete(l));
}
function vt(e, t) {
  var d;
  const o = P(e);
  if (!o.length) return;
  const n = o.every((a) => a.mode === x), s = o.every((a) => a.mode === N), r = C.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const a = n ? y : x;
      o.forEach((l) => l.mode = a);
    } else {
      const a = s ? y : N;
      o.forEach((l) => l.mode = a);
    }
  } catch (a) {
    console.warn("[comfort] group toggle failed", a);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = C.canvas;
  (d = c == null ? void 0 : c.setDirty) == null || d.call(c, !0, !0);
}
function Ke() {
  const e = C.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(o, ...n) {
    t == null || t.call(this, o, ...n);
    try {
      qe();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const Je = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-ninfer{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}.comfort-ninfer-url,.comfort-ninfer-timeout{width:100%;box-sizing:border-box;padding:4px 6px;font-size:12px;font-family:inherit;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-ninfer-status{min-height:18px;padding:2px;font-size:11px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-ninfer-bulk{display:flex;gap:6px}.comfort-bulk{flex:1 1 auto;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-bulk:hover{background:#7f7f7f33}.comfort-ninfer-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-ninfer-row.off .comfort-node-title{opacity:.5}.comfort-ninfer-row input[type=checkbox]{margin:0;cursor:pointer}.comfort-ninfer-badge{padding:1px 6px;border-radius:8px;font-size:10px;background:#7f7f7f40}.comfort-ninfer-badge.loaded{background:#7d2e2e;color:#fff}.comfort-ninfer-badge.suspended{background:#2e5d7d;color:#fff}.comfort-ninfer-badge.other{opacity:.7}", q = document.createElement("style");
q.setAttribute("data-comfort-plugin", "true");
q.textContent = Je;
document.head.appendChild(q);
De();
We();
C.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    Ke();
  },
  nodeCreated(e) {
    Z(e) && Kt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (Z(e)) {
      const t = Ht(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, jt(e);
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
    if (Ue(e)) {
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
    if (Ge(e)) {
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
  z as NODE_NAME
};
