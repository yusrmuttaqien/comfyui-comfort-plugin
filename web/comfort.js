import { app as C } from "/scripts/app.js";
import { api as E } from "/scripts/api.js";
const z = "Power Lora Loader (comfort)", D = /* @__PURE__ */ new WeakMap(), Ot = 32, kt = 36, St = 34, J = 14, Rt = 380;
function tt(e) {
  var t;
  return (e == null ? void 0 : e.type) === z || (e == null ? void 0 : e.comfyClass) === z || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === z;
}
function Lt(e) {
  return D.get(e);
}
function W(e) {
  return J + Ot + e.rows.length * kt + St + J;
}
function O(e, t) {
  var s;
  if (!e.size) return;
  const o = W(t), n = Math.max(e.size[0] || 0, Rt);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function Tt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function ht(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function At(e) {
  const t = !ht(e);
  for (const o of e.rows) o.on = t;
}
function et(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function mt(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function G(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function B(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(r), o.appendChild(s), o;
}
function Pt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(mt(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", n.appendChild(r), e.showSeparate ? (n.appendChild(B(t, "one")), n.appendChild(B(t, "two"))) : n.appendChild(B(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = ht(e), s = mt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(G("Model")), r.appendChild(G("Clip"))) : r.appendChild(G("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((a, l) => t.appendChild(Pt(e, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function It(e) {
  const t = D.get(e);
  t && (g(t), O(e, t));
}
async function Dt() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function ot(e, t, o, n) {
  const s = await Dt() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function Ft(e, t, o, n) {
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
          t.rows.splice(o, 1), g(t), O(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function zt(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      At(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      ot(t, e, n, (l) => {
        t.rows.push(Tt(l)), g(t), O(e, t);
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
      ot(t, e, n, (l) => {
        c.lora = l, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      et(c, -1, a), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      et(c, 1, a), g(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), g(t), O(e, t);
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
    s && (n.preventDefault(), n.stopPropagation(), Ft(e, t, Number(s.dataset.idx), n));
  });
}
function Gt(e) {
  if (D.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", D.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], g(t), O(e, t);
    },
    getMinHeight: () => W(t),
    getMaxHeight: () => W(t)
  })), zt(e, t), g(t), O(e, t);
}
function Bt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class gt extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Bt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const y = 0, b = 2, M = 4;
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
function nt(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function yt(e, t, o) {
  var c, a, l, u;
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
      !x || r.has(x) || (nt(x) ? i(x) : s.push(x));
    }
  };
  if (o != null) {
    const d = t === "OUTPUT" ? ((a = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : a.links) || [] : [(u = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : u.link];
    for (const p of d) {
      if (p == null) continue;
      const f = n.links[p];
      if (!f) continue;
      const h = t === "OUTPUT" ? f.target_id : f.origin_id, m = n.getNodeById(h);
      !m || r.has(m) || (nt(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function N(e, t) {
  return yt(e, "INPUT", t);
}
function st(e, t) {
  return yt(e, "OUTPUT", t);
}
function L(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function Ht(e) {
  var c, a, l, u, d, p, f, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((a = e.pos) == null ? void 0 : a[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((u = e.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of o) {
    const x = ((d = m.pos) == null ? void 0 : d[0]) ?? 0, X = ((p = m.pos) == null ? void 0 : p[1]) ?? 0, Nt = ((f = m.size) == null ? void 0 : f[0]) ?? 0, Mt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= x && s >= X && n + r <= x + Nt && s + i <= X + Mt)
      return m;
  }
  return null;
}
class T extends gt {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, n, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(N(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const s = N(this, o)[0], r = (s == null ? void 0 : s.title) || "";
        n.name !== r && (n.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const Ut = 34, $t = 10, Wt = 260;
class wt extends T {
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
    const t = $t * 2 + this.rows.length * Ut, o = Math.max(this.size[0] || 0, Wt);
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
    const t = N(this), o = [];
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
const Y = "Fast Muter (comfort)", j = "Fast Bypasser (comfort)";
class qt extends wt {
  constructor() {
    super(Y), this.modeOn = y, this.modeOff = b;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Yt extends wt {
  constructor() {
    super(j), this.modeOn = y, this.modeOff = M;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const jt = qt, Vt = Yt, bt = "Node Collector (comfort)";
class Kt extends T {
  constructor() {
    super(bt), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const Qt = Kt, V = "Mute / Bypass Repeater (comfort)";
class Zt extends T {
  constructor() {
    super(V), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
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
    const n = N(this);
    if (n.length) {
      for (const r of n) w(r, o);
      return;
    }
    const s = Ht(this);
    if (s)
      for (const r of L(s))
        r !== this && w(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Xt = Zt;
function H(e) {
  return (e == null ? void 0 : e.type) === V;
}
const xt = "Mode Relay (comfort)", Jt = {
  ACTIVE: y,
  MUTE: b,
  BYPASS: M,
  NOTHING: -99
}, te = {
  [b]: "on_muted_inputs",
  [M]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class ee extends T {
  constructor() {
    super(xt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), this.constructed(), rt.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, o) {
    if (super.onModeChange(t, o), this.configuring || N(this).length) return;
    const s = st(this).filter(H);
    for (const r of s)
      r.mode !== o && w(r, o);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, n, s, r) {
    return s ? H(s) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = N(this);
    let o;
    for (const a of t) {
      const l = a.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === b || l === M)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = te[o], s = n ? Jt[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = st(this).filter(H);
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
    rt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const A = /* @__PURE__ */ new Set();
let k = null;
const rt = {
  register(e) {
    A.add(e), k == null && (k = setInterval(() => {
      for (const t of A)
        try {
          t.evaluate();
        } catch {
        }
    }, 500));
  },
  unregister(e) {
    A.delete(e), !A.size && k != null && (clearInterval(k), k = null);
  }
}, oe = ee, Et = "Random Unmuter (comfort)";
class ne extends T {
  constructor() {
    super(Et), this.tempEnabled = null, this.constructed(), it.register(this);
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
    const t = N(this);
    if (!t.length || !t.every((s) => s.mode === b)) return;
    const n = t[Math.floor(Math.random() * t.length)];
    n && (w(n, y), this.tempEnabled = n);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (w(this.tempEnabled, b), this.tempEnabled = null);
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
    it.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const F = /* @__PURE__ */ new Set(), it = {
  register(e) {
    F.add(e), se();
  },
  unregister(e) {
    F.delete(e);
  }
};
let ct = !1;
function se() {
  if (ct) return;
  ct = !0;
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
      for (const c of F)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of F)
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
const re = ne, K = "Fast Groups Muter (comfort)", Q = "Fast Groups Bypasser (comfort)", ie = 34, ce = 10, le = 280;
function ae(e) {
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
    const c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0, a = ((p = i.pos) == null ? void 0 : p[1]) ?? 0;
    if (c !== a) return c - a;
    const l = ((f = r.pos) == null ? void 0 : f[0]) ?? 0, u = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== u ? l - u : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function ue(e) {
  return L(e).some((t) => t.mode === y);
}
class _t extends gt {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), lt.register(this), this.constructed();
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
    const n = L(t.group);
    w(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = ae(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: ue(i)
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
        const n = ce * 2 + this.rows.length * ie, s = Math.max(this.size[0] || 0, le);
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
    lt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class de extends _t {
  constructor() {
    super(K), this.modeOff = b;
  }
}
class pe extends _t {
  constructor() {
    super(Q), this.modeOff = M;
  }
}
const P = /* @__PURE__ */ new Set();
let S = null;
const lt = {
  register(e) {
    P.add(e), S == null && (S = setInterval(() => {
      for (const t of P)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    P.delete(e), !P.size && S != null && (clearInterval(S), S = null);
  }
}, fe = de, he = pe, at = /* @__PURE__ */ new Set();
function _(e, t) {
  at.has(e) || (at.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function me() {
  _(Y, jt), _(j, Vt), _(bt, Qt), _(V, Xt), _(xt, oe), _(Et, re), _(K, fe), _(Q, he);
}
function ge(e) {
  return (e == null ? void 0 : e.type) === Y || (e == null ? void 0 : e.type) === j;
}
function ye(e) {
  return (e == null ? void 0 : e.type) === K || (e == null ? void 0 : e.type) === Q;
}
class we {
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
    const s = (a = (c = C.graph) == null ? void 0 : c.getNodeById) == null ? void 0 : a.call(c, String(t));
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
class be extends EventTarget {
  constructor() {
    super(), this.prompts = /* @__PURE__ */ new Map(), this.current = null, this.queueRemaining = 0;
    const t = this, o = E.queuePrompt.bind(E);
    E.queuePrompt = async function(n, s, ...r) {
      let i;
      try {
        i = await o(n, s, ...r);
      } catch (a) {
        const l = t.getOrMake("error");
        throw l.error({ exception_type: "Unknown" }), t.current = l, t.dispatch(), a;
      }
      const c = t.getOrMake((i == null ? void 0 : i.prompt_id) ?? "unknown");
      return c.setPrompt(s), t.current || (t.current = c), t.prompts.set((i == null ? void 0 : i.prompt_id) ?? "unknown", c), t.dispatch(), i;
    }, E.addEventListener("status", (n) => {
      var r, i;
      const s = (i = (r = n.detail) == null ? void 0 : r.exec_info) == null ? void 0 : i.queue_remaining;
      typeof s == "number" && (this.queueRemaining = s, this.dispatch());
    }), E.addEventListener("execution_start", (n) => {
      var s;
      this.current = this.getOrMake(((s = n.detail) == null ? void 0 : s.prompt_id) ?? "unknown"), this.dispatch();
    }), E.addEventListener("executing", (n) => {
      this.current || (this.current = this.getOrMake("unknown")), this.current.setExecuting(n.detail), this.dispatch(), n.detail == null && (this.current = null);
    }), E.addEventListener("progress", (n) => {
      const s = n.detail;
      this.current || (this.current = this.getOrMake((s == null ? void 0 : s.prompt_id) ?? "unknown")), this.current.setStep(s == null ? void 0 : s.value, s == null ? void 0 : s.max), this.dispatch();
    }), E.addEventListener("execution_error", (n) => {
      var r;
      const s = n.detail;
      this.current || (this.current = this.getOrMake((s == null ? void 0 : s.prompt_id) ?? "unknown")), (r = this.current) == null || r.error(s), this.dispatch();
    });
  }
  getOrMake(t) {
    let o = this.prompts.get(t);
    return o || (o = new we(t), this.prompts.set(t, o)), o;
  }
  dispatch() {
    this.dispatchEvent(new CustomEvent("comfort-progress-update", {
      detail: { queue: this.queueRemaining, prompt: this.current }
    }));
  }
}
let U = null;
function xe() {
  return U || (U = new be()), U;
}
let R = null;
function vt() {
  if (R && R.isConnected) return R;
  const e = document.createElement("div");
  e.className = "comfort-progress", e.setAttribute("data-comfort-plugin", "true");
  const t = document.createElement("div");
  t.className = "comfort-progress-bar comfort-progress-nodes";
  const o = document.createElement("div");
  o.className = "comfort-progress-bar comfort-progress-steps";
  const n = document.createElement("span");
  return n.className = "comfort-progress-text", n.textContent = "Idle", e.append(t, o, n), document.body.appendChild(e), R = e, e;
}
function $(e) {
  var i, c, a;
  const t = vt(), o = t.querySelector(".comfort-progress-nodes"), n = t.querySelector(".comfort-progress-bar.comfort-progress-steps"), s = t.querySelector(".comfort-progress-text"), r = e.prompt;
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
      const p = r.executedNodeIds.length / r.totalNodes * 100;
      o.style.width = `${Math.max(2, p)}%`, u += `${Math.round(p)}%`;
    }
    let d = "";
    if (l.step != null && l.maxSteps) {
      const p = l.step / l.maxSteps * 100;
      n.style.width = `${p}%`;
      let f = "";
      l.pass > 1 && (f = `#${l.pass} `), d = `${f}${Math.round(p)}%`;
    } else
      n.style.width = "0%";
    (l.nodeLabel || d) && (u += ` - ${l.nodeLabel || "???"}${d ? ` (${d})` : ""}`), s.textContent = u;
  } else
    o.style.width = "0%", n.style.width = "0%", s.textContent = e.queue ? `(${e.queue}) Queued` : "Idle";
}
function Ee() {
  if (R) return;
  const e = xe();
  vt(), e.addEventListener("comfort-progress-update", (t) => {
    $(t.detail);
  }), $({ queue: 0, prompt: null }), window.__comfortProgress = { render: (t) => $(t) };
}
const _e = 10, ve = /[/\\]/, ut = "__comfort_original";
function Ce(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const l of e) {
    if (l == null) {
      s.push(l);
      continue;
    }
    const u = String(l), d = u.indexOf("/") > -1 ? "/" : "\\", p = u.indexOf(d);
    if (p > -1) {
      const f = u.slice(0, p), h = u.slice(p + 1);
      n.has(f) || n.set(f, []), n.get(f).push({ full: u, sub: h });
    } else
      s.push(l);
  }
  const r = (l, u) => ({
    content: u,
    [ut]: l,
    callback: (d) => o == null ? void 0 : o(d[ut])
  }), i = [], c = [...n.keys()].sort((l, u) => l.localeCompare(u));
  for (const l of c) {
    const u = n.get(l).map((d) => r(d.full, d.sub));
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
function dt(e, t) {
  return !Array.isArray(e) || e.length < _e ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && ve.test(o)) ? Ce(e, t) : { values: e, options: t } : { values: e, options: t };
}
function Ne() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = dt(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = dt(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const v = 20, pt = 6, Me = 6;
function Ct(e) {
  var i, c, a;
  const t = ((i = e.pos) == null ? void 0 : i[0]) ?? 0, o = ((c = e.pos) == null ? void 0 : c[1]) ?? 0, n = ((a = e.size) == null ? void 0 : a[0]) ?? 0, s = t + n - pt - v, r = o + pt;
  return {
    mute: { x: s - Me - v, y: r },
    bypass: { x: s, y: r }
  };
}
function I(e, t, o) {
  return e >= o.x && e <= o.x + v && t >= o.y && t <= o.y + v;
}
function q(e) {
  const t = L(e);
  let o = t.length > 0, n = t.length > 0;
  for (const s of t)
    o = o && s.mode === b, n = n && s.mode === M;
  return { allMuted: o, allBypassed: n };
}
function Oe(e, t) {
  var i, c, a;
  (i = e.recomputeInsideNodes) == null || i.call(e);
  const o = L(e);
  if ((c = window.__comfortToggleDebug) == null || c.call(window, {
    id: t,
    nodesLen: o.length,
    state: q(e)
  }), !o.length) return;
  const { allMuted: n, allBypassed: s } = q(e);
  let r;
  t === "mute" ? r = n ? y : b : r = s ? y : M, (a = window.__comfortToggleDebug) == null || a.call(window, { applying: r }), w(o, r), C.canvas.setDirty(!0, !0);
}
function ke(e) {
  const t = C.canvas, o = t == null ? void 0 : t.graph;
  if (!o) return;
  const n = o._groups || [];
  if (!n.length) return;
  const s = t.mouse, r = s ? o.getGroupOnPos(s[0], s[1]) : null, i = t.selected_group;
  for (const c of n) {
    if (!(r === c) && !(i === c)) continue;
    const { mute: u, bypass: d } = Ct(c), p = q(c);
    ft(e, u, "M", p.allMuted, "#d98c8c"), ft(e, d, "B", p.allBypassed, "#d9c98c");
  }
}
function ft(e, t, o, n, s) {
  e.save(), e.beginPath(), e.rect(t.x, t.y, v, v), e.fillStyle = n ? s : "rgba(30,30,30,0.72)", e.fill(), e.lineWidth = 1, e.strokeStyle = n ? s : "rgba(255,255,255,0.35)", e.stroke(), e.fillStyle = n ? "#181818" : "#f2f2f2", e.font = "bold 13px sans-serif", e.textAlign = "center", e.textBaseline = "middle", e.fillText(o, t.x + v / 2, t.y + v / 2), e.restore();
}
function Se(e) {
  const t = window.__comfortPDDebug, o = (d) => {
    Array.isArray(t) && t.push(d);
  }, n = C.canvas, s = n == null ? void 0 : n.graph;
  if (!s) {
    o("no-graph");
    return;
  }
  const r = n.canvas;
  if (!r || !(e.target instanceof Element) || !r.contains(e.target)) {
    o("not-canvas");
    return;
  }
  if (e.button !== 0) {
    o("bad-button");
    return;
  }
  n.adjustMouseEvent(e);
  const i = e.canvasX, c = e.canvasY, a = s.getGroupOnPos(i, c);
  if (!a) {
    o("no-group@" + i + "," + c);
    return;
  }
  const { mute: l, bypass: u } = Ct(a);
  if (!I(i, c, l) && !I(i, c, u)) {
    o("no-hit@" + i + "," + c);
    return;
  }
  o("hit " + (I(i, c, l) ? "mute" : "bypass")), e.preventDefault(), e.stopPropagation(), Oe(a, I(i, c, l) ? "mute" : "bypass");
}
function Re() {
  const e = C.canvas, t = e.onDrawForeground;
  e.onDrawForeground = function(o, ...n) {
    t == null || t.call(this, o, ...n);
    try {
      ke(o);
    } catch (s) {
      console.warn("[comfort] group toggles draw failed", s);
    }
  }, document.addEventListener("pointermove", Le, { passive: !0 }), document.addEventListener("pointerdown", Se, !0);
}
function Le(e) {
  const t = C.canvas;
  if (t != null && t.canvas && !(!(e.target instanceof Element) || !t.canvas.contains(e.target))) {
    try {
      t.adjustMouseEvent(e);
    } catch {
      return;
    }
    t.setDirty(!0, !0);
  }
}
const Te = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-progress{position:fixed;top:0;left:0;right:0;height:22px;z-index:10000;background:#141414eb;overflow:hidden;font-family:sans-serif;font-size:12px;color:#fff;pointer-events:none;box-sizing:border-box}.comfort-progress .comfort-progress-bar{position:absolute;left:0;top:0;height:50%;width:0%;background:#1e8e5a;transition:width 60ms linear}.comfort-progress .comfort-progress-steps{top:50%;background:#2fae72}.comfort-progress.comfort-progress-error .comfort-progress-bar,.comfort-progress.comfort-progress-error .comfort-progress-steps{background:#b23b3b}.comfort-progress .comfort-progress-text{position:relative;z-index:2;display:flex;align-items:center;height:100%;padding:0 8px;text-shadow:0 0 2px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-progress.comfort-progress-idle .comfort-progress-text{opacity:.5}", Z = document.createElement("style");
Z.setAttribute("data-comfort-plugin", "true");
Z.textContent = Te;
document.head.appendChild(Z);
me();
Ee();
Ne();
Re();
C.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    tt(e) && Gt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (tt(e)) {
      const t = Lt(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, It(e);
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
    if (ge(e)) {
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
    if (ye(e)) {
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
