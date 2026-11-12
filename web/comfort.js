import { app as C } from "/scripts/app.js";
const F = "Power Lora Loader (comfort)", A = /* @__PURE__ */ new WeakMap(), Nt = 32, Ot = 36, Mt = 34, K = 14, Rt = 380;
function q(e) {
  var t;
  return (e == null ? void 0 : e.type) === F || (e == null ? void 0 : e.comfyClass) === F || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === F;
}
function kt(e) {
  return A.get(e);
}
function U(e) {
  return K + Nt + e.rows.length * Ot + Mt + K;
}
function v(e, t) {
  var s;
  if (!e.size) return;
  const o = U(t), n = Math.max(e.size[0] || 0, Rt);
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
function St(e) {
  const t = !ht(e);
  for (const o of e.rows) o.on = t;
}
function Z(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function mt(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function I(e) {
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
function At(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(mt(t.on, t.on ? "ON" : "OFF"));
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
  const n = ht(e), s = mt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(I("Model")), r.appendChild(I("Clip"))) : r.appendChild(I("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((d, l) => t.appendChild(At(e, d, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Lt(e) {
  const t = A.get(e);
  t && (g(t), v(e, t));
}
async function Pt() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function Q(e, t, o, n) {
  const s = await Pt() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function zt(e, t, o, n) {
  const s = t.rows[o];
  if (!s) return;
  const r = o > 0, i = o < t.rows.length - 1, c = (d) => {
    const l = o + d;
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
          t.rows.splice(o, 1), g(t), v(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function Ft(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const s = n.target;
    if (s.closest(".comfort-toggle-all")) {
      St(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      Q(t, e, n, (l) => {
        t.rows.push(Tt(l)), g(t), v(e, t);
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
      Q(t, e, n, (l) => {
        c.lora = l, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      Z(c, -1, d), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      Z(c, 1, d), g(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), g(t), v(e, t);
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
    s && (n.preventDefault(), n.stopPropagation(), zt(e, t, Number(s.dataset.idx), n));
  });
}
function It(e) {
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
      t.rows = Array.isArray(o) ? o : [], g(t), v(e, t);
    },
    getMinHeight: () => U(t),
    getMaxHeight: () => U(t)
  })), Ft(e, t), g(t), v(e, t);
}
function Dt(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class gt extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Dt(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const y = 0, E = 2, R = 4;
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
function X(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function yt(e, t, o) {
  var c, d, l, a;
  const n = e.graph;
  if (!n) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (u) => {
    if (!u || r.has(u)) return;
    r.add(u);
    let f;
    t === "OUTPUT" ? f = (u.outputs || []).flatMap((p) => p.links || []) : f = (u.inputs || []).map((p) => p.link);
    for (const p of f) {
      if (p == null) continue;
      const h = n.links[p];
      if (!h) continue;
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, w = n.getNodeById(m);
      !w || r.has(w) || (X(w) ? i(w) : s.push(w));
    }
  };
  if (o != null) {
    const u = t === "OUTPUT" ? ((d = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : d.links) || [] : [(a = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : a.link];
    for (const f of u) {
      if (f == null) continue;
      const p = n.links[f];
      if (!p) continue;
      const h = t === "OUTPUT" ? p.target_id : p.origin_id, m = n.getNodeById(h);
      !m || r.has(m) || (X(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function _(e, t) {
  return yt(e, "INPUT", t);
}
function J(e, t) {
  return yt(e, "OUTPUT", t);
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
function Gt(e) {
  var c, d, l, a, u, f, p, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((d = e.pos) == null ? void 0 : d[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((a = e.size) == null ? void 0 : a[1]) ?? 0;
  for (const m of o) {
    const w = ((u = m.pos) == null ? void 0 : u[0]) ?? 0, j = ((f = m.pos) == null ? void 0 : f[1]) ?? 0, Ct = ((p = m.size) == null ? void 0 : p[0]) ?? 0, vt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= w && s >= j && n + r <= w + Ct && s + i <= j + vt)
      return m;
  }
  return null;
}
class k extends gt {
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
const Ut = 34, Bt = 10, Ht = 260;
class bt extends k {
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
    const t = Bt * 2 + this.rows.length * Ut, o = Math.max(this.size[0] || 0, Ht);
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
const B = "Fast Muter (comfort)", H = "Fast Bypasser (comfort)";
class Wt extends bt {
  constructor() {
    super(B), this.modeOn = y, this.modeOff = E;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class $t extends bt {
  constructor() {
    super(H), this.modeOn = y, this.modeOff = R;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Vt = Wt, Yt = $t, wt = "Node Collector (comfort)";
class jt extends k {
  constructor() {
    super(wt), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const Kt = jt, W = "Mute / Bypass Repeater (comfort)";
class qt extends k {
  constructor() {
    super(W), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
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
    const n = _(this);
    if (n.length) {
      for (const r of n) b(r, o);
      return;
    }
    const s = Gt(this);
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
const Zt = qt;
function G(e) {
  return (e == null ? void 0 : e.type) === W;
}
const xt = "Mode Relay (comfort)", Qt = {
  ACTIVE: y,
  MUTE: E,
  BYPASS: R,
  NOTHING: -99
}, Xt = {
  [E]: "on_muted_inputs",
  [R]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class Jt extends k {
  constructor() {
    super(xt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), this.constructed(), tt.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, o) {
    if (super.onModeChange(t, o), this.configuring || _(this).length) return;
    const s = J(this).filter(G);
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
    const t = _(this);
    let o;
    for (const d of t) {
      const l = d.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === E || l === R)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = Xt[o], s = n ? Qt[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = J(this).filter(G);
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
    tt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const T = /* @__PURE__ */ new Set();
let N = null;
const tt = {
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
}, te = Jt, Et = "Random Unmuter (comfort)";
class ee extends k {
  constructor() {
    super(Et), this.tempEnabled = null, this.constructed(), et.register(this);
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
    n && (b(n, y), this.tempEnabled = n);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (b(this.tempEnabled, E), this.tempEnabled = null);
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
    et.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const L = /* @__PURE__ */ new Set(), et = {
  register(e) {
    L.add(e), oe();
  },
  unregister(e) {
    L.delete(e);
  }
};
let ot = !1;
function oe() {
  if (ot) return;
  ot = !0;
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
const ne = ee, $ = "Fast Groups Muter (comfort)", V = "Fast Groups Bypasser (comfort)", se = 34, re = 10, ie = 280;
function ce(e) {
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
    var u, f, p, h;
    const c = ((u = r.pos) == null ? void 0 : u[1]) ?? 0, d = ((f = i.pos) == null ? void 0 : f[1]) ?? 0;
    if (c !== d) return c - d;
    const l = ((p = r.pos) == null ? void 0 : p[0]) ?? 0, a = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== a ? l - a : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function le(e) {
  return z(e).some((t) => t.mode === y);
}
class _t extends gt {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), nt.register(this), this.constructed();
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
    const t = ce(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: le(i)
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
        const n = re * 2 + this.rows.length * se, s = Math.max(this.size[0] || 0, ie);
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
    nt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class ae extends _t {
  constructor() {
    super($), this.modeOff = E;
  }
}
class ue extends _t {
  constructor() {
    super(V), this.modeOff = R;
  }
}
const S = /* @__PURE__ */ new Set();
let O = null;
const nt = {
  register(e) {
    S.add(e), O == null && (O = setInterval(() => {
      for (const t of S)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    S.delete(e), !S.size && O != null && (clearInterval(O), O = null);
  }
}, de = ae, pe = ue, st = /* @__PURE__ */ new Set();
function x(e, t) {
  st.has(e) || (st.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function fe() {
  x(B, Vt), x(H, Yt), x(wt, Kt), x(W, Zt), x(xt, te), x(Et, ne), x($, de), x(V, pe);
}
function he(e) {
  return (e == null ? void 0 : e.type) === B || (e == null ? void 0 : e.type) === H;
}
function me(e) {
  return (e == null ? void 0 : e.type) === $ || (e == null ? void 0 : e.type) === V;
}
const ge = 10, ye = /[/\\]/, rt = "__comfort_original";
function be(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const l of e) {
    if (l == null) {
      s.push(l);
      continue;
    }
    const a = String(l), u = a.indexOf("/") > -1 ? "/" : "\\", f = a.indexOf(u);
    if (f > -1) {
      const p = a.slice(0, f), h = a.slice(f + 1);
      n.has(p) || n.set(p, []), n.get(p).push({ full: a, sub: h });
    } else
      s.push(l);
  }
  const r = (l, a) => ({
    content: a,
    [rt]: l,
    callback: (u) => o == null ? void 0 : o(u[rt])
  }), i = [], c = [...n.keys()].sort((l, a) => l.localeCompare(a));
  for (const l of c) {
    const a = n.get(l).map((u) => r(u.full, u.sub));
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
  const d = Object.assign({}, t);
  return d.callback = void 0, { values: i, options: d };
}
function it(e, t) {
  return !Array.isArray(e) || e.length < ge ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && ye.test(o)) ? be(e, t) : { values: e, options: t } : { values: e, options: t };
}
function we() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = it(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = it(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const M = 20, ct = 6, xe = 6, lt = 0, at = 2, ut = 4;
let P = /* @__PURE__ */ new Map();
function dt(e, t) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + t, o.textContent = e, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Ee(e) {
  let t = P.get(e);
  if (t) return t;
  const o = dt("M", "comfort-btn-mute"), n = dt("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), ft(e, "mute");
  }), n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), ft(e, "bypass");
  }), t = { group: e, mute: o, byp: n }, P.set(e, t), document.body.appendChild(o), document.body.appendChild(n), t;
}
function pt(e, t, o, n) {
  e.style.left = `${t}px`, e.style.top = `${o}px`, e.style.width = `${M * n}px`, e.style.height = `${M * n}px`, e.style.fontSize = `${Math.max(9, M * n * 0.5)}px`;
}
function _e(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function Ce() {
  const e = C.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const n = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (a) => n.left + (a + r[0]) * s, c = (a) => n.top + (a + r[1]) * s, d = t._groups || [], l = /* @__PURE__ */ new Set();
  for (const a of d)
    (e.selected_group === a || _e(a, e.mouse)) && l.add(a);
  for (const a of l) {
    const u = Ee(a), f = a.pos[0] + a.size[0] - ct - M, p = a.pos[1] + ct;
    pt(u.mute, i(f - xe - M), c(p), s), pt(u.byp, i(f), c(p), s), u.mute.style.display = "block", u.byp.style.display = "block";
  }
  for (const [a, u] of P)
    l.has(a) || (u.mute.style.display = "none", u.byp.style.display = "none"), d.includes(a) || (u.mute.remove(), u.byp.remove(), P.delete(a));
}
function ft(e, t) {
  var d;
  const o = z(e);
  if (!o.length) return;
  const n = o.every((l) => l.mode === at), s = o.every((l) => l.mode === ut), r = C.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const l = n ? lt : at;
      o.forEach((a) => a.mode = l);
    } else {
      const l = s ? lt : ut;
      o.forEach((a) => a.mode = l);
    }
  } catch (l) {
    console.warn("[comfort] group toggle failed", l);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = C.canvas;
  (d = c == null ? void 0 : c.setDirty) == null || d.call(c, !0, !0);
}
function ve() {
  const e = C.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(o, ...n) {
    t == null || t.call(this, o, ...n);
    try {
      Ce();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const Ne = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}", Y = document.createElement("style");
Y.setAttribute("data-comfort-plugin", "true");
Y.textContent = Ne;
document.head.appendChild(Y);
fe();
we();
C.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    ve();
  },
  nodeCreated(e) {
    q(e) && It(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (q(e)) {
      const t = kt(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, Lt(e);
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
    if (he(e)) {
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
    if (me(e)) {
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
