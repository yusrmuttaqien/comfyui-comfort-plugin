import { app as et } from "/scripts/app.js";
const T = "Power Lora Loader (comfort)", k = /* @__PURE__ */ new WeakMap(), ft = 32, ht = 36, mt = 34, Y = 14, gt = 380;
function V(e) {
  var t;
  return (e == null ? void 0 : e.type) === T || (e == null ? void 0 : e.comfyClass) === T || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === T;
}
function wt(e) {
  return k.get(e);
}
function F(e) {
  return Y + ft + e.rows.length * ht + mt + Y;
}
function C(e, t) {
  var s;
  if (!e.size) return;
  const o = F(t), n = Math.max(e.size[0] || 0, gt);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function yt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function ot(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function bt(e) {
  const t = !ot(e);
  for (const o of e.rows) o.on = t;
}
function $(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function nt(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function A(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function P(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(r), o.appendChild(s), o;
}
function xt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(nt(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", n.appendChild(r), e.showSeparate ? (n.appendChild(P(t, "one")), n.appendChild(P(t, "two"))) : n.appendChild(P(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function f(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = ot(e), s = nt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(A("Model")), r.appendChild(A("Clip"))) : r.appendChild(A("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((a, l) => t.appendChild(xt(e, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Et(e) {
  const t = k.get(e);
  t && (f(t), C(e, t));
}
async function Ct() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function j(e, t, o, n) {
  const s = await Ct() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function _t(e, t, o, n) {
  const s = t.rows[o];
  if (!s) return;
  const r = o > 0, i = o < t.rows.length - 1, c = (a) => {
    const l = o + a;
    if (l < 0 || l >= t.rows.length) return;
    const m = t.rows[o];
    t.rows[o] = t.rows[l], t.rows[l] = m, f(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${s.on ? "⚫" : "◯"} Toggle ${s.on ? "Off" : "On"}`,
        callback: () => {
          s.on = !s.on, f(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !r, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(o, 1), f(t), C(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function Nt(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      bt(t), f(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      j(t, e, n, (l) => {
        t.rows.push(yt(l)), f(t), C(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const a = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, f(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      j(t, e, n, (l) => {
        c.lora = l, f(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      $(c, -1, a), f(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      $(c, 1, a), f(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), f(t), C(e, t);
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
    s && (n.preventDefault(), n.stopPropagation(), _t(e, t, Number(s.dataset.idx), n));
  });
}
function vt(e) {
  if (k.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", k.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], f(t), C(e, t);
    },
    getMinHeight: () => F(t),
    getMaxHeight: () => F(t)
  })), Nt(e, t), f(t), C(e, t);
}
function Mt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class st extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.modeListeners = /* @__PURE__ */ new Set(), this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Mt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
  /** Register a mode-change listener. Returns an unsubscribe function. */
  addModeListener(t) {
    return this.modeListeners.add(t), () => this.removeModeListener(t);
  }
  removeModeListener(t) {
    this.modeListeners.delete(t);
  }
  configure(t) {
    this.configuring = !0, super.configure(t), this.configuring = !1;
  }
  /** Called after the subclass finishes setting up slots/widgets. */
  onModeChange(t, o) {
    for (const n of this.modeListeners)
      try {
        n(t, o);
      } catch {
      }
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
const g = 0, E = 2, M = 4;
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
function q(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function rt(e, t, o) {
  var c, a, l, m;
  const n = e.graph;
  if (!n) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (d) => {
    if (!d || r.has(d)) return;
    r.add(d);
    let h;
    t === "OUTPUT" ? h = (d.outputs || []).flatMap((u) => u.links || []) : h = (d.inputs || []).map((u) => u.link);
    for (const u of h) {
      if (u == null) continue;
      const y = n.links[u];
      if (!y) continue;
      const p = t === "OUTPUT" ? y.target_id : y.origin_id, b = n.getNodeById(p);
      !b || r.has(b) || (q(b) ? i(b) : s.push(b));
    }
  };
  if (o != null) {
    const d = t === "OUTPUT" ? ((a = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : a.links) || [] : [(m = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : m.link];
    for (const h of d) {
      if (h == null) continue;
      const u = n.links[h];
      if (!u) continue;
      const y = t === "OUTPUT" ? u.target_id : u.origin_id, p = n.getNodeById(y);
      !p || r.has(p) || (q(p) ? i(p) : s.push(p));
    }
  } else
    i(e);
  return s;
}
function _(e, t) {
  return rt(e, "INPUT", t);
}
function Ot(e, t) {
  return rt(e, "OUTPUT", t);
}
function z(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function Rt(e) {
  var c, a, l, m, d, h, u, y;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((a = e.pos) == null ? void 0 : a[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((m = e.size) == null ? void 0 : m[1]) ?? 0;
  for (const p of o) {
    const b = ((d = p.pos) == null ? void 0 : d[0]) ?? 0, B = ((h = p.pos) == null ? void 0 : h[1]) ?? 0, dt = ((u = p.size) == null ? void 0 : u[0]) ?? 0, pt = ((y = p.size) == null ? void 0 : y[1]) ?? 0;
    if (n >= b && s >= B && n + r <= b + dt && s + i <= B + pt)
      return p;
  }
  return null;
}
class O extends st {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, n, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(_(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const s = _(this, o)[0], r = (s == null ? void 0 : s.title) || "";
        n.name !== r && (n.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const Lt = 34, kt = 10, St = 260;
class it extends O {
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
    const t = kt * 2 + this.rows.length * Lt, o = Math.max(this.size[0] || 0, St);
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
    const t = _(this), o = [];
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
const I = "Fast Muter (comfort)", D = "Fast Bypasser (comfort)";
class Tt extends it {
  constructor() {
    super(I), this.modeOn = g, this.modeOff = E;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class At extends it {
  constructor() {
    super(D), this.modeOn = g, this.modeOff = M;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Pt = Tt, Ft = At, ct = "Node Collector (comfort)";
class zt extends O {
  constructor() {
    super(ct), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const It = zt, G = "Mute / Bypass Repeater (comfort)";
class Dt extends O {
  constructor() {
    super(G), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
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
    const n = _(this);
    if (n.length) {
      for (const r of n) w(r, o);
      return;
    }
    const s = Rt(this);
    if (s)
      for (const r of z(s))
        r !== this && w(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Gt = Dt;
function K(e) {
  return (e == null ? void 0 : e.type) === G;
}
const lt = "Mode Relay (comfort)", Ut = {
  ACTIVE: g,
  MUTE: E,
  BYPASS: M,
  NOTHING: -99
}, Ht = {
  [E]: "on_muted_inputs",
  [M]: "on_bypassed_inputs",
  [g]: "on_any_active_inputs"
};
class Wt extends O {
  constructor() {
    super(lt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), this.constructed(), Z.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, n, s, r) {
    return s ? K(s) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = _(this);
    let o;
    for (const a of t) {
      const l = a.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === E || l === M)) continue;
        l === g || o === g ? o = g : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = Ht[o], s = n ? Ut[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = Ot(this).filter(K);
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
    Z.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const R = /* @__PURE__ */ new Set();
let N = null;
const Z = {
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
}, Bt = Wt, at = "Random Unmuter (comfort)";
class Yt extends O {
  constructor() {
    super(at), this.tempEnabled = null, this.constructed(), Q.register(this);
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
    const t = _(this);
    if (!t.length || !t.every((s) => s.mode === E)) return;
    const n = t[Math.floor(Math.random() * t.length)];
    n && (w(n, g), this.tempEnabled = n);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (w(this.tempEnabled, E), this.tempEnabled = null);
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
    Q.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const S = /* @__PURE__ */ new Set(), Q = {
  register(e) {
    S.add(e), Vt();
  },
  unregister(e) {
    S.delete(e);
  }
};
let J = !1;
function Vt() {
  if (J) return;
  J = !0;
  const e = et, t = e.queuePrompt;
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
      for (const c of S)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of S)
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
const $t = Yt, U = "Fast Groups Muter (comfort)", H = "Fast Groups Bypasser (comfort)", jt = 34, qt = 10, Kt = 280;
function Zt(e) {
  const t = e.graph;
  if (!t) return [];
  const o = [], n = (s) => {
    var r;
    for (const i of s._groups || s.groups || []) o.push(i);
    for (const i of s._subgraphs || []) n(i);
    for (const i of s._nodes || [])
      (r = i.subgraph) != null && r._groups && n(i.subgraph);
  };
  return n(t), o.sort((s, r) => {
    var m, d, h, u;
    const i = ((m = s.pos) == null ? void 0 : m[1]) ?? 0, c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0;
    if (i !== c) return i - c;
    const a = ((h = s.pos) == null ? void 0 : h[0]) ?? 0, l = ((u = r.pos) == null ? void 0 : u[0]) ?? 0;
    return a !== l ? a - l : String(s.title || "").localeCompare(String(r.title || ""));
  }), o;
}
function Qt(e) {
  return z(e).some((t) => t.mode === g);
}
class ut extends st {
  constructor(t) {
    super(t), this.modeOn = g, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), X.register(this), this.constructed();
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
    w(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Zt(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: Qt(i)
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
        const n = qt * 2 + this.rows.length * jt, s = Math.max(this.size[0] || 0, Kt);
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
    X.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class Jt extends ut {
  constructor() {
    super(U), this.modeOff = E;
  }
}
class Xt extends ut {
  constructor() {
    super(H), this.modeOff = M;
  }
}
const L = /* @__PURE__ */ new Set();
let v = null;
const X = {
  register(e) {
    L.add(e), v == null && (v = setInterval(() => {
      for (const t of L)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    L.delete(e), !L.size && v != null && (clearInterval(v), v = null);
  }
}, te = Jt, ee = Xt, tt = /* @__PURE__ */ new Set();
function x(e, t) {
  tt.has(e) || (tt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function oe() {
  x(I, Pt), x(D, Ft), x(ct, It), x(G, Gt), x(lt, Bt), x(at, $t), x(U, te), x(H, ee);
}
function ne(e) {
  return (e == null ? void 0 : e.type) === I || (e == null ? void 0 : e.type) === D;
}
function se(e) {
  return (e == null ? void 0 : e.type) === U || (e == null ? void 0 : e.type) === H;
}
const re = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}", W = document.createElement("style");
W.setAttribute("data-comfort-plugin", "true");
W.textContent = re;
document.head.appendChild(W);
oe();
et.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    V(e) && vt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (V(e)) {
      const t = wt(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, Et(e);
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
    if (ne(e)) {
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
    if (se(e)) {
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
  T as NODE_NAME
};
