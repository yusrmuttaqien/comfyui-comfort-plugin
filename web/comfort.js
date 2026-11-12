import { app as _ } from "/scripts/app.js";
import { api as x } from "/scripts/api.js";
const F = "Power Lora Loader (comfort)", P = /* @__PURE__ */ new WeakMap(), Rt = 32, Lt = 36, Tt = 34, X = 14, At = 380;
function J(e) {
  var t;
  return (e == null ? void 0 : e.type) === F || (e == null ? void 0 : e.comfyClass) === F || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === F;
}
function Pt(e) {
  return P.get(e);
}
function W(e) {
  return X + Rt + e.rows.length * Lt + Tt + X;
}
function N(e, t) {
  var s;
  if (!e.size) return;
  const o = W(t), n = Math.max(e.size[0] || 0, At);
  (e.size[1] !== o || e.size[0] !== n) && ((s = e.setSize) == null || s.call(e, [n, o]));
}
function zt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function bt(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function It(e) {
  const t = !bt(e);
  for (const o of e.rows) o.on = t;
}
function tt(e, t, o) {
  const n = o ? "strengthTwo" : "strength", s = e[n] ?? 1;
  e[n] = Math.round((s + t * 0.05) * 100) / 100;
}
function wt(e, t) {
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
function Dt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(wt(t.on, t.on ? "ON" : "OFF"));
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
  const n = bt(e), s = wt(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(G("Model")), r.appendChild(G("Clip"))) : r.appendChild(G("Strength")), o.appendChild(r), t.appendChild(o), e.rows.forEach((u, l) => t.appendChild(Dt(e, u, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Ft(e) {
  const t = P.get(e);
  t && (g(t), N(e, t));
}
async function Gt() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function et(e, t, o, n) {
  const s = await Gt() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
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
          t.rows.splice(o, 1), g(t), N(e, t);
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
      It(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      et(t, e, n, (l) => {
        t.rows.push(zt(l)), g(t), N(e, t);
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
      et(t, e, n, (l) => {
        c.lora = l, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      tt(c, -1, u), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      tt(c, 1, u), g(t);
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
    s && (n.preventDefault(), n.stopPropagation(), Bt(e, t, Number(s.dataset.idx), n));
  });
}
function Ut(e) {
  if (P.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", P.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], g(t), N(e, t);
    },
    getMinHeight: () => W(t),
    getMaxHeight: () => W(t)
  })), $t(e, t), g(t), N(e, t);
}
function Ht(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class xt extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = Ht(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const y = 0, v = 2, R = 4;
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
function ot(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function Et(e, t, o) {
  var c, u, l, a;
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
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, w = n.getNodeById(m);
      !w || r.has(w) || (ot(w) ? i(w) : s.push(w));
    }
  };
  if (o != null) {
    const p = t === "OUTPUT" ? ((u = (c = e.outputs) == null ? void 0 : c[o]) == null ? void 0 : u.links) || [] : [(a = (l = e.inputs) == null ? void 0 : l[o]) == null ? void 0 : a.link];
    for (const f of p) {
      if (f == null) continue;
      const d = n.links[f];
      if (!d) continue;
      const h = t === "OUTPUT" ? d.target_id : d.origin_id, m = n.getNodeById(h);
      !m || r.has(m) || (ot(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function C(e, t) {
  return Et(e, "INPUT", t);
}
function nt(e, t) {
  return Et(e, "OUTPUT", t);
}
function D(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function Wt(e) {
  var c, u, l, a, p, f, d, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((u = e.pos) == null ? void 0 : u[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((a = e.size) == null ? void 0 : a[1]) ?? 0;
  for (const m of o) {
    const w = ((p = m.pos) == null ? void 0 : p[0]) ?? 0, Z = ((f = m.pos) == null ? void 0 : f[1]) ?? 0, kt = ((d = m.size) == null ? void 0 : d[0]) ?? 0, St = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= w && s >= Z && n + r <= w + kt && s + i <= Z + St)
      return m;
  }
  return null;
}
class L extends xt {
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
const qt = 34, Yt = 10, Vt = 260;
class _t extends L {
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
    const t = Yt * 2 + this.rows.length * qt, o = Math.max(this.size[0] || 0, Vt);
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
const q = "Fast Muter (comfort)", Y = "Fast Bypasser (comfort)";
class jt extends _t {
  constructor() {
    super(q), this.modeOn = y, this.modeOff = v;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Kt extends _t {
  constructor() {
    super(Y), this.modeOn = y, this.modeOff = R;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const Qt = jt, Zt = Kt, vt = "Node Collector (comfort)";
class Xt extends L {
  constructor() {
    super(vt), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const Jt = Xt, V = "Mute / Bypass Repeater (comfort)";
class te extends L {
  constructor() {
    super(V), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
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
    const s = Wt(this);
    if (s)
      for (const r of D(s))
        r !== this && b(r, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ee = te;
function $(e) {
  return (e == null ? void 0 : e.type) === V;
}
const Ct = "Mode Relay (comfort)", oe = {
  ACTIVE: y,
  MUTE: v,
  BYPASS: R,
  NOTHING: -99
}, ne = {
  [v]: "on_muted_inputs",
  [R]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class se extends L {
  constructor() {
    super(Ct), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), this.constructed(), st.register(this);
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
    const s = nt(this).filter($);
    for (const r of s)
      r.mode !== o && b(r, o);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, o, n, s, r) {
    return s ? $(s) : !0;
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
        if (o === l && (l === v || l === R)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = ne[o], s = n ? oe[String((c = this.properties) == null ? void 0 : c[n])] : o, r = s !== void 0 ? s : o;
    if (r === -99) return;
    const i = nt(this).filter($);
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
    st.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const T = /* @__PURE__ */ new Set();
let M = null;
const st = {
  register(e) {
    T.add(e), M == null && (M = setInterval(() => {
      for (const t of T)
        try {
          t.evaluate();
        } catch {
        }
    }, 500));
  },
  unregister(e) {
    T.delete(e), !T.size && M != null && (clearInterval(M), M = null);
  }
}, re = se, Nt = "Random Unmuter (comfort)";
class ie extends L {
  constructor() {
    super(Nt), this.tempEnabled = null, this.constructed(), rt.register(this);
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
    rt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const z = /* @__PURE__ */ new Set(), rt = {
  register(e) {
    z.add(e), ce();
  },
  unregister(e) {
    z.delete(e);
  }
};
let it = !1;
function ce() {
  if (it) return;
  it = !0;
  const e = _, t = e.queuePrompt;
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
      for (const c of z)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = n.apply(e, s), i = () => {
      for (const c of z)
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
const le = ie, j = "Fast Groups Muter (comfort)", K = "Fast Groups Bypasser (comfort)", ae = 34, ue = 10, pe = 280;
function de(e) {
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
    const c = ((p = r.pos) == null ? void 0 : p[1]) ?? 0, u = ((f = i.pos) == null ? void 0 : f[1]) ?? 0;
    if (c !== u) return c - u;
    const l = ((d = r.pos) == null ? void 0 : d[0]) ?? 0, a = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== a ? l - a : String(r.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function fe(e) {
  return D(e).some((t) => t.mode === y);
}
class Mt extends xt {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), ct.register(this), this.constructed();
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
    const n = D(t.group);
    b(n, o ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = de(this), o = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let n = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: fe(i)
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
        const n = ue * 2 + this.rows.length * ae, s = Math.max(this.size[0] || 0, pe);
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
    ct.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class he extends Mt {
  constructor() {
    super(j), this.modeOff = v;
  }
}
class me extends Mt {
  constructor() {
    super(K), this.modeOff = R;
  }
}
const A = /* @__PURE__ */ new Set();
let O = null;
const ct = {
  register(e) {
    A.add(e), O == null && (O = setInterval(() => {
      for (const t of A)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    A.delete(e), !A.size && O != null && (clearInterval(O), O = null);
  }
}, ge = he, ye = me, lt = /* @__PURE__ */ new Set();
function E(e, t) {
  lt.has(e) || (lt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function be() {
  E(q, Qt), E(Y, Zt), E(vt, Jt), E(V, ee), E(Ct, re), E(Nt, le), E(j, ge), E(K, ye);
}
function we(e) {
  return (e == null ? void 0 : e.type) === q || (e == null ? void 0 : e.type) === Y;
}
function xe(e) {
  return (e == null ? void 0 : e.type) === j || (e == null ? void 0 : e.type) === K;
}
class Ee {
  constructor(t) {
    this.nodeMap = null, this.totalNodes = 0, this.executedNodeIds = [], this.currentlyExecuting = null, this.errorDetails = null, this.id = t;
  }
  setPrompt(t) {
    const o = (t == null ? void 0 : t.output) ?? t;
    o && typeof o == "object" && (this.nodeMap = o, this.totalNodes = Object.keys(o).length);
  }
  labelFor(t) {
    var r, i, c, u;
    const o = (r = this.nodeMap) == null ? void 0 : r[String(t)], n = ((i = o == null ? void 0 : o._meta) == null ? void 0 : i.title) || (o == null ? void 0 : o.class_type);
    if (n) return n;
    const s = (u = (c = _.graph) == null ? void 0 : c.getNodeById) == null ? void 0 : u.call(c, String(t));
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
class _e extends EventTarget {
  constructor() {
    super(), this.prompts = /* @__PURE__ */ new Map(), this.current = null, this.queueRemaining = 0;
    const t = this, o = x.queuePrompt.bind(x);
    x.queuePrompt = async function(n, s, ...r) {
      let i;
      try {
        i = await o(n, s, ...r);
      } catch (u) {
        const l = t.getOrMake("error");
        throw l.error({ exception_type: "Unknown" }), t.current = l, t.dispatch(), u;
      }
      const c = t.getOrMake((i == null ? void 0 : i.prompt_id) ?? "unknown");
      return c.setPrompt(s), t.current || (t.current = c), t.prompts.set((i == null ? void 0 : i.prompt_id) ?? "unknown", c), t.dispatch(), i;
    }, x.addEventListener("status", (n) => {
      var r, i;
      const s = (i = (r = n.detail) == null ? void 0 : r.exec_info) == null ? void 0 : i.queue_remaining;
      typeof s == "number" && (this.queueRemaining = s, this.dispatch());
    }), x.addEventListener("execution_start", (n) => {
      var s;
      this.current = this.getOrMake(((s = n.detail) == null ? void 0 : s.prompt_id) ?? "unknown"), this.dispatch();
    }), x.addEventListener("executing", (n) => {
      this.current || (this.current = this.getOrMake("unknown")), this.current.setExecuting(n.detail), this.dispatch(), n.detail == null && (this.current = null);
    }), x.addEventListener("progress", (n) => {
      const s = n.detail;
      this.current || (this.current = this.getOrMake((s == null ? void 0 : s.prompt_id) ?? "unknown")), this.current.setStep(s == null ? void 0 : s.value, s == null ? void 0 : s.max), this.dispatch();
    }), x.addEventListener("execution_error", (n) => {
      var r;
      const s = n.detail;
      this.current || (this.current = this.getOrMake((s == null ? void 0 : s.prompt_id) ?? "unknown")), (r = this.current) == null || r.error(s), this.dispatch();
    });
  }
  getOrMake(t) {
    let o = this.prompts.get(t);
    return o || (o = new Ee(t), this.prompts.set(t, o)), o;
  }
  dispatch() {
    this.dispatchEvent(new CustomEvent("comfort-progress-update", {
      detail: { queue: this.queueRemaining, prompt: this.current }
    }));
  }
}
let U = null;
function ve() {
  return U || (U = new _e()), U;
}
let k = null;
function Ot() {
  if (k && k.isConnected) return k;
  const e = document.createElement("div");
  e.className = "comfort-progress", e.setAttribute("data-comfort-plugin", "true");
  const t = document.createElement("div");
  t.className = "comfort-progress-bar comfort-progress-nodes";
  const o = document.createElement("div");
  o.className = "comfort-progress-bar comfort-progress-steps";
  const n = document.createElement("span");
  return n.className = "comfort-progress-text", n.textContent = "Idle", e.append(t, o, n), document.body.appendChild(e), k = e, e;
}
function H(e) {
  var i, c, u;
  const t = Ot(), o = t.querySelector(".comfort-progress-nodes"), n = t.querySelector(".comfort-progress-bar.comfort-progress-steps"), s = t.querySelector(".comfort-progress-text"), r = e.prompt;
  if (t.classList.remove("comfort-progress-error"), t.classList.toggle("comfort-progress-idle", !r), r != null && r.errorDetails) {
    t.classList.add("comfort-progress-error"), s.textContent = `${((i = r.errorDetails) == null ? void 0 : i.exception_type) || "Error"} ${((c = r.errorDetails) == null ? void 0 : c.node_id) || ""} ${((u = r.errorDetails) == null ? void 0 : u.node_type) || ""}`.trim(), o.style.width = "100%", n.style.width = "0%";
    return;
  }
  if (r != null && r.currentlyExecuting) {
    const l = r.currentlyExecuting;
    let a = `(${e.queue}) `;
    if (!r.totalNodes)
      a += "??%", o.style.width = "0%";
    else {
      const f = r.executedNodeIds.length / r.totalNodes * 100;
      o.style.width = `${Math.max(2, f)}%`, a += `${Math.round(f)}%`;
    }
    let p = "";
    if (l.step != null && l.maxSteps) {
      const f = l.step / l.maxSteps * 100;
      n.style.width = `${f}%`;
      let d = "";
      l.pass > 1 && (d = `#${l.pass} `), p = `${d}${Math.round(f)}%`;
    } else
      n.style.width = "0%";
    (l.nodeLabel || p) && (a += ` - ${l.nodeLabel || "???"}${p ? ` (${p})` : ""}`), s.textContent = a;
  } else
    o.style.width = "0%", n.style.width = "0%", s.textContent = e.queue ? `(${e.queue}) Queued` : "Idle";
}
function Ce() {
  if (k) return;
  const e = ve();
  Ot(), e.addEventListener("comfort-progress-update", (t) => {
    H(t.detail);
  }), H({ queue: 0, prompt: null }), window.__comfortProgress = { render: (t) => H(t) };
}
const Ne = 10, Me = /[/\\]/, at = "__comfort_original";
function Oe(e, t) {
  const o = t == null ? void 0 : t.callback, n = /* @__PURE__ */ new Map(), s = [];
  for (const l of e) {
    if (l == null) {
      s.push(l);
      continue;
    }
    const a = String(l), p = a.indexOf("/") > -1 ? "/" : "\\", f = a.indexOf(p);
    if (f > -1) {
      const d = a.slice(0, f), h = a.slice(f + 1);
      n.has(d) || n.set(d, []), n.get(d).push({ full: a, sub: h });
    } else
      s.push(l);
  }
  const r = (l, a) => ({
    content: a,
    [at]: l,
    callback: (p) => o == null ? void 0 : o(p[at])
  }), i = [], c = [...n.keys()].sort((l, a) => l.localeCompare(a));
  for (const l of c) {
    const a = n.get(l).map((p) => r(p.full, p.sub));
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
function ut(e, t) {
  return !Array.isArray(e) || e.length < Ne ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((o) => o == null || typeof o == "string") ? e.some((o) => typeof o == "string" && Me.test(o)) ? Oe(e, t) : { values: e, options: t } : { values: e, options: t };
}
function ke() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(o, n, s) {
      const [r, i] = n, c = ut(r, i);
      return Reflect.construct(o, [c.values, c.options], s);
    },
    apply(o, n, s) {
      const [r, i] = s, c = ut(r, i);
      return o.call(n, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const S = 20, pt = 6, Se = 6, dt = 0, ft = 2, ht = 4;
let I = /* @__PURE__ */ new Map();
function mt(e, t) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + t, o.textContent = e, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Re(e) {
  let t = I.get(e);
  if (t) return t;
  const o = mt("M", "comfort-btn-mute"), n = mt("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), yt(e, "mute");
  }), n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), yt(e, "bypass");
  }), t = { group: e, mute: o, byp: n }, I.set(e, t), document.body.appendChild(o), document.body.appendChild(n), t;
}
function gt(e, t, o, n) {
  e.style.left = `${t}px`, e.style.top = `${o}px`, e.style.width = `${S * n}px`, e.style.height = `${S * n}px`, e.style.fontSize = `${Math.max(9, S * n * 0.5)}px`;
}
function Le(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function Te() {
  const e = _.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const n = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (a) => n.left + (a + r[0]) * s, c = (a) => n.top + (a + r[1]) * s, u = t._groups || [], l = /* @__PURE__ */ new Set();
  for (const a of u)
    (e.selected_group === a || Le(a, e.mouse)) && l.add(a);
  for (const a of l) {
    const p = Re(a), f = a.pos[0] + a.size[0] - pt - S, d = a.pos[1] + pt;
    gt(p.mute, i(f - Se - S), c(d), s), gt(p.byp, i(f), c(d), s), p.mute.style.display = "block", p.byp.style.display = "block";
  }
  for (const [a, p] of I)
    l.has(a) || (p.mute.style.display = "none", p.byp.style.display = "none"), u.includes(a) || (p.mute.remove(), p.byp.remove(), I.delete(a));
}
function yt(e, t) {
  var u;
  const o = D(e);
  if (!o.length) return;
  const n = o.every((l) => l.mode === ft), s = o.every((l) => l.mode === ht), r = _.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const l = n ? dt : ft;
      o.forEach((a) => a.mode = l);
    } else {
      const l = s ? dt : ht;
      o.forEach((a) => a.mode = l);
    }
  } catch (l) {
    console.warn("[comfort] group toggle failed", l);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = _.canvas;
  (u = c == null ? void 0 : c.setDirty) == null || u.call(c, !0, !0);
}
function Ae() {
  const e = _.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(o, ...n) {
    t == null || t.call(this, o, ...n);
    try {
      Te();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const Pe = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-progress{position:fixed;top:0;left:0;right:0;height:22px;z-index:10000;background:#141414eb;overflow:hidden;font-family:sans-serif;font-size:12px;color:#fff;pointer-events:none;box-sizing:border-box}.comfort-progress .comfort-progress-bar{position:absolute;left:0;top:0;height:50%;width:0%;background:#1e8e5a;transition:width 60ms linear}.comfort-progress .comfort-progress-steps{top:50%;background:#2fae72}.comfort-progress.comfort-progress-error .comfort-progress-bar,.comfort-progress.comfort-progress-error .comfort-progress-steps{background:#b23b3b}.comfort-progress .comfort-progress-text{position:relative;z-index:2;display:flex;align-items:center;height:100%;padding:0 8px;text-shadow:0 0 2px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-progress.comfort-progress-idle .comfort-progress-text{opacity:.5}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}", Q = document.createElement("style");
Q.setAttribute("data-comfort-plugin", "true");
Q.textContent = Pe;
document.head.appendChild(Q);
be();
Ce();
ke();
_.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    Ae();
  },
  nodeCreated(e) {
    J(e) && Ut(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (J(e)) {
      const t = Pt(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, Ft(e);
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
    if (we(e)) {
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
    if (xe(e)) {
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
