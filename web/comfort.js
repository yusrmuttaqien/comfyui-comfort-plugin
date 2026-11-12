import { app as B } from "/scripts/app.js";
import { api as b } from "/scripts/api.js";
const P = "Power Lora Loader (comfort)", T = /* @__PURE__ */ new WeakMap(), xt = 32, bt = 36, Et = 34, K = 14, _t = 380;
function Q(e) {
  var t;
  return (e == null ? void 0 : e.type) === P || (e == null ? void 0 : e.comfyClass) === P || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === P;
}
function Ct(e) {
  return T.get(e);
}
function G(e) {
  return K + xt + e.rows.length * bt + Et + K;
}
function v(e, t) {
  var n;
  if (!e.size) return;
  const o = G(t), r = Math.max(e.size[0] || 0, _t);
  (e.size[1] !== o || e.size[0] !== r) && ((n = e.setSize) == null || n.call(e, [r, o]));
}
function vt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function ct(e) {
  let t = !0, o = !0;
  for (const r of e.rows)
    if (t = t && r.on === !0, o = o && r.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function Nt(e) {
  const t = !ct(e);
  for (const o of e.rows) o.on = t;
}
function Z(e, t, o) {
  const r = o ? "strengthTwo" : "strength", n = e[r] ?? 1;
  e[r] = Math.round((n + t * 0.05) * 100) / 100;
}
function lt(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function z(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function F(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-dec", r.textContent = "−", r.title = "Decrease strength";
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-inc", n.textContent = "+", n.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), s.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(r), o.appendChild(s), o.appendChild(n), o;
}
function Mt(e, t, o) {
  const r = document.createElement("div");
  r.className = "comfort-lora-row" + (t.on ? "" : " off"), r.dataset.idx = String(o), r.appendChild(lt(t.on, t.on ? "ON" : "OFF"));
  const n = document.createElement("span");
  n.className = "comfort-name", n.textContent = t.lora || "None", n.title = t.lora || "No lora selected — click to choose", r.appendChild(n);
  const s = document.createElement("span");
  s.className = "comfort-spacer", r.appendChild(s), e.showSeparate ? (r.appendChild(F(t, "one")), r.appendChild(F(t, "two"))) : r.appendChild(F(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", r.appendChild(i), r;
}
function m(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const r = ct(e), n = lt(r !== !1, r === !1 ? "ALL OFF" : "ALL ON");
  n.className += " comfort-toggle-all", n.title = "Toggle all loras", o.appendChild(n);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", e.showSeparate ? (s.appendChild(z("Model")), s.appendChild(z("Clip"))) : s.appendChild(z("Strength")), o.appendChild(s), t.appendChild(o), e.rows.forEach((a, l) => t.appendChild(Mt(e, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Ot(e) {
  const t = T.get(e);
  t && (m(t), v(e, t));
}
async function kt() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function J(e, t, o, r) {
  const n = await kt() || ["(no loras found)"], s = n.length ? n : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && r(i);
    }
  });
}
function St(e, t, o, r) {
  const n = t.rows[o];
  if (!n) return;
  const s = o > 0, i = o < t.rows.length - 1, c = (a) => {
    const l = o + a;
    if (l < 0 || l >= t.rows.length) return;
    const f = t.rows[o];
    t.rows[o] = t.rows[l], t.rows[l] = f, m(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${n.on ? "⚫" : "◯"} Toggle ${n.on ? "Off" : "On"}`,
        callback: () => {
          n.on = !n.on, m(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !s, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(o, 1), m(t), v(e, t);
        }
      }
    ],
    { title: "LORA", event: r }
  );
}
function Rt(e, t) {
  const o = t.el;
  o.addEventListener("click", (r) => {
    const n = r.target;
    if (n.closest(".comfort-toggle-all")) {
      Nt(t), m(t);
      return;
    }
    if (n.closest(".comfort-add-btn")) {
      J(t, e, r, (l) => {
        t.rows.push(vt(l)), m(t), v(e, t);
      });
      return;
    }
    const s = n.closest(".comfort-lora-row");
    if (!s) return;
    const i = Number(s.dataset.idx), c = t.rows[i];
    if (!c) return;
    const a = !!n.closest(".comfort-strength-clip");
    if (n.closest(".comfort-toggle")) {
      c.on = !c.on, m(t);
      return;
    }
    if (n.closest(".comfort-name")) {
      J(t, e, r, (l) => {
        c.lora = l, m(t);
      });
      return;
    }
    if (n.closest(".comfort-dec")) {
      Z(c, -1, a), m(t);
      return;
    }
    if (n.closest(".comfort-inc")) {
      Z(c, 1, a), m(t);
      return;
    }
    if (n.closest(".comfort-remove")) {
      t.rows.splice(i, 1), m(t), v(e, t);
      return;
    }
  }), o.addEventListener("change", (r) => {
    const n = r.target, s = n.closest(".comfort-lora-row");
    if (!s || !n.matches("input[type='number']")) return;
    const i = t.rows[Number(s.dataset.idx)];
    if (!i) return;
    const c = parseFloat(n.value);
    Number.isFinite(c) && (n.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), o.addEventListener("contextmenu", (r) => {
    const n = r.target.closest(".comfort-lora-row");
    n && (r.preventDefault(), r.stopPropagation(), St(e, t, Number(n.dataset.idx), r));
  });
}
function Lt(e) {
  if (T.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", T.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], m(t), v(e, t);
    },
    getMinHeight: () => G(t),
    getMaxHeight: () => G(t)
  })), Rt(e, t), m(t), v(e, t);
}
function Tt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const r = Object.getOwnPropertyDescriptor(o, t);
    if (r) return r;
    o = Object.getPrototypeOf(o);
  }
}
class at extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Tt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: o,
      set: (r) => {
        const n = o();
        t != null && t.set ? t.set.call(this, r) : this.__comfort_mode = r, n !== r && this.onModeChange(n, r);
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
const y = 0, _ = 2, k = 4;
function w(e, t) {
  var r;
  if (Array.isArray(e)) {
    for (const n of e) w(n, t);
    return;
  }
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const o = (r = e.subgraph) == null ? void 0 : r.nodes;
  if (Array.isArray(o))
    for (const n of o) w(n, t);
}
function X(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function ut(e, t, o) {
  var c, a, l, f;
  const r = e.graph;
  if (!r) return [];
  const n = [], s = /* @__PURE__ */ new Set(), i = (p) => {
    if (!p || s.has(p)) return;
    s.add(p);
    let d;
    t === "OUTPUT" ? d = (p.outputs || []).flatMap((u) => u.links || []) : d = (p.inputs || []).map((u) => u.link);
    for (const u of d) {
      if (u == null) continue;
      const g = r.links[u];
      if (!g) continue;
      const h = t === "OUTPUT" ? g.target_id : g.origin_id, x = r.getNodeById(h);
      !x || s.has(x) || (X(x) ? i(x) : n.push(x));
    }
  };
  if (o != null) {
    const p = t === "OUTPUT" ? ((a = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : a.links) || [] : [(f = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : f.link];
    for (const d of p) {
      if (d == null) continue;
      const u = r.links[d];
      if (!u) continue;
      const g = t === "OUTPUT" ? u.target_id : u.origin_id, h = r.getNodeById(g);
      !h || s.has(h) || (X(h) ? i(h) : n.push(h));
    }
  } else
    i(e);
  return n;
}
function C(e, t) {
  return ut(e, "INPUT", t);
}
function tt(e, t) {
  return ut(e, "OUTPUT", t);
}
function U(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var r;
    return o && (o.isLGraphNode || ((r = o.constructor) == null ? void 0 : r.type));
  }) : [];
}
function At(e) {
  var c, a, l, f, p, d, u, g;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], r = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, n = ((a = e.pos) == null ? void 0 : a[1]) ?? 0, s = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((f = e.size) == null ? void 0 : f[1]) ?? 0;
  for (const h of o) {
    const x = ((p = h.pos) == null ? void 0 : p[0]) ?? 0, j = ((d = h.pos) == null ? void 0 : d[1]) ?? 0, yt = ((u = h.size) == null ? void 0 : u[0]) ?? 0, wt = ((g = h.size) == null ? void 0 : g[1]) ?? 0;
    if (r >= x && n >= j && r + s <= x + yt && n + i <= j + wt)
      return h;
  }
  return null;
}
class S extends at {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, r, n, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, r, n, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(C(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const r = this.inputs[o];
      if (r.link != null) {
        const n = C(this, o)[0], s = (n == null ? void 0 : n.title) || "";
        r.name !== s && (r.name = s);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const Pt = 34, zt = 10, Ft = 260;
class pt extends S {
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
      this.rows.forEach((o, r) => {
        const n = document.createElement("div");
        n.className = "comfort-node-row" + (o.on ? "" : " off"), n.dataset.idx = String(r);
        const s = document.createElement("button");
        s.type = "button", s.className = "comfort-toggle " + (o.on ? "on" : "off"), s.textContent = o.on ? "ON" : "OFF", n.appendChild(s);
        const i = document.createElement("span");
        i.className = "comfort-node-title", i.textContent = o.title, i.title = o.title, n.appendChild(i), t.appendChild(n);
      }), this.resizeForRows();
    }
  }
  resizeForRows() {
    var r;
    if (!this.size) return;
    const t = zt * 2 + this.rows.length * Pt, o = Math.max(this.size[0] || 0, Ft);
    (this.size[1] !== t || this.size[0] !== o) && ((r = this.setSize) == null || r.call(this, [o, t]));
  }
  bindListEvents() {
    const t = this.listEl;
    t && t.addEventListener("click", (o) => {
      const n = o.target.closest(".comfort-node-row");
      if (!n) return;
      const s = Number(n.dataset.idx), i = this.rows[s];
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
    for (const r of t) {
      const n = r.title || r.type || "node", s = this.rows.find((c) => c.node === r), i = s ? s.on : r.mode === this.modeOn;
      o.push({ node: r, title: n, on: i });
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
const $ = "Fast Muter (comfort)", H = "Fast Bypasser (comfort)";
class It extends pt {
  constructor() {
    super($), this.modeOn = y, this.modeOff = _;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Dt extends pt {
  constructor() {
    super(H), this.modeOn = y, this.modeOff = k;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Gt = It, Bt = Dt, dt = "Node Collector (comfort)";
class Ut extends S {
  constructor() {
    super(dt), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const $t = Ut, W = "Mute / Bypass Repeater (comfort)";
class Ht extends S {
  constructor() {
    super(W), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const o = t;
    for (const r of o)
      r.mode !== this.mode && w(r, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, o) {
    if (this.configuring) return;
    const r = C(this);
    if (r.length) {
      for (const s of r) w(s, o);
      return;
    }
    const n = At(this);
    if (n)
      for (const s of U(n))
        s !== this && w(s, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Wt = Ht;
function I(e) {
  return (e == null ? void 0 : e.type) === W;
}
const ft = "Mode Relay (comfort)", qt = {
  ACTIVE: y,
  MUTE: _,
  BYPASS: k,
  NOTHING: -99
}, Yt = {
  [_]: "on_muted_inputs",
  [k]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class Vt extends S {
  constructor() {
    super(ft), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), this.constructed(), et.register(this);
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
    const n = tt(this).filter(I);
    for (const s of n)
      s.mode !== o && w(s, o);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, r, n, s) {
    return n ? I(n) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = C(this);
    let o;
    for (const a of t) {
      const l = a.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === _ || l === k)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const r = Yt[o], n = r ? qt[String((c = this.properties) == null ? void 0 : c[r])] : o, s = n !== void 0 ? n : o;
    if (s === -99) return;
    const i = tt(this).filter(I);
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
    var t;
    et.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const R = /* @__PURE__ */ new Set();
let N = null;
const et = {
  register(e) {
    R.add(e), N == null && (N = setInterval(() => {
      for (const t of R)
        try {
          t.evaluate();
        } catch {
        }
    }, 500));
  },
  unregister(e) {
    R.delete(e), !R.size && N != null && (clearInterval(N), N = null);
  }
}, jt = Vt, ht = "Random Unmuter (comfort)";
class Kt extends S {
  constructor() {
    super(ht), this.tempEnabled = null, this.constructed(), ot.register(this);
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
    if (!t.length || !t.every((n) => n.mode === _)) return;
    const r = t[Math.floor(Math.random() * t.length)];
    r && (w(r, y), this.tempEnabled = r);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (w(this.tempEnabled, _), this.tempEnabled = null);
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
    ot.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const A = /* @__PURE__ */ new Set(), ot = {
  register(e) {
    A.add(e), Qt();
  },
  unregister(e) {
    A.delete(e);
  }
};
let nt = !1;
function Qt() {
  if (nt) return;
  nt = !0;
  const e = B, t = e.queuePrompt;
  let o = !1;
  e.queuePrompt = async function(...n) {
    o = !0;
    try {
      return await t.apply(e, n);
    } finally {
      o = !1;
    }
  };
  const r = e.graphToPrompt;
  e.graphToPrompt = function(...n) {
    if (o)
      for (const c of A)
        try {
          c.onPromptStart();
        } catch {
        }
    const s = r.apply(e, n), i = () => {
      for (const c of A)
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
const Zt = Kt, q = "Fast Groups Muter (comfort)", Y = "Fast Groups Bypasser (comfort)", Jt = 34, Xt = 10, te = 280;
function ee(e) {
  const t = e.graph;
  if (!t) return [];
  const o = /* @__PURE__ */ new Set(), r = [], n = (s) => {
    var i;
    if (!(!s || o.has(s))) {
      o.add(s);
      for (const c of s._groups || s.groups || []) r.push(c);
      for (const c of s._subgraphs || []) n(c);
      for (const c of s._nodes || [])
        (i = c.subgraph) != null && i._groups && n(c.subgraph);
    }
  };
  return n(t), r.sort((s, i) => {
    var p, d, u, g;
    const c = ((p = s.pos) == null ? void 0 : p[1]) ?? 0, a = ((d = i.pos) == null ? void 0 : d[1]) ?? 0;
    if (c !== a) return c - a;
    const l = ((u = s.pos) == null ? void 0 : u[0]) ?? 0, f = ((g = i.pos) == null ? void 0 : g[0]) ?? 0;
    return l !== f ? l - f : String(s.title || "").localeCompare(String(i.title || ""));
  }), r;
}
function oe(e) {
  return U(e).some((t) => t.mode === y);
}
class mt extends at {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), rt.register(this), this.constructed();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("groups", "comfort_group_list", this.listEl, {
      serialize: !1,
      hideOnZoom: !0,
      getValue: () => this.rows.map((t) => ({ title: t.title, on: t.on })),
      setValue: () => {
      }
    }), this.listEl.addEventListener("click", (t) => {
      const r = t.target.closest(".comfort-node-row");
      if (!r) return;
      const n = this.rows[Number(r.dataset.idx)];
      n && (this.applyGroupMode(n, !n.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(t, o) {
    const r = U(t.group);
    w(r, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var s;
    const t = ee(this), o = String(((s = this.properties) == null ? void 0 : s.matchTitle) || "").trim();
    let r = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: oe(i)
    }));
    if (o)
      try {
        const i = new RegExp(o, "i");
        r = r.filter((c) => i.test(c.title));
      } catch {
        r = r.filter((i) => i.title.toLowerCase().includes(o.toLowerCase()));
      }
    const n = r.map((i) => i.title + (i.on ? 1 : 0)).join("|");
    n !== this.lastKey && (this.lastKey = n, this.rows = r, this.renderList());
  }
  renderList() {
    var o;
    const t = this.listEl;
    if (t) {
      if (t.innerHTML = "", !this.rows.length) {
        const r = document.createElement("div");
        r.className = "comfort-node-empty", r.textContent = "No groups in this workflow", t.appendChild(r);
      }
      if (this.rows.forEach((r, n) => {
        const s = document.createElement("div");
        s.className = "comfort-node-row" + (r.on ? "" : " off"), s.dataset.idx = String(n);
        const i = document.createElement("button");
        i.type = "button", i.className = "comfort-toggle " + (r.on ? "on" : "off"), i.textContent = r.on ? "ON" : "OFF", s.appendChild(i);
        const c = document.createElement("span");
        c.className = "comfort-node-title", c.textContent = r.title, c.title = r.title, s.appendChild(c), t.appendChild(s);
      }), this.size) {
        const r = Xt * 2 + this.rows.length * Jt, n = Math.max(this.size[0] || 0, te);
        (this.size[1] !== r || this.size[0] !== n) && ((o = this.setSize) == null || o.call(this, [n, r]));
      }
    }
  }
  setAllGroups(t) {
    for (const o of this.rows) {
      const r = t === null ? !o.on : t;
      this.applyGroupMode(o, r);
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
    rt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class ne extends mt {
  constructor() {
    super(q), this.modeOff = _;
  }
}
class re extends mt {
  constructor() {
    super(Y), this.modeOff = k;
  }
}
const L = /* @__PURE__ */ new Set();
let M = null;
const rt = {
  register(e) {
    L.add(e), M == null && (M = setInterval(() => {
      for (const t of L)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    L.delete(e), !L.size && M != null && (clearInterval(M), M = null);
  }
}, se = ne, ie = re, st = /* @__PURE__ */ new Set();
function E(e, t) {
  st.has(e) || (st.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function ce() {
  E($, Gt), E(H, Bt), E(dt, $t), E(W, Wt), E(ft, jt), E(ht, Zt), E(q, se), E(Y, ie);
}
function le(e) {
  return (e == null ? void 0 : e.type) === $ || (e == null ? void 0 : e.type) === H;
}
function ae(e) {
  return (e == null ? void 0 : e.type) === q || (e == null ? void 0 : e.type) === Y;
}
class ue {
  constructor(t) {
    this.nodeMap = null, this.totalNodes = 0, this.executedNodeIds = [], this.currentlyExecuting = null, this.errorDetails = null, this.id = t;
  }
  setPrompt(t) {
    const o = (t == null ? void 0 : t.output) ?? t;
    o && typeof o == "object" && (this.nodeMap = o, this.totalNodes = Object.keys(o).length);
  }
  labelFor(t) {
    var s, i, c, a;
    const o = (s = this.nodeMap) == null ? void 0 : s[String(t)], r = ((i = o == null ? void 0 : o._meta) == null ? void 0 : i.title) || (o == null ? void 0 : o.class_type);
    if (r) return r;
    const n = (a = (c = B.graph) == null ? void 0 : c.getNodeById) == null ? void 0 : a.call(c, String(t));
    return (n == null ? void 0 : n.title) || (n == null ? void 0 : n.type);
  }
  executing(t, o, r) {
    var s;
    if (t == null) {
      this.currentlyExecuting = null;
      return;
    }
    const n = String(t);
    ((s = this.currentlyExecuting) == null ? void 0 : s.nodeId) !== n && (this.currentlyExecuting && this.executedNodeIds.push(this.currentlyExecuting.nodeId), this.currentlyExecuting = { nodeId: n, nodeLabel: this.labelFor(t), pass: 0 }), o != null && ((!this.currentlyExecuting.step || o < this.currentlyExecuting.step) && (this.currentlyExecuting.pass += 1), this.currentlyExecuting.step = o, this.currentlyExecuting.maxSteps = r);
  }
  error(t) {
    this.errorDetails = t;
  }
}
class pe extends EventTarget {
  constructor() {
    super(), this.prompts = /* @__PURE__ */ new Map(), this.current = null, this.queueRemaining = 0;
    const t = this, o = b.queuePrompt.bind(b);
    b.queuePrompt = async function(r, n, ...s) {
      let i;
      try {
        i = await o(r, n, ...s);
      } catch (a) {
        const l = t.getOrMake("error");
        throw l.error({ exception_type: "Unknown" }), t.current = l, t.dispatch(), a;
      }
      const c = t.getOrMake((i == null ? void 0 : i.prompt_id) ?? "unknown");
      return c.setPrompt(n), t.current || (t.current = c), t.prompts.set((i == null ? void 0 : i.prompt_id) ?? "unknown", c), t.dispatch(), i;
    }, b.addEventListener("status", (r) => {
      var s, i;
      const n = (i = (s = r.detail) == null ? void 0 : s.exec_info) == null ? void 0 : i.queue_remaining;
      typeof n == "number" && (this.queueRemaining = n, this.dispatch());
    }), b.addEventListener("execution_start", (r) => {
      var n;
      this.current = this.getOrMake(((n = r.detail) == null ? void 0 : n.prompt_id) ?? "unknown"), this.dispatch();
    }), b.addEventListener("executing", (r) => {
      const n = r.detail;
      this.current || (this.current = this.getOrMake((n == null ? void 0 : n.prompt_id) ?? "unknown")), this.current.executing((n == null ? void 0 : n.node) ?? null, n == null ? void 0 : n.value, n == null ? void 0 : n.max), this.dispatch(), (n == null ? void 0 : n.node) == null && (this.current = null);
    }), b.addEventListener("progress", (r) => {
      const n = r.detail;
      this.current || (this.current = this.getOrMake((n == null ? void 0 : n.prompt_id) ?? "unknown")), this.current.executing(n == null ? void 0 : n.node, n == null ? void 0 : n.value, n == null ? void 0 : n.max), this.dispatch();
    }), b.addEventListener("execution_error", (r) => {
      var s;
      const n = r.detail;
      this.current || (this.current = this.getOrMake((n == null ? void 0 : n.prompt_id) ?? "unknown")), (s = this.current) == null || s.error(n), this.dispatch();
    });
  }
  getOrMake(t) {
    let o = this.prompts.get(t);
    return o || (o = new ue(t), this.prompts.set(t, o)), o;
  }
  dispatch() {
    this.dispatchEvent(new CustomEvent("comfort-progress-update", {
      detail: { queue: this.queueRemaining, prompt: this.current }
    }));
  }
}
let D = null;
function de() {
  return D || (D = new pe()), D;
}
let O = null;
function gt() {
  if (O && O.isConnected) return O;
  const e = document.createElement("div");
  e.className = "comfort-progress", e.setAttribute("data-comfort-plugin", "true");
  const t = document.createElement("div");
  t.className = "comfort-progress-bar comfort-progress-nodes";
  const o = document.createElement("div");
  o.className = "comfort-progress-bar comfort-progress-steps";
  const r = document.createElement("span");
  return r.className = "comfort-progress-text", r.textContent = "Idle", e.append(t, o, r), document.body.appendChild(e), O = e, e;
}
function it(e) {
  var i, c, a;
  const t = gt(), o = t.querySelector(".comfort-progress-nodes"), r = t.querySelector(".comfort-progress-bar.comfort-progress-steps"), n = t.querySelector(".comfort-progress-text"), s = e.prompt;
  if (t.classList.remove("comfort-progress-error"), t.classList.toggle("comfort-progress-idle", !s), s != null && s.errorDetails) {
    t.classList.add("comfort-progress-error"), n.textContent = `${((i = s.errorDetails) == null ? void 0 : i.exception_type) || "Error"} ${((c = s.errorDetails) == null ? void 0 : c.node_id) || ""} ${((a = s.errorDetails) == null ? void 0 : a.node_type) || ""}`.trim(), o.style.width = "100%", r.style.width = "0%";
    return;
  }
  if (s != null && s.currentlyExecuting) {
    const l = s.currentlyExecuting;
    let f = `(${e.queue}) `;
    if (!s.totalNodes)
      f += "??%", o.style.width = "0%";
    else {
      const d = s.executedNodeIds.length / s.totalNodes * 100;
      o.style.width = `${Math.max(2, d)}%`, f += `${Math.round(d)}%`;
    }
    let p = "";
    if (l.step != null && l.maxSteps) {
      const d = l.step / l.maxSteps * 100;
      r.style.width = `${d}%`;
      let u = "";
      l.pass > 1 && (u = `#${l.pass} `), p = `${u}${Math.round(d)}%`;
    } else
      r.style.width = "0%";
    (l.nodeLabel || p) && (f += ` - ${l.nodeLabel || "???"}${p ? ` (${p})` : ""}`), n.textContent = f;
  } else
    o.style.width = "0%", r.style.width = "0%", n.textContent = e.queue ? `(${e.queue}) Queued` : "Idle";
}
function fe() {
  if (O) return;
  const e = de();
  gt(), e.addEventListener("comfort-progress-update", (t) => {
    it(t.detail);
  }), it({ queue: 0, prompt: null });
}
const he = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-progress{position:fixed;top:0;left:0;right:0;height:22px;z-index:10000;background:#141414eb;overflow:hidden;font-family:sans-serif;font-size:12px;color:#fff;pointer-events:none;box-sizing:border-box}.comfort-progress .comfort-progress-bar{position:absolute;left:0;top:0;height:50%;width:0%;background:#1e8e5a;transition:width 60ms linear}.comfort-progress .comfort-progress-steps{top:50%;background:#2fae72}.comfort-progress.comfort-progress-error .comfort-progress-bar,.comfort-progress.comfort-progress-error .comfort-progress-steps{background:#b23b3b}.comfort-progress .comfort-progress-text{position:relative;z-index:2;display:flex;align-items:center;height:100%;padding:0 8px;text-shadow:0 0 2px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-progress.comfort-progress-idle .comfort-progress-text{opacity:.5}", V = document.createElement("style");
V.setAttribute("data-comfort-plugin", "true");
V.textContent = he;
document.head.appendChild(V);
ce();
fe();
B.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    Q(e) && Lt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (Q(e)) {
      const t = Ct(e);
      if (t) {
        const o = (r) => {
          t.showSeparate = r, Ot(e);
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
    if (le(e)) {
      const t = (o) => {
        var r;
        return (r = e.setAllRows) == null ? void 0 : r.call(e, o);
      };
      return [
        null,
        { content: "Enable all", callback: () => t(!0) },
        { content: "Disable all", callback: () => t(!1) },
        { content: "Toggle all", callback: () => t(null) }
      ];
    }
    if (ae(e)) {
      const t = (o) => {
        var r;
        return (r = e.setAllGroups) == null ? void 0 : r.call(e, o);
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
  P as NODE_NAME
};
