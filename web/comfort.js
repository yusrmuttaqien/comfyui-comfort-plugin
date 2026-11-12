import { app as E } from "/scripts/app.js";
const F = "Power Lora Loader (comfort)", A = /* @__PURE__ */ new WeakMap(), At = 32, It = 36, Lt = 34, Z = 14, Pt = 380;
function J(e) {
  var t;
  return (e == null ? void 0 : e.type) === F || (e == null ? void 0 : e.comfyClass) === F || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === F;
}
function zt(e) {
  return A.get(e);
}
function H(e) {
  return Z + At + e.rows.length * It + Lt + Z;
}
function _(e, t) {
  var s;
  if (!e.size) return;
  const o = H(t), n = Math.max(e.size[0] || 0, Pt);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function Ft(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function Et(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function Dt(e) {
  const t = !Et(e);
  for (const o of e.rows) o.on = t;
}
function Q(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function vt(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function D(e) {
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
function Ut(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(vt(t.on, t.on ? "ON" : "OFF"));
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
  const n = Et(e), s = vt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(D("Model")), r.appendChild(D("Clip"))) : r.appendChild(D("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((u, l) => t.appendChild(Ut(e, u, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Gt(e) {
  const t = A.get(e);
  t && (g(t), _(e, t));
}
async function Ht() {
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
  const s = await Ht() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Bt(e, t, o, n) {
  const s = t.rows[o];
  if (!s) return;
  const r = o > 0, i = o < t.rows.length - 1, c = (u) => {
    const l = o + u;
    if (l < 0 || l >= t.rows.length) return;
    const a = t.rows[o];
    t.rows[o] = t.rows[l], t.rows[l] = a, g(t);
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
          t.rows.splice(o, 1), g(t), _(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function $t(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      Dt(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      X(t, e, n, (l) => {
        t.rows.push(Ft(l)), g(t), _(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const u = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, g(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      X(t, e, n, (l) => {
        c.lora = l, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      Q(c, -1, u), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      Q(c, 1, u), g(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), g(t), _(e, t);
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
    s && (n.preventDefault(), n.stopPropagation(), Bt(e, t, Number(s.dataset.idx), n));
  });
}
function Wt(e) {
  if (A.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", A.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], g(t), _(e, t);
    },
    getMinHeight: () => H(t),
    getMaxHeight: () => H(t)
  })), $t(e, t), g(t), _(e, t);
}
function Yt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class B extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Yt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
  /** Called after the subclass finishes setting up slots/widgets. */
  constructed() {
    this.__constructed__ = !0;
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
const y = 0, v = 2, M = 4;
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
function Ct(e, t, o) {
  var c, u, l, a;
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
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, x = n.getNodeById(m);
      !x || r.has(x) || (tt(x) ? i(x) : s.push(x));
    }
  };
  if (o != null) {
    const d = t === "OUTPUT" ? ((u = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : u.links) || [] : [(a = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : a.link];
    for (const p of d) {
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
function C(e, t) {
  return Ct(e, "INPUT", t);
}
function et(e, t) {
  return Ct(e, "OUTPUT", t);
}
function z(e) {
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
function Vt(e) {
  var c, u, l, a, d, p, f, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((u = e.pos) == null ? void 0 : u[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((a = e.size) == null ? void 0 : a[1]) ?? 0;
  for (const m of o) {
    const x = ((d = m.pos) == null ? void 0 : d[0]) ?? 0, K = ((p = m.pos) == null ? void 0 : p[1]) ?? 0, Tt = ((f = m.size) == null ? void 0 : f[0]) ?? 0, Rt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= x && s >= K && n + r <= x + Tt && s + i <= K + Rt)
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
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(C(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const s = C(this, o)[0], r = (s == null ? void 0 : s.title) || "";
        n.name !== r && (n.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const jt = 34, qt = 10, Kt = 260;
class _t extends O {
  constructor(t) {
    super(t), this.listEl = null, this.rows = [], this.widget = null, this.setupListWidget(), this.constructed();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && (this.widget = this.addDOMWidget("nodes", "comfort_node_list", this.listEl, {
      serialize: !0,
      hideOnZoom: !0,
      getValue: () => this.rows.map((t) => ({ title: t.title, on: t.on })),
      setValue: () => {
      }
    })), this.bindListEvents(), this.renderList();
  }
  renderList() {
    const t = this.listEl;
    if (t) {
      if (t.innerHTML = "", !this.rows.length) {
        const o = document.createElement("div");
        o.className = "comfort-node-empty", o.textContent = "Connect nodes to control them", t.appendChild(o);
      }
      this.rows.forEach((o, n) => {
        const s = document.createElement("div");
        s.className = "comfort-node-row" + (o.on ? "" : " off"), s.dataset.idx = String(n);
        const r = document.createElement("button");
        r.type = "button", r.className = "comfort-toggle " + (o.on ? "on" : "off"), r.textContent = o.on ? "ON" : "OFF", s.appendChild(r);
        const i = document.createElement("span");
        i.className = "comfort-node-title", i.textContent = o.title, i.title = o.title, s.appendChild(i), t.appendChild(s);
      }), this.resizeForRows();
    }
  }
  resizeForRows() {
    var n;
    if (!this.size) return;
    const t = qt * 2 + this.rows.length * jt, o = Math.max(this.size[0] || 0, Kt);
    (this.size[1] !== t || this.size[0] !== o) && ((n = this.setSize) == null || n.call(this, [o, t]));
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
    const t = C(this), o = [];
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
  /** Actions: set every row on/off/toggle. */
  setAllRows(t) {
    for (const o of this.rows)
      t !== null && (o.on = t), this.applyRowMode(o);
    this.renderList();
  }
}
const $ = "Fast Muter (comfort)", W = "Fast Bypasser (comfort)";
class Zt extends _t {
  constructor() {
    super($), this.modeOn = y, this.modeOff = v;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Jt extends _t {
  constructor() {
    super(W), this.modeOn = y, this.modeOff = M;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Qt = Zt, Xt = Jt, Nt = "Node Collector (comfort)";
class te extends O {
  constructor() {
    super(Nt), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ee = te, Y = "Mute / Bypass Repeater (comfort)";
class oe extends O {
  constructor() {
    super(Y), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
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
    const n = C(this);
    if (n.length) {
      for (const r of n) b(r, o);
      return;
    }
    const s = Vt(this);
    if (s)
      for (const r of z(s))
        r !== this && b(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ne = oe;
function G(e) {
  return (e == null ? void 0 : e.type) === Y;
}
const St = "Mode Relay (comfort)", se = {
  ACTIVE: y,
  MUTE: v,
  BYPASS: M,
  NOTHING: -99
}, re = {
  [v]: "on_muted_inputs",
  [M]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class ie extends O {
  constructor() {
    super(St), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), this.constructed(), ot.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, o) {
    if (super.onModeChange(t, o), this.configuring || C(this).length) return;
    const s = et(this).filter(G);
    for (const r of s)
      r.mode !== o && b(r, o);
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
    const t = C(this);
    let o;
    for (const u of t) {
      const l = u.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === v || l === M)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = re[o], s = n ? se[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = et(this).filter(G);
    for (const u of i)
      u.mode !== r && b(u, r);
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
    ot.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const T = /* @__PURE__ */ new Set();
let N = null;
const ot = {
  register(e) {
    T.add(e), N == null && (N = setInterval(() => {
      for (const t of T)
        try {
          t.evaluate();
        } catch {
        }
    }, 500));
  },
  unregister(e) {
    T.delete(e), !T.size && N != null && (clearInterval(N), N = null);
  }
}, ce = ie, kt = "Random Unmuter (comfort)";
class le extends O {
  constructor() {
    super(kt), this.tempEnabled = null, this.constructed(), nt.register(this);
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
    const t = C(this);
    if (!t.length || !t.every((s) => s.mode === v)) return;
    const n = t[Math.floor(Math.random() * t.length)];
    n && (b(n, y), this.tempEnabled = n);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (b(this.tempEnabled, v), this.tempEnabled = null);
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
    nt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const I = /* @__PURE__ */ new Set(), nt = {
  register(e) {
    I.add(e), ae();
  },
  unregister(e) {
    I.delete(e);
  }
};
let st = !1;
function ae() {
  if (st) return;
  st = !0;
  const e = E, t = e.queuePrompt;
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
      for (const c of I)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of I)
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
const de = le, Mt = "NInfer Suspend Gate (comfort)", rt = 30, ue = 24, pe = 32, fe = 30, he = 10, me = 300, ge = 3e3, ye = 2e3, it = ["indefinite", "1", "5", "10", "15", "30", "60"], be = (e) => new Promise((t) => setTimeout(t, e));
class we extends B {
  constructor() {
    super(Mt), this.properties.url = "", this.properties.timeout = "indefinite", this.properties.selected = null, this.st = this.setupWidget(), at.register(this), this.constructed();
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
    this.stopTicker(), at.unregister(this), (t = super.onRemoved) == null || t.call(this);
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
    for (const a of it) {
      const d = document.createElement("option");
      d.value = a, d.textContent = a === "indefinite" ? "Busy timeout: indefinite" : `Busy timeout: ${a} min`, n.appendChild(d);
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
    const u = document.createElement("div");
    u.className = "comfort-ninfer-rows", t.appendChild(u);
    const l = {
      el: t,
      widget: null,
      urlInput: o,
      timeoutSel: n,
      statusEl: s,
      bulkEl: r,
      rowsEl: u,
      models: [],
      selected: /* @__PURE__ */ new Set(),
      phase: "idle",
      phaseModel: "",
      phaseStart: 0,
      resultText: "",
      resultHold: 0,
      ticker: null,
      polling: !1
    };
    return u.addEventListener("change", (a) => {
      const d = a.target;
      if (d.type !== "checkbox" || !d.dataset.id) return;
      const p = new Set(l.selected);
      d.checked ? p.add(d.dataset.id) : p.delete(d.dataset.id), l.selected = p, this.properties.selected = Array.from(p);
    }), r.addEventListener("click", (a) => {
      var p;
      const d = (p = a.target.dataset) == null ? void 0 : p.bulk;
      if (d === "all") {
        const f = l.models.filter((h) => h.value === "loaded").map((h) => h.id);
        l.selected = new Set(f), this.properties.selected = f;
      } else if (d === "none")
        l.selected = /* @__PURE__ */ new Set(), this.properties.selected = [];
      else
        return;
      this.renderRows();
    }), o.addEventListener("input", () => {
      this.properties.url = o.value.trim();
    }), o.addEventListener("change", () => {
      this.properties.url = o.value.trim(), this.properties.selected = null, l.phase = "idle", l.resultText = "", l.models = [], l.selected = /* @__PURE__ */ new Set(), this.refresh();
    }), n.addEventListener("change", () => {
      this.properties.timeout = n.value;
    }), typeof this.addDOMWidget == "function" && (l.widget = this.addDOMWidget("ninfer", "comfort_ninfer_list", t, {
      serialize: !1,
      hideOnZoom: !0
    })), l;
  }
  /** Push `this.properties` into the input controls (load path). */
  syncFieldsFromProperties() {
    const t = this.st;
    t.urlInput.value = String(this.properties.url || "");
    const o = String(this.properties.timeout || "indefinite");
    t.timeoutSel.value = it.includes(o) ? o : "indefinite", t.selected = this.computeSelected(t.models);
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
      const u = n.value || "unknown", l = document.createElement("span");
      l.className = "comfort-ninfer-badge " + (u === "loaded" ? "loaded" : u === "sleeping" ? "suspended" : "other"), l.textContent = u === "sleeping" ? "suspended" : u, r.appendChild(l), o.appendChild(r);
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
  startTicker() {
    const t = this.st;
    t.ticker === null && (t.ticker = window.setInterval(() => this.renderStatus(), 500));
  }
  stopTicker() {
    const t = this.st;
    t.ticker !== null && (window.clearInterval(t.ticker), t.ticker = null);
  }
  layout() {
    var r, i;
    const t = this.st.models.length, o = he * 2 + rt + rt + ue + pe + t * fe, n = Math.max(((r = this.size) == null ? void 0 : r[0]) || 0, me), s = this.size;
    (!s || s[1] !== o || s[0] !== n) && ((i = this.setSize) == null || i.call(this, [n, o]));
  }
  // --- NInfer calls (via proxy) ------------------------------------------
  async forward(t, o) {
    const n = o === void 0 ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(t)) : await fetch("/comfort/ninfer/forward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: t, body: o })
    }), s = await n.text();
    let r = s;
    try {
      r = JSON.parse(s);
    } catch {
    }
    return { status: n.status, body: r };
  }
  async fetchModels(t) {
    var s;
    const n = (s = (await this.forward(t + "/v1/models")).body) == null ? void 0 : s.data;
    return Array.isArray(n) ? n.map((r) => {
      var i;
      return {
        id: String(r.id),
        value: String(((i = r.status) == null ? void 0 : i.value) ?? "")
      };
    }) : [];
  }
  suspendModel(t, o) {
    return this.forward(t + "/v1/models/" + encodeURIComponent(o) + "/suspend", {});
  }
  // --- polling -----------------------------------------------------------
  /** Refresh the model list + status. Called on a shared interval + on demand. */
  async refresh() {
    const t = this.st;
    if (t.polling || t.phase === "suspending" || t.phase === "busy") return;
    const o = this.baseUrl();
    if (!o) {
      t.models = [], t.selected = /* @__PURE__ */ new Set(), this.renderRows(), this.renderStatus(), this.layout();
      return;
    }
    t.polling = !0;
    try {
      const n = await this.fetchModels(o);
      t.models = n, this.properties.selected == null && (this.properties.selected = n.filter((s) => s.value === "loaded").map((s) => s.id)), t.selected = this.computeSelected(n), this.renderRows(), this.layout(), (t.phase === "done" || t.phase === "error") && t.resultHold > 0 ? t.resultHold-- : t.phase !== "idle" && (t.phase = "idle", t.resultText = ""), this.renderStatus();
    } catch {
      t.phase === "idle" && (t.phase = "error", t.resultText = "NInfer unreachable"), this.renderStatus();
    } finally {
      t.polling = !1;
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
      n = await this.fetchModels(o);
    } catch {
      throw this.finish("NInfer unreachable", !0), new Error("NInfer unreachable");
    }
    t.models = n;
    const s = this.computeSelected(n);
    t.selected = s, this.renderRows();
    const r = n.filter(
      (u) => u.value === "loaded" && s.has(u.id)
    );
    if (!r.length) {
      this.finish("Ready (nothing to suspend)", !1);
      return;
    }
    const i = Date.now(), c = this.timeoutMs();
    try {
      for (const l of r) {
        const a = Date.now();
        for (this.beginSuspending(l.id, a); ; ) {
          const d = await this.suspendModel(o, l.id);
          if (d.status === 200) break;
          if (d.status === 409) {
            if (this.setBusy(l.id, a), await be(ye), Date.now() - i > c)
              throw new Error("timed out waiting for NInfer to idle");
            continue;
          }
          throw new Error(`suspend failed (HTTP ${d.status})`);
        }
      }
      const u = Math.round((Date.now() - i) / 1e3);
      this.finish(
        `Suspended ${r.length} model${r.length === 1 ? "" : "s"} (${u}s)`,
        !1
      ), t.resultHold = 2;
      try {
        await this.refresh();
      } catch {
      }
    } finally {
      this.stopTicker();
    }
  }
  beginSuspending(t, o) {
    const n = this.st;
    n.phase = "suspending", n.phaseModel = t, n.phaseStart = o, this.startTicker(), this.renderStatus();
  }
  setBusy(t, o) {
    const n = this.st;
    n.phase = "busy", n.phaseModel = t, n.phaseStart = o, this.renderStatus();
  }
  finish(t, o) {
    const n = this.st;
    n.phase = o ? "error" : "done", n.resultText = t, this.stopTicker(), this.renderStatus();
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
const L = /* @__PURE__ */ new Set();
let ct = null, lt = !1;
const at = {
  register(e) {
    L.add(e), Ee(), xe();
  },
  unregister(e) {
    L.delete(e);
  }
};
function xe() {
  ct === null && (ct = window.setInterval(() => {
    for (const e of Array.from(L))
      if (!e.removed)
        try {
          e.refresh();
        } catch {
        }
  }, ge));
}
function Ee() {
  if (lt) return;
  lt = !0;
  const e = E, t = e.queuePrompt;
  e.queuePrompt = async function(...o) {
    for (const n of Array.from(L))
      n.removed || await n.suspendChecked();
    return await t.apply(e, o);
  };
}
const V = "Fast Groups Muter (comfort)", j = "Fast Groups Bypasser (comfort)", ve = 34, Ce = 10, _e = 280;
function Ne(e) {
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
    const c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0, u = ((p = i.pos) == null ? void 0 : p[1]) ?? 0;
    if (c !== u) return c - u;
    const l = ((f = r.pos) == null ? void 0 : f[0]) ?? 0, a = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== a ? l - a : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function Se(e) {
  return z(e).some((t) => t.mode === y);
}
class Ot extends B {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), dt.register(this), this.constructed();
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
    const n = z(t.group);
    b(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Ne(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: Se(i)
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
    var o;
    const t = this.listEl;
    if (t) {
      if (t.innerHTML = "", !this.rows.length) {
        const n = document.createElement("div");
        n.className = "comfort-node-empty", n.textContent = "No groups in this workflow", t.appendChild(n);
      }
      if (this.rows.forEach((n, s) => {
        const r = document.createElement("div");
        r.className = "comfort-node-row" + (n.on ? "" : " off"), r.dataset.idx = String(s);
        const i = document.createElement("button");
        i.type = "button", i.className = "comfort-toggle " + (n.on ? "on" : "off"), i.textContent = n.on ? "ON" : "OFF", r.appendChild(i);
        const c = document.createElement("span");
        c.className = "comfort-node-title", c.textContent = n.title, c.title = n.title, r.appendChild(c), t.appendChild(r);
      }), this.size) {
        const n = Ce * 2 + this.rows.length * ve, s = Math.max(this.size[0] || 0, _e);
        (this.size[1] !== n || this.size[0] !== s) && ((o = this.setSize) == null || o.call(this, [s, n]));
      }
    }
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
    dt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class ke extends Ot {
  constructor() {
    super(V), this.modeOff = v;
  }
}
class Me extends Ot {
  constructor() {
    super(j), this.modeOff = M;
  }
}
const R = /* @__PURE__ */ new Set();
let S = null;
const dt = {
  register(e) {
    R.add(e), S == null && (S = setInterval(() => {
      for (const t of R)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    R.delete(e), !R.size && S != null && (clearInterval(S), S = null);
  }
}, Oe = ke, Te = Me, ut = /* @__PURE__ */ new Set();
function w(e, t) {
  ut.has(e) || (ut.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function Re() {
  w($, Qt), w(W, Xt), w(Nt, ee), w(Y, ne), w(St, ce), w(kt, de), w(V, Oe), w(j, Te), w(Mt, we);
}
function Ae(e) {
  return (e == null ? void 0 : e.type) === $ || (e == null ? void 0 : e.type) === W;
}
function Ie(e) {
  return (e == null ? void 0 : e.type) === V || (e == null ? void 0 : e.type) === j;
}
const Le = 10, Pe = /[/\\]/, pt = "__comfort_original";
function ze(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const l of e) {
    if (l == null) {
      s.push(l);
      continue;
    }
    const a = String(l), d = a.indexOf("/") > -1 ? "/" : "\\", p = a.indexOf(d);
    if (p > -1) {
      const f = a.slice(0, p), h = a.slice(p + 1);
      n.has(f) || n.set(f, []), n.get(f).push({ full: a, sub: h });
    } else
      s.push(l);
  }
  const r = (l, a) => ({
    content: a,
    [pt]: l,
    callback: (d) => o == null ? void 0 : o(d[pt])
  }), i = [], c = [...n.keys()].sort((l, a) => l.localeCompare(a));
  for (const l of c) {
    const a = n.get(l).map((d) => r(d.full, d.sub));
    i.push({
      content: `📁 ${l}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: a }
    });
  }
  for (const l of s)
    typeof l == "string" ? i.push(r(l, l)) : i.push(l);
  const u = Object.assign({}, t);
  return u.callback = void 0, { values: i, options: u };
}
function ft(e, t) {
  return !Array.isArray(e) || e.length < Le ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && Pe.test(o)) ? ze(e, t) : { values: e, options: t } : { values: e, options: t };
}
function Fe() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = ft(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = ft(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const k = 20, ht = 6, De = 6, mt = 0, gt = 2, yt = 4;
let P = /* @__PURE__ */ new Map();
function bt(e, t) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + t, o.textContent = e, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Ue(e) {
  let t = P.get(e);
  if (t) return t;
  const o = bt("M", "comfort-btn-mute"), n = bt("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), xt(e, "mute");
  }), n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), xt(e, "bypass");
  }), t = { group: e, mute: o, byp: n }, P.set(e, t), document.body.appendChild(o), document.body.appendChild(n), t;
}
function wt(e, t, o, n) {
  e.style.left = `${t}px`, e.style.top = `${o}px`, e.style.width = `${k * n}px`, e.style.height = `${k * n}px`, e.style.fontSize = `${Math.max(9, k * n * 0.5)}px`;
}
function Ge(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function He() {
  const e = E.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const n = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (a) => n.left + (a + r[0]) * s, c = (a) => n.top + (a + r[1]) * s, u = t._groups || [], l = /* @__PURE__ */ new Set();
  for (const a of u)
    (e.selected_group === a || Ge(a, e.mouse)) && l.add(a);
  for (const a of l) {
    const d = Ue(a), p = a.pos[0] + a.size[0] - ht - k, f = a.pos[1] + ht;
    wt(d.mute, i(p - De - k), c(f), s), wt(d.byp, i(p), c(f), s), d.mute.style.display = "block", d.byp.style.display = "block";
  }
  for (const [a, d] of P)
    l.has(a) || (d.mute.style.display = "none", d.byp.style.display = "none"), u.includes(a) || (d.mute.remove(), d.byp.remove(), P.delete(a));
}
function xt(e, t) {
  var u;
  const o = z(e);
  if (!o.length) return;
  const n = o.every((l) => l.mode === gt), s = o.every((l) => l.mode === yt), r = E.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const l = n ? mt : gt;
      o.forEach((a) => a.mode = l);
    } else {
      const l = s ? mt : yt;
      o.forEach((a) => a.mode = l);
    }
  } catch (l) {
    console.warn("[comfort] group toggle failed", l);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = E.canvas;
  (u = c == null ? void 0 : c.setDirty) == null || u.call(c, !0, !0);
}
function Be() {
  const e = E.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(o, ...n) {
    t == null || t.call(this, o, ...n);
    try {
      He();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const $e = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-ninfer{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}.comfort-ninfer-url,.comfort-ninfer-timeout{width:100%;box-sizing:border-box;padding:4px 6px;font-size:12px;font-family:inherit;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-ninfer-status{min-height:18px;padding:2px;font-size:11px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-ninfer-bulk{display:flex;gap:6px}.comfort-bulk{flex:1 1 auto;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-bulk:hover{background:#7f7f7f33}.comfort-ninfer-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-ninfer-row.off .comfort-node-title{opacity:.5}.comfort-ninfer-row input[type=checkbox]{margin:0;cursor:pointer}.comfort-ninfer-badge{padding:1px 6px;border-radius:8px;font-size:10px;background:#7f7f7f40}.comfort-ninfer-badge.loaded{background:#7d2e2e;color:#fff}.comfort-ninfer-badge.suspended{background:#2e5d7d;color:#fff}.comfort-ninfer-badge.other{opacity:.7}", q = document.createElement("style");
q.setAttribute("data-comfort-plugin", "true");
q.textContent = $e;
document.head.appendChild(q);
Re();
Fe();
E.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    Be();
  },
  nodeCreated(e) {
    J(e) && Wt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (J(e)) {
      const t = zt(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, Gt(e);
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
    if (Ae(e)) {
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
    if (Ie(e)) {
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
  F as NODE_NAME
};
