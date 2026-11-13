import { app as b } from "/scripts/app.js";
const U = "Power Lora Loader (comfort)", z = /* @__PURE__ */ new WeakMap(), Vt = 32, qt = 36, Kt = 34, et = 14, Jt = 380;
function nt(e) {
  var t;
  return (e == null ? void 0 : e.type) === U || (e == null ? void 0 : e.comfyClass) === U || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === U;
}
function Zt(e) {
  return z.get(e);
}
function j(e) {
  return et + Vt + e.rows.length * qt + Kt + et;
}
function M(e, t) {
  var s;
  if (!e.size) return;
  const n = j(t), o = Math.max(e.size[0] || 0, Jt);
  (e.size[1] !== n || e.size[0] !== o) && ((s = e.setSize) == null || s.call(e, [o, n]));
}
function Qt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function At(e) {
  let t = !0, n = !0;
  for (const o of e.rows)
    if (t = t && o.on === !0, n = n && o.on === !1, !t && !n) return null;
  return !!(t && e.rows.length > 0);
}
function Xt(e) {
  const t = !At(e);
  for (const n of e.rows) n.on = t;
}
function ot(e, t, n) {
  const o = n ? "strengthTwo" : "strength", s = e[o] ?? 1;
  e[o] = Math.round((s + t * 0.05) * 100) / 100;
}
function Ot(e, t) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (e ? "on" : "off"), n.textContent = t, n;
}
function G(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function H(e, t) {
  const n = document.createElement("div");
  n.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-dec", o.textContent = "−", o.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", n.appendChild(o), n.appendChild(r), n.appendChild(s), n;
}
function te(e, t, n) {
  const o = document.createElement("div");
  o.className = "comfort-lora-row" + (t.on ? "" : " off"), o.dataset.idx = String(n), o.appendChild(Ot(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", o.appendChild(r), e.showSeparate ? (o.appendChild(H(t, "one")), o.appendChild(H(t, "two"))) : o.appendChild(H(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", o.appendChild(i), o;
}
function g(e) {
  const t = e.el;
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const o = At(e), s = Ot(o !== !1, o === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(G("Model")), r.appendChild(G("Clip"))) : r.appendChild(G("Strength")), n.appendChild(r), t.appendChild(n), e.rows.forEach((u, a) => t.appendChild(te(e, u, a)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function ee(e) {
  const t = z.get(e);
  t && (g(t), M(e, t));
}
async function ne() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function st(e, t, n, o) {
  const s = await ne() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: n,
    callback: (i) => {
      i !== "(no loras found)" && o(i);
    }
  });
}
function oe(e, t, n, o) {
  const s = t.rows[n];
  if (!s) return;
  const r = n > 0, i = n < t.rows.length - 1, c = (u) => {
    const a = n + u;
    if (a < 0 || a >= t.rows.length) return;
    const l = t.rows[n];
    t.rows[n] = t.rows[a], t.rows[a] = l, g(t);
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
          t.rows.splice(n, 1), g(t), M(e, t);
        }
      }
    ],
    { title: "LORA", event: o }
  );
}
function se(e, t) {
  const n = t.el;
  n.addEventListener("click", (o) => {
    const s = o.target;
    if (s.closest(".comfort-toggle-all")) {
      Xt(t), g(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      st(t, e, o, (a) => {
        t.rows.push(Qt(a)), g(t), M(e, t);
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
      st(t, e, o, (a) => {
        c.lora = a, g(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      ot(c, -1, u), g(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      ot(c, 1, u), g(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), g(t), M(e, t);
      return;
    }
  }), n.addEventListener("change", (o) => {
    const s = o.target, r = s.closest(".comfort-lora-row");
    if (!r || !s.matches("input[type='number']")) return;
    const i = t.rows[Number(r.dataset.idx)];
    if (!i) return;
    const c = parseFloat(s.value);
    Number.isFinite(c) && (s.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), n.addEventListener("contextmenu", (o) => {
    const s = o.target.closest(".comfort-lora-row");
    s && (o.preventDefault(), o.stopPropagation(), oe(e, t, Number(s.dataset.idx), o));
  });
}
function re(e) {
  if (z.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  t.el.className = "comfort-lora-list", z.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (n) => {
      t.rows = Array.isArray(n) ? n : [], g(t), M(e, t);
    },
    getMinHeight: () => j(t),
    getMaxHeight: () => j(t)
  }), se(e, t), g(t), M(e, t);
}
function ie(e, t) {
  let n = Object.getPrototypeOf(e);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, t);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
class V extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = ie(this, "mode"), n = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: n,
      set: (o) => {
        const s = n();
        t != null && t.set ? t.set.call(this, o) : this.__comfort_mode = o, s !== o && this.onModeChange(s, o);
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
  onModeChange(t, n) {
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
function v(e, t) {
  var o;
  if (Array.isArray(e)) {
    for (const s of e) v(s, t);
    return;
  }
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const n = (o = e.subgraph) == null ? void 0 : o.nodes;
  if (Array.isArray(n))
    for (const s of n) v(s, t);
}
function rt(e) {
  var n;
  const t = (e == null ? void 0 : e.type) || ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function Tt(e, t, n) {
  var c, u, a, l;
  const o = e.graph;
  if (!o) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (d) => {
    if (!d || r.has(d)) return;
    r.add(d);
    let p;
    t === "OUTPUT" ? p = (d.outputs || []).flatMap((f) => f.links || []) : p = (d.inputs || []).map((f) => f.link);
    for (const f of p) {
      if (f == null) continue;
      const h = o.links[f];
      if (!h) continue;
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, w = o.getNodeById(m);
      !w || r.has(w) || (rt(w) ? i(w) : s.push(w));
    }
  };
  if (n != null) {
    const d = t === "OUTPUT" ? ((u = (c = e.outputs) == null ? void 0 : c[n]) == null ? void 0 : u.links) || [] : [(l = (a = e.inputs) == null ? void 0 : a[n]) == null ? void 0 : l.link];
    for (const p of d) {
      if (p == null) continue;
      const f = o.links[p];
      if (!f) continue;
      const h = t === "OUTPUT" ? f.target_id : f.origin_id, m = o.getNodeById(h);
      !m || r.has(m) || (rt(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function _(e, t) {
  return Tt(e, "INPUT", t);
}
function it(e, t) {
  return Tt(e, "OUTPUT", t);
}
function B(e) {
  if (e != null && e.graph && typeof e.recomputeInsideNodes == "function")
    try {
      e.recomputeInsideNodes();
    } catch {
    }
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((n) => {
    var o;
    return n && (n.isLGraphNode || ((o = n.constructor) == null ? void 0 : o.type));
  }) : [];
}
function ce(e) {
  var c, u, a, l, d, p, f, h;
  const t = e.graph;
  if (!t) return null;
  const n = t._groups || t.groups || [], o = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((u = e.pos) == null ? void 0 : u[1]) ?? 0, r = ((a = e.size) == null ? void 0 : a[0]) ?? 0, i = ((l = e.size) == null ? void 0 : l[1]) ?? 0;
  for (const m of n) {
    const w = ((d = m.pos) == null ? void 0 : d[0]) ?? 0, S = ((p = m.pos) == null ? void 0 : p[1]) ?? 0, Yt = ((f = m.size) == null ? void 0 : f[0]) ?? 0, jt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (o >= w && s >= S && o + r <= w + Yt && s + i <= S + jt)
      return m;
  }
  return null;
}
class T extends V {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, n, o, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, n, o, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(_(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let n = 0; n < this.inputs.length; n++) {
      const o = this.inputs[n];
      if (o.link != null) {
        const s = _(this, n)[0], r = (s == null ? void 0 : s.title) || "";
        o.name !== r && (o.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const ae = 34, le = 10;
function It(e, t, n) {
  if (e.innerHTML = "", !t.length) {
    const o = document.createElement("div");
    o.className = "comfort-node-empty", o.textContent = n, e.appendChild(o);
    return;
  }
  t.forEach((o, s) => {
    const r = document.createElement("div");
    r.className = "comfort-node-row" + (o.on ? "" : " off"), r.dataset.idx = String(s);
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-toggle " + (o.on ? "on" : "off"), i.textContent = o.on ? "ON" : "OFF", r.appendChild(i);
    const c = document.createElement("span");
    c.className = "comfort-node-title", c.textContent = o.title, c.title = o.title, r.appendChild(c), e.appendChild(r);
  });
}
function Lt(e, t, n) {
  var r;
  if (!e.size) return;
  const o = le * 2 + t * ae, s = Math.max(e.size[0] || 0, n);
  (e.size[1] !== o || e.size[0] !== s) && ((r = e.setSize) == null || r.call(e, [s, o]));
}
const ue = 260;
class Pt extends T {
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
    t && (It(t, this.rows, "Connect nodes to control them"), Lt(this, this.rows.length, ue));
  }
  bindListEvents() {
    const t = this.listEl;
    t && t.addEventListener("click", (n) => {
      const s = n.target.closest(".comfort-node-row");
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
    const t = _(this), n = [];
    for (const o of t) {
      const s = o.title || o.type || "node", r = this.rows.find((c) => c.node === o), i = r ? r.on : o.mode === this.modeOn;
      n.push({ node: o, title: s, on: i });
    }
    this.rows = n, this.renderList();
  }
  /** Called by the fan-in base whenever the connected-node set changes. */
  onConnectedNodesChanged(t) {
    this.syncRows();
  }
  /** Bulk actions: set every row on, off, or toggle each one. */
  setAllRows(t) {
    for (const n of this.rows)
      n.on = t === null ? !n.on : t, this.applyRowMode(n);
    this.renderList();
  }
}
const q = "Fast Muter (comfort)", K = "Fast Bypasser (comfort)";
class de extends Pt {
  constructor() {
    super(q), this.modeOn = y, this.modeOff = x;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class pe extends Pt {
  constructor() {
    super(K), this.modeOn = y, this.modeOff = N;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const fe = de, he = pe, zt = "Node Collector (comfort)";
class me extends T {
  constructor() {
    super(zt), this.addOutput("Output", "*");
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ge = me, J = "Mute / Bypass Repeater (comfort)";
class ye extends T {
  constructor() {
    super(J), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const n = t;
    for (const o of n)
      o.mode !== this.mode && v(o, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, n) {
    if (this.configuring) return;
    const o = _(this);
    if (o.length) {
      for (const r of o) v(r, n);
      return;
    }
    const s = ce(this);
    if (s)
      for (const r of B(s))
        r !== this && v(r, n);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const be = ye;
function W(e) {
  return (e == null ? void 0 : e.type) === J;
}
const we = 500;
class xe {
  constructor() {
    this.timer = null, this.counter = 0, this.jobs = /* @__PURE__ */ new Map();
  }
  /** Run `job` every `cadenceTicks` ticks (1 = every 500ms). */
  schedule(t, n) {
    this.jobs.set(t, Math.max(1, n)), this.ensureTimer();
  }
  unschedule(t) {
    this.jobs.delete(t), this.jobs.size || this.stopTimer();
  }
  ensureTimer() {
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), we));
  }
  stopTimer() {
    this.timer != null && (window.clearInterval(this.timer), this.timer = null);
  }
  tick() {
    this.counter = (this.counter + 1) % 1e6;
    for (const [t, n] of this.jobs)
      if (this.counter % n === 0)
        try {
          t();
        } catch {
        }
  }
}
const C = new xe(), Ft = "Mode Relay (comfort)", ve = {
  ACTIVE: y,
  MUTE: x,
  BYPASS: N,
  NOTHING: -99
}, Ee = {
  [x]: "on_muted_inputs",
  [N]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class Ce extends T {
  constructor() {
    super(Ft), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), at.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, n) {
    if (super.onModeChange(t, n), this.configuring || _(this).length) return;
    const s = it(this).filter(W);
    for (const r of s)
      r.mode !== n && v(r, n);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, n, o, s, r) {
    return s ? W(s) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = _(this);
    let n;
    for (const u of t) {
      const a = u.mode;
      if (n === void 0) n = a;
      else {
        if (n === a && (a === x || a === N)) continue;
        a === y || n === y ? n = y : n = void 0;
      }
    }
    if (n === void 0) return;
    const o = Ee[n], s = o ? ve[String((c = this.properties) == null ? void 0 : c[o])] : n, r = s !== void 0 ? s : n;
    if (r === -99) return;
    const i = it(this).filter(W);
    for (const u of i)
      u.mode !== r && v(u, r);
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
    at.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const I = /* @__PURE__ */ new Set(), ct = () => {
  for (const e of I)
    try {
      e.evaluate();
    } catch {
    }
}, at = {
  register(e) {
    I.add(e), C.schedule(ct, 1);
  },
  unregister(e) {
    I.delete(e), I.size || C.unschedule(ct);
  }
}, Ne = Ce, Dt = "Random Unmuter (comfort)";
class ke extends T {
  constructor() {
    super(Dt), this.tempEnabled = null, lt.register(this);
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
    if (!t.length || !t.every((s) => s.mode === x)) return;
    const o = t[Math.floor(Math.random() * t.length)];
    o && (v(o, y), this.tempEnabled = o);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (v(this.tempEnabled, x), this.tempEnabled = null);
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
    lt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const F = /* @__PURE__ */ new Set(), lt = {
  register(e) {
    F.add(e), _e();
  },
  unregister(e) {
    F.delete(e);
  }
};
let ut = !1;
function _e() {
  if (ut) return;
  ut = !0;
  const e = b, t = e.queuePrompt;
  let n = !1;
  e.queuePrompt = async function(...s) {
    n = !0;
    try {
      return await t.apply(e, s);
    } finally {
      n = !1;
    }
  };
  const o = e.graphToPrompt;
  e.graphToPrompt = function(...s) {
    if (n)
      for (const c of F)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = o.apply(e, s), i = () => {
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
const Se = ke, Bt = "NInfer Suspend Gate (comfort)", dt = 30, Me = 24, Re = 32, Ae = 30, Oe = 10, Te = 300, Ie = 6, Le = 1, Pe = 2e3, ze = 1e3, pt = ["indefinite", "1", "5", "10", "15", "30", "60"], Fe = (e) => new Promise((t) => setTimeout(t, e));
async function Ut(e, t, n) {
  const o = t === void 0 ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(e), {
    signal: n
  }) : await fetch("/comfort/ninfer/forward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: e, body: t }),
    signal: n
  }), s = await o.text();
  let r = s;
  try {
    r = JSON.parse(s);
  } catch {
  }
  return { status: o.status, body: r };
}
const ft = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
async function ht(e, t, n) {
  const o = e + "/v1/models";
  if (t) {
    const i = ft.get(o);
    if (i && Date.now() - i.at < ze) return i.models;
  }
  const s = $.get(o);
  if (s) return s;
  const r = (async () => {
    var a;
    const c = (a = (await Ut(o, void 0, n)).body) == null ? void 0 : a.data, u = Array.isArray(c) ? c.map((l) => {
      var d;
      return {
        id: String(l.id),
        value: String(((d = l.status) == null ? void 0 : d.value) ?? "")
      };
    }) : [];
    return ft.set(o, { at: Date.now(), models: u }), u;
  })().finally(() => $.delete(o));
  return $.set(o, r), r;
}
function De(e, t, n) {
  return Ut(
    e + "/v1/models/" + encodeURIComponent(t) + "/suspend",
    {},
    n
  );
}
class Be extends V {
  constructor() {
    super(Bt), this.properties.url = "", this.properties.timeout = "indefinite", this.properties.selected = null, this.st = this.setupWidget(), bt.register(this);
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
    bt.unregister(this), (t = super.onRemoved) == null || t.call(this);
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
    const n = parseInt(t, 10);
    return Number.isFinite(n) && n > 0 ? n * 60 * 1e3 : 1 / 0;
  }
  /**
   * Effective checked set. `null` (never explicitly set) means "all loaded";
   * an explicit array (possibly empty) is used as-is.
   */
  computeSelected(t) {
    const n = this.properties.selected;
    return n == null ? new Set(
      t.filter((o) => o.value === "loaded").map((o) => o.id)
    ) : new Set(Array.isArray(n) ? n.map(String) : []);
  }
  // --- UI ----------------------------------------------------------------
  setupWidget() {
    const t = document.createElement("div");
    t.className = "comfort-ninfer";
    const n = document.createElement("input");
    n.type = "text", n.className = "comfort-ninfer-url", n.placeholder = "NInfer URL  (http://host:30001)", t.appendChild(n);
    const o = document.createElement("select");
    o.className = "comfort-ninfer-timeout";
    for (const f of pt) {
      const h = document.createElement("option");
      h.value = f, h.textContent = f === "indefinite" ? "Busy timeout: indefinite" : `Busy timeout: ${f} min`, o.appendChild(h);
    }
    t.appendChild(o);
    const s = document.createElement("div");
    s.className = "comfort-ninfer-status";
    const r = document.createElement("span");
    r.className = "comfort-ninfer-status-text", r.textContent = "Set NInfer URL to enable";
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-ninfer-ctrl", i.textContent = "Cancel", i.hidden = !0;
    const c = document.createElement("button");
    c.type = "button", c.className = "comfort-ninfer-ctrl", c.textContent = "Skip", c.hidden = !0, s.appendChild(r), s.appendChild(i), s.appendChild(c), t.appendChild(s);
    const u = document.createElement("div");
    u.className = "comfort-ninfer-bulk";
    const a = document.createElement("button");
    a.type = "button", a.className = "comfort-bulk", a.dataset.bulk = "all", a.textContent = "Select all";
    const l = document.createElement("button");
    l.type = "button", l.className = "comfort-bulk", l.dataset.bulk = "none", l.textContent = "Deselect all", u.appendChild(a), u.appendChild(l), t.appendChild(u);
    const d = document.createElement("div");
    d.className = "comfort-ninfer-rows", t.appendChild(d);
    const p = {
      el: t,
      urlInput: n,
      timeoutSel: o,
      statusEl: s,
      statusText: r,
      cancelBtn: i,
      skipBtn: c,
      bulkEl: u,
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
    }), u.addEventListener("click", (f) => {
      var m;
      const h = (m = f.target.dataset) == null ? void 0 : m.bulk;
      if (h === "all") {
        const w = p.models.filter((S) => S.value === "loaded").map((S) => S.id);
        p.selected = new Set(w), this.properties.selected = w;
      } else if (h === "none")
        p.selected = /* @__PURE__ */ new Set(), this.properties.selected = [];
      else
        return;
      this.renderRows();
    }), n.addEventListener("input", () => {
      this.properties.url = n.value.trim();
    }), n.addEventListener("change", () => {
      this.properties.url = n.value.trim(), this.properties.selected = null, p.phase = "idle", p.resultText = "", p.models = [], p.selected = /* @__PURE__ */ new Set(), this.refresh();
    }), o.addEventListener("change", () => {
      this.properties.timeout = o.value;
    }), typeof this.addDOMWidget == "function" && this.addDOMWidget("ninfer", "comfort_ninfer_list", t, {
      serialize: !1,
      hideOnZoom: !0
    }), p;
  }
  /** Push `this.properties` into the input controls (load path). */
  syncFieldsFromProperties() {
    const t = this.st;
    t.urlInput.value = String(this.properties.url || "");
    const n = String(this.properties.timeout || "indefinite");
    t.timeoutSel.value = pt.includes(n) ? n : "indefinite", t.selected = this.computeSelected(t.models);
  }
  renderRows() {
    const t = this.st, n = t.rowsEl;
    if (n.innerHTML = "", !t.models.length) {
      const o = document.createElement("div");
      o.className = "comfort-node-empty", o.textContent = this.baseUrl() ? "Loading…" : "Set NInfer URL above", n.appendChild(o);
      return;
    }
    for (const o of t.models) {
      const s = o.value === "loaded", r = document.createElement("div");
      r.className = "comfort-ninfer-row" + (s ? "" : " off"), r.dataset.id = o.id;
      const i = document.createElement("input");
      i.type = "checkbox", i.checked = t.selected.has(o.id), i.dataset.id = o.id, r.appendChild(i);
      const c = document.createElement("span");
      c.className = "comfort-node-title", c.textContent = o.id, c.title = o.id, r.appendChild(c);
      const u = o.value || "unknown", a = document.createElement("span");
      a.className = "comfort-ninfer-badge " + (u === "loaded" ? "loaded" : u === "sleeping" ? "suspended" : "other"), a.textContent = u === "sleeping" ? "suspended" : u, r.appendChild(a), n.appendChild(r);
    }
  }
  idleSummary() {
    if (!this.baseUrl()) return "Set NInfer URL to enable";
    const t = this.st.models;
    if (!t.length) return "Loading models…";
    const n = t.filter((o) => o.value === "loaded").length;
    return n ? `${n} loaded · ${t.length - n} other` : "No loaded models";
  }
  renderStatus() {
    const t = this.st, n = Math.max(0, Math.round((Date.now() - t.phaseStart) / 1e3));
    let o;
    switch (t.phase) {
      case "suspending":
        o = `⏳ Suspending ${t.phaseModel}… ${n}s`;
        break;
      case "busy":
        o = `⏳ NInfer busy — waiting… ${n}s`;
        break;
      case "done":
        o = `✓ ${t.resultText}`;
        break;
      case "error":
        o = `✗ ${t.resultText}`;
        break;
      default:
        o = this.idleSummary();
    }
    t.statusText.textContent = o;
    const s = t.phase === "suspending" || t.phase === "busy";
    t.cancelBtn.hidden = !s, t.skipBtn.hidden = !s;
  }
  layout() {
    var r, i;
    const t = this.st.models.length, n = Oe * 2 + dt + dt + Me + Re + t * Ae, o = Math.max(((r = this.size) == null ? void 0 : r[0]) || 0, Te), s = this.size;
    (!s || s[1] !== n || s[0] !== o) && ((i = this.setSize) == null || i.call(this, [o, n]));
  }
  // --- polling -----------------------------------------------------------
  /**
   * Refresh the model list + status. Driven by the ambient scheduler job and
   * on demand (load, URL change, post-suspend). `fresh` bypasses the shared
   * result cache (used right after a suspend, to see the new state at once).
   */
  async refresh(t = !1) {
    const n = this.st;
    if (n.polling || n.phase === "suspending" || n.phase === "busy") return;
    const o = this.baseUrl();
    if (!o) {
      n.models = [], n.selected = /* @__PURE__ */ new Set(), this.renderRows(), this.renderStatus(), this.layout();
      return;
    }
    n.polling = !0;
    try {
      const s = await ht(o, !t);
      n.models = s, this.properties.selected == null && (this.properties.selected = s.filter((r) => r.value === "loaded").map((r) => r.id)), n.selected = this.computeSelected(s), this.renderRows(), this.layout(), (n.phase === "done" || n.phase === "error") && n.resultHold > 0 ? n.resultHold-- : n.phase !== "idle" && (n.phase = "idle", n.resultText = ""), this.renderStatus();
    } catch {
      n.phase === "idle" && (n.phase = "error", n.resultText = "NInfer unreachable"), this.renderStatus();
    } finally {
      n.polling = !1;
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
    const t = this.st, n = this.baseUrl();
    if (!n) return { proceed: !0 };
    t.cancel = !1, t.skip = !1, t.abort = null;
    let o;
    try {
      o = await ht(n, !1);
    } catch {
      return this.finish("NInfer unreachable", !0), { proceed: !1 };
    }
    t.models = o;
    const s = this.computeSelected(o);
    t.selected = s, this.renderRows();
    const r = o.filter(
      (u) => u.value === "loaded" && s.has(u.id)
    );
    if (!r.length)
      return this.finish("Ready (nothing to suspend)", !1), { proceed: !0 };
    const i = Date.now(), c = this.timeoutMs();
    try {
      for (const a of r) {
        if (t.cancel || t.skip) break;
        const l = Date.now();
        for (this.beginSuspending(a.id, l); !(t.cancel || t.skip); ) {
          const d = new AbortController();
          t.abort = d;
          let p;
          try {
            p = await De(n, a.id, d.signal);
          } catch {
            if (d.signal.aborted) break;
            throw new Error("suspend request failed");
          }
          if (p.status === 200) break;
          if (p.status === 409) {
            if (this.setBusy(a.id, l), await Fe(Pe), t.cancel || t.skip) break;
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
      const u = Math.round((Date.now() - i) / 1e3);
      this.finish(
        `Suspended ${r.length} model${r.length === 1 ? "" : "s"} (${u}s)`,
        !1
      ), t.resultHold = 2;
      try {
        await this.refresh(!0);
      } catch {
      }
      return { proceed: !0 };
    } catch (u) {
      return this.finish(u instanceof Error ? u.message : String(u), !0), { proceed: !1 };
    } finally {
      t.abort = null;
    }
  }
  beginSuspending(t, n) {
    const o = this.st;
    o.phase = "suspending", o.phaseModel = t, o.phaseStart = n, this.renderStatus();
  }
  setBusy(t, n) {
    const o = this.st;
    o.phase = "busy", o.phaseModel = t, o.phaseStart = n, this.renderStatus();
  }
  finish(t, n) {
    const o = this.st;
    o.phase = n ? "error" : "done", o.resultText = t, this.renderStatus();
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
const k = /* @__PURE__ */ new Set();
let mt = !1;
const gt = () => {
  if (!document.hidden) {
    for (const e of Array.from(k))
      if (!e.removed)
        try {
          e.refresh();
        } catch {
        }
  }
}, yt = () => {
  for (const e of Array.from(k))
    if (!e.removed)
      try {
        e.updateLiveStatus();
      } catch {
      }
}, bt = {
  register(e) {
    k.add(e), Ue(), C.schedule(gt, Ie), C.schedule(yt, Le);
  },
  unregister(e) {
    k.delete(e), k.size || (C.unschedule(gt), C.unschedule(yt));
  }
};
function Ue() {
  if (mt) return;
  mt = !0;
  const e = b, t = e.queuePrompt;
  e.queuePrompt = async function(...n) {
    let o = !0;
    for (const s of Array.from(k)) {
      if (s.removed) continue;
      if (!(await s.suspendChecked()).proceed) {
        o = !1;
        break;
      }
    }
    return o ? await t.apply(e, n) : Promise.resolve();
  };
}
let R = null;
function Ge() {
  return document.querySelector('[data-testid="queue-button"]');
}
function He() {
  var t;
  const e = b;
  return ((t = e.canvas) == null ? void 0 : t.graph) ?? e.graph ?? null;
}
function Gt() {
  const e = He();
  if (!e) return null;
  for (const t of k)
    if (!t.removed && t.graph === e) return t;
  return null;
}
function We() {
  if (R && R.isConnected) return;
  const e = Ge();
  if (!e || !e.parentElement) return;
  const t = document.createElement("button");
  t.type = "button", t.className = "comfort-topbar-focus", t.title = "Focus NInfer gate", t.textContent = "⚡ NInfer", t.addEventListener("click", () => {
    const n = Gt();
    if (!n) return;
    const o = n.graph;
    if (o) {
      for (const p of o._nodes || []) p.selected = !1;
      n.selected = !0;
    }
    const s = b.canvas;
    if (!s) return;
    const r = n.size || [200, 150], i = r[0] || 200, c = r[1] || 150, u = s.canvas, a = u && u.clientWidth || window.innerWidth, l = u && u.clientHeight || window.innerHeight, d = Math.min(a * 0.5 / i, l * 0.5 / c);
    s.ds.scale = Math.min(Math.max(d, 0.75), 2), s.centerOnNode(n), s.setDirty(!0);
  }), e.parentElement.insertBefore(t, e.nextSibling), R = t;
}
const $e = () => {
  We(), R && (R.style.display = Gt() ? "" : "none");
};
function Ye() {
  C.schedule($e, 1);
}
const Z = "Fast Groups Muter (comfort)", Q = "Fast Groups Bypasser (comfort)", je = 280;
function Ve(e) {
  const t = e.graph;
  if (!t) return [];
  const n = /* @__PURE__ */ new Set(), o = [], s = (r) => {
    var i;
    if (!(!r || n.has(r))) {
      n.add(r);
      for (const c of r._groups || r.groups || []) o.push(c);
      for (const c of r._subgraphs || []) s(c);
      for (const c of r._nodes || [])
        (i = c.subgraph) != null && i._groups && s(c.subgraph);
    }
  };
  return s(t), o.sort((r, i) => {
    var d, p, f, h;
    const c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0, u = ((p = i.pos) == null ? void 0 : p[1]) ?? 0;
    if (c !== u) return c - u;
    const a = ((f = r.pos) == null ? void 0 : f[0]) ?? 0, l = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return a !== l ? a - l : String(r.title || "").localeCompare(String(i.title || ""));
  }), o;
}
function qe(e) {
  return B(e).some((t) => t.mode === y);
}
class Ht extends V {
  constructor(t) {
    super(t), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), xt.register(this);
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
      const o = t.target.closest(".comfort-node-row");
      if (!o) return;
      const s = this.rows[Number(o.dataset.idx)];
      s && (this.applyGroupMode(s, !s.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(t, n) {
    const o = B(t.group);
    v(o, n ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Ve(this), n = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let o = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: qe(i)
    }));
    if (n)
      try {
        const i = new RegExp(n, "i");
        o = o.filter((c) => i.test(c.title));
      } catch {
        o = o.filter((i) => i.title.toLowerCase().includes(n.toLowerCase()));
      }
    const s = o.map((i) => i.title + (i.on ? 1 : 0)).join("|");
    s !== this.lastKey && (this.lastKey = s, this.rows = o, this.renderList());
  }
  renderList() {
    const t = this.listEl;
    t && (It(t, this.rows, "No groups in this workflow"), Lt(this, this.rows.length, je));
  }
  setAllGroups(t) {
    for (const n of this.rows) {
      const o = t === null ? !n.on : t;
      this.applyGroupMode(n, o);
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
    xt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class Ke extends Ht {
  constructor() {
    super(Z), this.modeOff = x;
  }
}
class Je extends Ht {
  constructor() {
    super(Q), this.modeOff = N;
  }
}
const L = /* @__PURE__ */ new Set(), wt = () => {
  for (const e of L)
    try {
      e.refresh();
    } catch {
    }
}, xt = {
  register(e) {
    L.add(e), C.schedule(wt, 2);
  },
  unregister(e) {
    L.delete(e), L.size || C.unschedule(wt);
  }
}, Ze = Ke, Qe = Je, vt = /* @__PURE__ */ new Set();
function E(e, t) {
  vt.has(e) || (vt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function Xe() {
  E(q, fe), E(K, he), E(zt, ge), E(J, be), E(Ft, Ne), E(Dt, Se), E(Z, Ze), E(Q, Qe), E(Bt, Be);
}
function tn(e) {
  return (e == null ? void 0 : e.type) === q || (e == null ? void 0 : e.type) === K;
}
function en(e) {
  return (e == null ? void 0 : e.type) === Z || (e == null ? void 0 : e.type) === Q;
}
const nn = 10, on = /[/\\]/, Et = "__comfort_original";
function sn(e, t) {
  const n = t == null ? void 0 : t.callback, o = /* @__PURE__ */ new Map(), s = [];
  for (const a of e) {
    if (a == null) {
      s.push(a);
      continue;
    }
    const l = String(a), d = l.indexOf("/") > -1 ? "/" : "\\", p = l.indexOf(d);
    if (p > -1) {
      const f = l.slice(0, p), h = l.slice(p + 1);
      o.has(f) || o.set(f, []), o.get(f).push({ full: l, sub: h });
    } else
      s.push(a);
  }
  const r = (a, l) => ({
    content: l,
    [Et]: a,
    callback: (d) => n == null ? void 0 : n(d[Et])
  }), i = [], c = [...o.keys()].sort((a, l) => a.localeCompare(l));
  for (const a of c) {
    const l = o.get(a).map((d) => r(d.full, d.sub));
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
  const u = Object.assign({}, t);
  return u.callback = void 0, { values: i, options: u };
}
function Ct(e, t) {
  return !Array.isArray(e) || e.length < nn ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((n) => n == null || typeof n == "string") ? e.some((n) => typeof n == "string" && on.test(n)) ? sn(e, t) : { values: e, options: t } : { values: e, options: t };
}
function rn() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(n, o, s) {
      const [r, i] = o, c = Ct(r, i);
      return Reflect.construct(n, [c.values, c.options], s);
    },
    apply(n, o, s) {
      const [r, i] = s, c = Ct(r, i);
      return n.call(o, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const A = 20, Nt = 6, cn = 6;
let D = /* @__PURE__ */ new Map();
function kt(e, t) {
  const n = document.createElement("div");
  return n.className = "comfort-group-btn " + t, n.textContent = e, n.style.position = "fixed", n.style.display = "none", n.style.pointerEvents = "auto", n.style.zIndex = "100", n;
}
function an(e) {
  let t = D.get(e);
  if (t) return t;
  const n = kt("M", "comfort-btn-mute"), o = kt("B", "comfort-btn-byp");
  return n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), St(e, "mute");
  }), o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), St(e, "bypass");
  }), t = { group: e, mute: n, byp: o }, D.set(e, t), document.body.appendChild(n), document.body.appendChild(o), t;
}
function _t(e, t, n, o) {
  e.style.left = `${t}px`, e.style.top = `${n}px`, e.style.width = `${A * o}px`, e.style.height = `${A * o}px`, e.style.fontSize = `${Math.max(9, A * o * 0.5)}px`;
}
function ln(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function un() {
  const e = b.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const o = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (l) => o.left + (l + r[0]) * s, c = (l) => o.top + (l + r[1]) * s, u = t._groups || [], a = /* @__PURE__ */ new Set();
  for (const l of u)
    (e.selected_group === l || ln(l, e.mouse)) && a.add(l);
  for (const l of a) {
    const d = an(l), p = l.pos[0] + l.size[0] - Nt - A, f = l.pos[1] + Nt;
    _t(d.mute, i(p - cn - A), c(f), s), _t(d.byp, i(p), c(f), s), d.mute.style.display = "block", d.byp.style.display = "block";
  }
  for (const [l, d] of D)
    a.has(l) || (d.mute.style.display = "none", d.byp.style.display = "none"), u.includes(l) || (d.mute.remove(), d.byp.remove(), D.delete(l));
}
function St(e, t) {
  var u;
  const n = B(e);
  if (!n.length) return;
  const o = n.every((a) => a.mode === x), s = n.every((a) => a.mode === N), r = b.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const a = o ? y : x;
      n.forEach((l) => l.mode = a);
    } else {
      const a = s ? y : N;
      n.forEach((l) => l.mode = a);
    }
  } catch (a) {
    console.warn("[comfort] group toggle failed", a);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = b.canvas;
  (u = c == null ? void 0 : c.setDirty) == null || u.call(c, !0, !0);
}
function dn() {
  const e = b.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(n, ...o) {
    t == null || t.call(this, n, ...o);
    try {
      un();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const P = "Any Router (comfort)", pn = 4, fn = 5;
function O(e) {
  return (e.inputs || []).filter((t) => t && t.name && t.name.startsWith("any_"));
}
function Wt(e) {
  var t;
  return (e == null ? void 0 : e.type) === P || (e == null ? void 0 : e.comfyClass) === P || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === P;
}
function X(e) {
  const t = O(e).length + 1;
  return "any_" + String(t).padStart(2, "0");
}
function hn(e) {
  const t = (e.widgets || []).find((n) => n.name === "selection");
  return t && t.value === "active_source" ? "active_source" : "non_empty";
}
function mn(e, t, n) {
  var c, u;
  const o = e.graph || b.graph;
  if (!o) return null;
  let s = e, r = n, i = t;
  for (let a = 0; a < 12; a++) {
    const l = i === "input" ? (c = s.inputs) == null ? void 0 : c[r] : (u = s.outputs) == null ? void 0 : u[r];
    if (!l) return null;
    if (l.type != null && l.type !== "*") return String(l.type);
    const d = i === "input" ? l.link : l.links && l.links[0];
    if (d == null) return null;
    const p = o.links && (o.links.get ? o.links.get(d) : o.links[d]) || null;
    if (!p || (i === "input" ? (s = o.getNodeById(p.origin_id), r = p.origin_slot, i = "output") : (s = o.getNodeById(p.target_id), r = p.target_slot, i = "input"), !s)) return null;
  }
  return null;
}
function gn(e) {
  const t = e.inputs || [];
  for (let n = 0; n < t.length; n++) {
    if (t[n].link == null) continue;
    const o = mn(e, "input", n);
    if (o && o !== "*") return o;
  }
  return "*";
}
function $t(e) {
  if (e.removed || !e.inputs) return;
  let t = O(e).length;
  for (; t > pn; ) {
    const s = e.inputs[e.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      e.removeInput(e.inputs.length - 1), t--;
    else
      break;
  }
  const n = e.inputs[e.inputs.length - 1];
  (!n || !n.name.startsWith("any_") || n.link != null) && e.addInput(X(e), "*");
  const o = gn(e);
  for (const s of O(e)) s.type = o;
  for (const s of e.outputs || [])
    s.type = o, s.label = String(o);
}
const Y = /* @__PURE__ */ new WeakMap();
function yn(e) {
  const t = Y.get(e);
  t != null && window.clearTimeout(t), Y.set(
    e,
    window.setTimeout(() => {
      Y.delete(e), e.removed || $t(e);
    }, 64)
  );
}
function bn(e) {
  if (!e || e.__comfortAnyRouter) return;
  e.__comfortAnyRouter = !0, e.prototype.stabilizeComfortAnyRouter = function() {
    $t(this);
  }, e.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const t = e.prototype.configure;
  e.prototype.configure = function(o) {
    try {
      const r = (o && o.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; O(this).length < r; )
        this.addInput(X(this), "*");
    } catch {
    }
    const s = t ? t.call(this, o) : void 0;
    try {
      this.removed || this.stabilizeComfortAnyRouter();
    } catch {
    }
    return s;
  };
  const n = e.prototype.onConnectionsChange;
  e.prototype.onConnectionsChange = function(...o) {
    const s = n ? n.apply(this, o) : void 0;
    try {
      yn(this);
    } catch {
    }
    return s;
  };
}
function wn(e) {
  let t = 0;
  for (; O(e).length < fn && t++ < 24; )
    e.addInput(X(e), "*");
  vn();
}
function xn(e) {
  return !!e && e.mode !== x && e.mode !== N;
}
function Mt(e) {
  if (!e || typeof e != "object") return;
  const t = e.output, n = b.graph;
  if (!(!t || !n || !n.nodes))
    for (const o of n.nodes) {
      if (!Wt(o) || o.mode === x || o.mode === N || hn(o) !== "active_source") continue;
      const s = t[o.id];
      if (!s || !s.inputs) continue;
      const r = o.inputs || [];
      let i = null;
      for (let c = 0; c < r.length; c++) {
        const u = o.getInputNode ? o.getInputNode(c) : null;
        if (xn(u)) {
          i = r[c].name;
          break;
        }
      }
      for (const c of Object.keys(s.inputs))
        c.startsWith("any_") && c !== i && delete s.inputs[c];
    }
}
let Rt = !1;
function vn() {
  if (Rt) return;
  Rt = !0;
  const e = b, t = e.graphToPrompt;
  typeof t == "function" && (e.graphToPrompt = function(...n) {
    const o = t.apply(e, n);
    return o && typeof o.then == "function" ? o.then(
      (s) => (Mt(s), s),
      (s) => {
        throw s;
      }
    ) : (Mt(o), o);
  });
}
const En = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-ninfer{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}.comfort-ninfer-url,.comfort-ninfer-timeout{width:100%;box-sizing:border-box;padding:4px 6px;font-size:12px;font-family:inherit;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-ninfer-status{display:flex;align-items:center;gap:6px;min-height:18px;padding:2px;font-size:11px;opacity:.9}.comfort-ninfer-status-text{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-ninfer-ctrl{flex:0 0 auto;padding:1px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-ninfer-ctrl:hover{background:#7f7f7f33}.comfort-ninfer-bulk{display:flex;gap:6px}.comfort-bulk{flex:1 1 auto;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-bulk:hover{background:#7f7f7f33}.comfort-ninfer-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-ninfer-row.off .comfort-node-title{opacity:.5}.comfort-ninfer-row input[type=checkbox]{margin:0;cursor:pointer}.comfort-ninfer-badge{padding:1px 6px;border-radius:8px;font-size:10px;background:#7f7f7f40}.comfort-ninfer-badge.loaded{background:#7d2e2e;color:#fff}.comfort-ninfer-badge.suspended{background:#2e5d7d;color:#fff}.comfort-ninfer-badge.other{opacity:.7}.comfort-topbar-focus{padding:3px 8px;margin-left:6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-topbar-focus:hover{background:#7f7f7f33}", tt = document.createElement("style");
tt.setAttribute("data-comfort-plugin", "true");
tt.textContent = En;
document.head.appendChild(tt);
Xe();
rn();
b.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    dn(), Ye();
  },
  // ComfyUI auto-creates a class for every server-backed node def. For the Any
  // Router we replace its behavior in place (it has no fixed connection inputs
  // in the def; we add the dynamic `any_*` inputs and manage them).
  beforeRegisterNodeDef(e, t) {
    t && t.name === P && bn(e);
  },
  nodeCreated(e) {
    if (nt(e)) {
      re(e);
      return;
    }
    Wt(e) && wn(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (nt(e)) {
      const t = Zt(e);
      if (t) {
        const n = (o) => {
          t.showSeparate = o, ee(e);
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
                  callback: () => n(!1)
                },
                {
                  content: "Separate Model & Clip",
                  checked: () => t.showSeparate,
                  callback: () => n(!0)
                }
              ]
            }
          }
        ];
      }
    }
    if (tn(e)) {
      const t = (n) => {
        var o;
        return (o = e.setAllRows) == null ? void 0 : o.call(e, n);
      };
      return [
        null,
        { content: "Enable all", callback: () => t(!0) },
        { content: "Disable all", callback: () => t(!1) },
        { content: "Toggle all", callback: () => t(null) }
      ];
    }
    if (en(e)) {
      const t = (n) => {
        var o;
        return (o = e.setAllGroups) == null ? void 0 : o.call(e, n);
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
  U as NODE_NAME
};
