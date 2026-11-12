import { app as U } from "/scripts/app.js";
import { api as b } from "/scripts/api.js";
const P = "Power Lora Loader (comfort)", T = /* @__PURE__ */ new WeakMap(), Et = 32, _t = 36, Ct = 34, Q = 14, Nt = 380;
function Z(e) {
  var t;
  return (e == null ? void 0 : e.type) === P || (e == null ? void 0 : e.comfyClass) === P || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === P;
}
function vt(e) {
  return T.get(e);
}
function B(e) {
  return Q + Et + e.rows.length * _t + Ct + Q;
}
function N(e, t) {
  var s;
  if (!e.size) return;
  const o = B(t), n = Math.max(e.size[0] || 0, Nt);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function Mt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function at(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function Ot(e) {
  const t = !at(e);
  for (const o of e.rows) o.on = t;
}
function J(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function ut(e, t) {
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
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(r), o.appendChild(s), o;
}
function kt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(ut(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", n.appendChild(r), e.showSeparate ? (n.appendChild(F(t, "one")), n.appendChild(F(t, "two"))) : n.appendChild(F(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = at(e), s = ut(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(z("Model")), r.appendChild(z("Clip"))) : r.appendChild(z("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((a, l) => t.appendChild(kt(e, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function St(e) {
  const t = T.get(e);
  t && (g(t), N(e, t));
}
async function Rt() {
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
  const s = await Rt() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Lt(e, t, o, n) {
  const s = t.rows[o];
  if (!s) return;
  const r = o > 0, i = o < t.rows.length - 1, c = (a) => {
    const l = o + a;
    if (l < 0 || l >= t.rows.length) return;
    const u = t.rows[o];
    t.rows[o] = t.rows[l], t.rows[l] = u, g(t);
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
          t.rows.splice(o, 1), g(t), N(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function Tt(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      Ot(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      X(t, e, n, (l) => {
        t.rows.push(Mt(l)), g(t), N(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const a = !!s.closest(".comfort-strength-clip");
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
      J(c, -1, a), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      J(c, 1, a), g(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), g(t), N(e, t);
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
    s && (n.preventDefault(), n.stopPropagation(), Lt(e, t, Number(s.dataset.idx), n));
  });
}
function At(e) {
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
      t.rows = Array.isArray(o) ? o : [], g(t), N(e, t);
    },
    getMinHeight: () => B(t),
    getMaxHeight: () => B(t)
  })), Tt(e, t), g(t), N(e, t);
}
function Pt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class pt extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Pt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const y = 0, _ = 2, k = 4;
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
function tt(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function dt(e, t, o) {
  var c, a, l, u;
  const n = e.graph;
  if (!n) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (p) => {
    if (!p || r.has(p)) return;
    r.add(p);
    let f;
    t === "OUTPUT" ? f = (p.outputs || []).flatMap((d) => d.links || []) : f = (p.inputs || []).map((d) => d.link);
    for (const d of f) {
      if (d == null) continue;
      const h = n.links[d];
      if (!h) continue;
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, x = n.getNodeById(m);
      !x || r.has(x) || (tt(x) ? i(x) : s.push(x));
    }
  };
  if (o != null) {
    const p = t === "OUTPUT" ? ((a = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : a.links) || [] : [(u = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : u.link];
    for (const f of p) {
      if (f == null) continue;
      const d = n.links[f];
      if (!d) continue;
      const h = t === "OUTPUT" ? d.target_id : d.origin_id, m = n.getNodeById(h);
      !m || r.has(m) || (tt(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function C(e, t) {
  return dt(e, "INPUT", t);
}
function et(e, t) {
  return dt(e, "OUTPUT", t);
}
function $(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function zt(e) {
  var c, a, l, u, p, f, d, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((a = e.pos) == null ? void 0 : a[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((u = e.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of o) {
    const x = ((p = m.pos) == null ? void 0 : p[0]) ?? 0, K = ((f = m.pos) == null ? void 0 : f[1]) ?? 0, xt = ((d = m.size) == null ? void 0 : d[0]) ?? 0, bt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= x && s >= K && n + r <= x + xt && s + i <= K + bt)
      return m;
  }
  return null;
}
class S extends pt {
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
const Ft = 34, It = 10, Dt = 260;
class ft extends S {
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
    const t = It * 2 + this.rows.length * Ft, o = Math.max(this.size[0] || 0, Dt);
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
const H = "Fast Muter (comfort)", W = "Fast Bypasser (comfort)";
class Gt extends ft {
  constructor() {
    super(H), this.modeOn = y, this.modeOff = _;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Bt extends ft {
  constructor() {
    super(W), this.modeOn = y, this.modeOff = k;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Ut = Gt, $t = Bt, ht = "Node Collector (comfort)";
class Ht extends S {
  constructor() {
    super(ht), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const Wt = Ht, q = "Mute / Bypass Repeater (comfort)";
class qt extends S {
  constructor() {
    super(q), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
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
    const n = C(this);
    if (n.length) {
      for (const r of n) w(r, o);
      return;
    }
    const s = zt(this);
    if (s)
      for (const r of $(s))
        r !== this && w(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Yt = qt;
function I(e) {
  return (e == null ? void 0 : e.type) === q;
}
const mt = "Mode Relay (comfort)", Vt = {
  ACTIVE: y,
  MUTE: _,
  BYPASS: k,
  NOTHING: -99
}, jt = {
  [_]: "on_muted_inputs",
  [k]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class Kt extends S {
  constructor() {
    super(mt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
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
    const s = et(this).filter(I);
    for (const r of s)
      r.mode !== o && w(r, o);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, n, s, r) {
    return s ? I(s) : !0;
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
    const n = jt[o], s = n ? Vt[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = et(this).filter(I);
    for (const a of i)
      a.mode !== r && w(a, r);
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
const R = /* @__PURE__ */ new Set();
let v = null;
const ot = {
  register(e) {
    R.add(e), v == null && (v = setInterval(() => {
      for (const t of R)
        try {
          t.evaluate();
        } catch {
        }
    }, 500));
  },
  unregister(e) {
    R.delete(e), !R.size && v != null && (clearInterval(v), v = null);
  }
}, Qt = Kt, gt = "Random Unmuter (comfort)";
class Zt extends S {
  constructor() {
    super(gt), this.tempEnabled = null, this.constructed(), nt.register(this);
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
    if (!t.length || !t.every((s) => s.mode === _)) return;
    const n = t[Math.floor(Math.random() * t.length)];
    n && (w(n, y), this.tempEnabled = n);
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
    nt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const A = /* @__PURE__ */ new Set(), nt = {
  register(e) {
    A.add(e), Jt();
  },
  unregister(e) {
    A.delete(e);
  }
};
let st = !1;
function Jt() {
  if (st) return;
  st = !0;
  const e = U, t = e.queuePrompt;
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
      for (const c of A)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of A)
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
const Xt = Zt, Y = "Fast Groups Muter (comfort)", V = "Fast Groups Bypasser (comfort)", te = 34, ee = 10, oe = 280;
function ne(e) {
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
    var p, f, d, h;
    const c = ((p = r.pos) == null ? void 0 : p[1]) ?? 0, a = ((f = i.pos) == null ? void 0 : f[1]) ?? 0;
    if (c !== a) return c - a;
    const l = ((d = r.pos) == null ? void 0 : d[0]) ?? 0, u = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== u ? l - u : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function se(e) {
  return $(e).some((t) => t.mode === y);
}
class yt extends pt {
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
      const n = t.target.closest(".comfort-node-row");
      if (!n) return;
      const s = this.rows[Number(n.dataset.idx)];
      s && (this.applyGroupMode(s, !s.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(t, o) {
    const n = $(t.group);
    w(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = ne(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: se(i)
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
        const n = ee * 2 + this.rows.length * te, s = Math.max(this.size[0] || 0, oe);
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
    rt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class re extends yt {
  constructor() {
    super(Y), this.modeOff = _;
  }
}
class ie extends yt {
  constructor() {
    super(V), this.modeOff = k;
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
}, ce = re, le = ie, it = /* @__PURE__ */ new Set();
function E(e, t) {
  it.has(e) || (it.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function ae() {
  E(H, Ut), E(W, $t), E(ht, Wt), E(q, Yt), E(mt, Qt), E(gt, Xt), E(Y, ce), E(V, le);
}
function ue(e) {
  return (e == null ? void 0 : e.type) === H || (e == null ? void 0 : e.type) === W;
}
function pe(e) {
  return (e == null ? void 0 : e.type) === Y || (e == null ? void 0 : e.type) === V;
}
class de {
  constructor(t) {
    this.nodeMap = null, this.totalNodes = 0, this.executedNodeIds = [], this.currentlyExecuting = null, this.errorDetails = null, this.id = t;
  }
  setPrompt(t) {
    const o = (t == null ? void 0 : t.output) ?? t;
    o && typeof o == "object" && (this.nodeMap = o, this.totalNodes = Object.keys(o).length);
  }
  labelFor(t) {
    var r, i, c, a;
    const o = (r = this.nodeMap) == null ? void 0 : r[String(t)], n = ((i = o == null ? void 0 : o._meta) == null ? void 0 : i.title) || (o == null ? void 0 : o.class_type);
    if (n) return n;
    const s = (a = (c = U.graph) == null ? void 0 : c.getNodeById) == null ? void 0 : a.call(c, String(t));
    return (s == null ? void 0 : s.title) || (s == null ? void 0 : s.type);
  }
  // `executing` event: the payload is the raw node id (string), or null when the
  // run finishes. A change of node closes out the previous one.
  setExecuting(t) {
    var n;
    if (t == null) {
      this.currentlyExecuting && this.executedNodeIds.push(this.currentlyExecuting.nodeId), this.currentlyExecuting = null;
      return;
    }
    const o = String(t);
    ((n = this.currentlyExecuting) == null ? void 0 : n.nodeId) !== o && (this.currentlyExecuting && this.executedNodeIds.push(this.currentlyExecuting.nodeId), this.currentlyExecuting = { nodeId: o, nodeLabel: this.labelFor(t), pass: 0 });
  }
  // `progress` event: step/max for the currently-executing node (the node id is
  // implied by the preceding `executing` event and not re-sent).
  setStep(t, o) {
    const n = this.currentlyExecuting;
    !n || t == null || ((!n.step || t < n.step) && (n.pass += 1), n.step = t, n.maxSteps = o);
  }
  error(t) {
    this.errorDetails = t;
  }
}
class fe extends EventTarget {
  constructor() {
    super(), this.prompts = /* @__PURE__ */ new Map(), this.current = null, this.queueRemaining = 0;
    const t = this, o = b.queuePrompt.bind(b);
    b.queuePrompt = async function(n, s, ...r) {
      let i;
      try {
        i = await o(n, s, ...r);
      } catch (a) {
        const l = t.getOrMake("error");
        throw l.error({ exception_type: "Unknown" }), t.current = l, t.dispatch(), a;
      }
      const c = t.getOrMake((i == null ? void 0 : i.prompt_id) ?? "unknown");
      return c.setPrompt(s), t.current || (t.current = c), t.prompts.set((i == null ? void 0 : i.prompt_id) ?? "unknown", c), t.dispatch(), i;
    }, b.addEventListener("status", (n) => {
      var r, i;
      const s = (i = (r = n.detail) == null ? void 0 : r.exec_info) == null ? void 0 : i.queue_remaining;
      typeof s == "number" && (this.queueRemaining = s, this.dispatch());
    }), b.addEventListener("execution_start", (n) => {
      var s;
      this.current = this.getOrMake(((s = n.detail) == null ? void 0 : s.prompt_id) ?? "unknown"), this.dispatch();
    }), b.addEventListener("executing", (n) => {
      this.current || (this.current = this.getOrMake("unknown")), this.current.setExecuting(n.detail), this.dispatch(), n.detail == null && (this.current = null);
    }), b.addEventListener("progress", (n) => {
      const s = n.detail;
      this.current || (this.current = this.getOrMake((s == null ? void 0 : s.prompt_id) ?? "unknown")), this.current.setStep(s == null ? void 0 : s.value, s == null ? void 0 : s.max), this.dispatch();
    }), b.addEventListener("execution_error", (n) => {
      var r;
      const s = n.detail;
      this.current || (this.current = this.getOrMake((s == null ? void 0 : s.prompt_id) ?? "unknown")), (r = this.current) == null || r.error(s), this.dispatch();
    });
  }
  getOrMake(t) {
    let o = this.prompts.get(t);
    return o || (o = new de(t), this.prompts.set(t, o)), o;
  }
  dispatch() {
    this.dispatchEvent(new CustomEvent("comfort-progress-update", {
      detail: { queue: this.queueRemaining, prompt: this.current }
    }));
  }
}
let D = null;
function he() {
  return D || (D = new fe()), D;
}
let O = null;
function wt() {
  if (O && O.isConnected) return O;
  const e = document.createElement("div");
  e.className = "comfort-progress", e.setAttribute("data-comfort-plugin", "true");
  const t = document.createElement("div");
  t.className = "comfort-progress-bar comfort-progress-nodes";
  const o = document.createElement("div");
  o.className = "comfort-progress-bar comfort-progress-steps";
  const n = document.createElement("span");
  return n.className = "comfort-progress-text", n.textContent = "Idle", e.append(t, o, n), document.body.appendChild(e), O = e, e;
}
function G(e) {
  var i, c, a;
  const t = wt(), o = t.querySelector(".comfort-progress-nodes"), n = t.querySelector(".comfort-progress-bar.comfort-progress-steps"), s = t.querySelector(".comfort-progress-text"), r = e.prompt;
  if (t.classList.remove("comfort-progress-error"), t.classList.toggle("comfort-progress-idle", !r), r != null && r.errorDetails) {
    t.classList.add("comfort-progress-error"), s.textContent = `${((i = r.errorDetails) == null ? void 0 : i.exception_type) || "Error"} ${((c = r.errorDetails) == null ? void 0 : c.node_id) || ""} ${((a = r.errorDetails) == null ? void 0 : a.node_type) || ""}`.trim(), o.style.width = "100%", n.style.width = "0%";
    return;
  }
  if (r != null && r.currentlyExecuting) {
    const l = r.currentlyExecuting;
    let u = `(${e.queue}) `;
    if (!r.totalNodes)
      u += "??%", o.style.width = "0%";
    else {
      const f = r.executedNodeIds.length / r.totalNodes * 100;
      o.style.width = `${Math.max(2, f)}%`, u += `${Math.round(f)}%`;
    }
    let p = "";
    if (l.step != null && l.maxSteps) {
      const f = l.step / l.maxSteps * 100;
      n.style.width = `${f}%`;
      let d = "";
      l.pass > 1 && (d = `#${l.pass} `), p = `${d}${Math.round(f)}%`;
    } else
      n.style.width = "0%";
    (l.nodeLabel || p) && (u += ` - ${l.nodeLabel || "???"}${p ? ` (${p})` : ""}`), s.textContent = u;
  } else
    o.style.width = "0%", n.style.width = "0%", s.textContent = e.queue ? `(${e.queue}) Queued` : "Idle";
}
function me() {
  if (O) return;
  const e = he();
  wt(), e.addEventListener("comfort-progress-update", (t) => {
    G(t.detail);
  }), G({ queue: 0, prompt: null }), window.__comfortProgress = { render: (t) => G(t) };
}
const ge = 10, ye = /[/\\]/, ct = "__comfort_original";
function we(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const l of e) {
    if (l == null) {
      s.push(l);
      continue;
    }
    const u = String(l), p = u.indexOf("/") > -1 ? "/" : "\\", f = u.indexOf(p);
    if (f > -1) {
      const d = u.slice(0, f), h = u.slice(f + 1);
      n.has(d) || n.set(d, []), n.get(d).push({ full: u, sub: h });
    } else
      s.push(l);
  }
  const r = (l, u) => ({
    content: u,
    [ct]: l,
    callback: (p) => o == null ? void 0 : o(p[ct])
  }), i = [], c = [...n.keys()].sort((l, u) => l.localeCompare(u));
  for (const l of c) {
    const u = n.get(l).map((p) => r(p.full, p.sub));
    i.push({
      content: `📁 ${l}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: u }
    });
  }
  for (const l of s)
    typeof l == "string" ? i.push(r(l, l)) : i.push(l);
  const a = Object.assign({}, t);
  return a.callback = void 0, { values: i, options: a };
}
function lt(e, t) {
  return !Array.isArray(e) || e.length < ge ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && ye.test(o)) ? we(e, t) : { values: e, options: t } : { values: e, options: t };
}
function xe() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = lt(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = lt(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const be = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-progress{position:fixed;top:0;left:0;right:0;height:22px;z-index:10000;background:#141414eb;overflow:hidden;font-family:sans-serif;font-size:12px;color:#fff;pointer-events:none;box-sizing:border-box}.comfort-progress .comfort-progress-bar{position:absolute;left:0;top:0;height:50%;width:0%;background:#1e8e5a;transition:width 60ms linear}.comfort-progress .comfort-progress-steps{top:50%;background:#2fae72}.comfort-progress.comfort-progress-error .comfort-progress-bar,.comfort-progress.comfort-progress-error .comfort-progress-steps{background:#b23b3b}.comfort-progress .comfort-progress-text{position:relative;z-index:2;display:flex;align-items:center;height:100%;padding:0 8px;text-shadow:0 0 2px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-progress.comfort-progress-idle .comfort-progress-text{opacity:.5}", j = document.createElement("style");
j.setAttribute("data-comfort-plugin", "true");
j.textContent = be;
document.head.appendChild(j);
ae();
me();
xe();
U.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    Z(e) && At(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (Z(e)) {
      const t = vt(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, St(e);
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
    if (ue(e)) {
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
    if (pe(e)) {
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
  P as NODE_NAME
};
