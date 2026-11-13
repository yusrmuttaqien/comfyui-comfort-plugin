import { app as x } from "/scripts/app.js";
const W = "Power Lora Loader (comfort)", F = /* @__PURE__ */ new WeakMap(), Qt = 32, Xt = 36, te = 34, it = 14, ee = 380;
function ct(e) {
  var t;
  return (e == null ? void 0 : e.type) === W || (e == null ? void 0 : e.comfyClass) === W || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === W;
}
function ne(e) {
  return F.get(e);
}
function J(e) {
  return it + Qt + e.rows.length * Xt + te + it;
}
function I(e, t) {
  var s;
  if (!e.size) return;
  const n = J(t), o = Math.max(e.size[0] || 0, ee);
  (e.size[1] !== n || e.size[0] !== o) && ((s = e.setSize) == null || s.call(e, [o, n]));
}
function oe(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function zt(e) {
  let t = !0, n = !0;
  for (const o of e.rows)
    if (t = t && o.on === !0, n = n && o.on === !1, !t && !n) return null;
  return !!(t && e.rows.length > 0);
}
function se(e) {
  const t = !zt(e);
  for (const n of e.rows) n.on = t;
}
function at(e, t, n) {
  const o = n ? "strengthTwo" : "strength", s = e[o] ?? 1;
  e[o] = Math.round((s + t * 0.05) * 100) / 100;
}
function Ut(e, t) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (e ? "on" : "off"), n.textContent = t, n;
}
function $(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function j(e, t) {
  const n = document.createElement("div");
  n.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-dec", o.textContent = "−", o.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", n.appendChild(o), n.appendChild(r), n.appendChild(s), n;
}
function re(e, t, n) {
  const o = document.createElement("div");
  o.className = "comfort-lora-row" + (t.on ? "" : " off"), o.dataset.idx = String(n), o.appendChild(Ut(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", o.appendChild(r), e.showSeparate ? (o.appendChild(j(t, "one")), o.appendChild(j(t, "two"))) : o.appendChild(j(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", o.appendChild(i), o;
}
function b(e) {
  const t = e.el;
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const o = zt(e), s = Ut(o !== !1, o === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild($("Model")), r.appendChild($("Clip"))) : r.appendChild($("Strength")), n.appendChild(r), t.appendChild(n), e.rows.forEach((u, a) => t.appendChild(re(e, u, a)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function ie(e) {
  const t = F.get(e);
  t && (b(t), I(e, t));
}
async function ce() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function lt(e, t, n, o) {
  const s = await ce() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: n,
    callback: (i) => {
      i !== "(no loras found)" && o(i);
    }
  });
}
function ae(e, t, n, o) {
  const s = t.rows[n];
  if (!s) return;
  const r = n > 0, i = n < t.rows.length - 1, c = (u) => {
    const a = n + u;
    if (a < 0 || a >= t.rows.length) return;
    const l = t.rows[n];
    t.rows[n] = t.rows[a], t.rows[a] = l, b(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${s.on ? "⚫" : "◯"} Toggle ${s.on ? "Off" : "On"}`,
        callback: () => {
          s.on = !s.on, b(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !r, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(n, 1), b(t), I(e, t);
        }
      }
    ],
    { title: "LORA", event: o }
  );
}
function le(e, t) {
  const n = t.el;
  n.addEventListener("click", (o) => {
    const s = o.target;
    if (s.closest(".comfort-toggle-all")) {
      se(t), b(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      lt(t, e, o, (a) => {
        t.rows.push(oe(a)), b(t), I(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const u = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, b(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      lt(t, e, o, (a) => {
        c.lora = a, b(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      at(c, -1, u), b(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      at(c, 1, u), b(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), b(t), I(e, t);
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
    s && (o.preventDefault(), o.stopPropagation(), ae(e, t, Number(s.dataset.idx), o));
  });
}
function ue(e) {
  if (F.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  t.el.className = "comfort-lora-list", F.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (n) => {
      t.rows = Array.isArray(n) ? n : [], b(t), I(e, t);
    },
    getMinHeight: () => J(t),
    getMaxHeight: () => J(t)
  }), le(e, t), b(t), I(e, t);
}
function de(e, t) {
  let n = Object.getPrototypeOf(e);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, t);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
class Q extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = de(this, "mode"), n = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const v = 0, E = 2, k = 4;
function C(e, t) {
  var o;
  if (Array.isArray(e)) {
    for (const s of e) C(s, t);
    return;
  }
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const n = (o = e.subgraph) == null ? void 0 : o.nodes;
  if (Array.isArray(n))
    for (const s of n) C(s, t);
}
function ut(e) {
  var n;
  const t = (e == null ? void 0 : e.type) || ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function Ft(e, t, n) {
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
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, g = o.getNodeById(m);
      !g || r.has(g) || (ut(g) ? i(g) : s.push(g));
    }
  };
  if (n != null) {
    const d = t === "OUTPUT" ? ((u = (c = e.outputs) == null ? void 0 : c[n]) == null ? void 0 : u.links) || [] : [(l = (a = e.inputs) == null ? void 0 : a[n]) == null ? void 0 : l.link];
    for (const p of d) {
      if (p == null) continue;
      const f = o.links[p];
      if (!f) continue;
      const h = t === "OUTPUT" ? f.target_id : f.origin_id, m = o.getNodeById(h);
      !m || r.has(m) || (ut(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function M(e, t) {
  return Ft(e, "INPUT", t);
}
function dt(e, t) {
  return Ft(e, "OUTPUT", t);
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
function pe(e) {
  var c, u, a, l, d, p, f, h;
  const t = e.graph;
  if (!t) return null;
  const n = t._groups || t.groups || [], o = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((u = e.pos) == null ? void 0 : u[1]) ?? 0, r = ((a = e.size) == null ? void 0 : a[0]) ?? 0, i = ((l = e.size) == null ? void 0 : l[1]) ?? 0;
  for (const m of n) {
    const g = ((d = m.pos) == null ? void 0 : d[0]) ?? 0, y = ((p = m.pos) == null ? void 0 : p[1]) ?? 0, w = ((f = m.size) == null ? void 0 : f[0]) ?? 0, G = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (o >= g && s >= y && o + r <= g + w && s + i <= y + G)
      return m;
  }
  return null;
}
class T extends Q {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, n, o, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, n, o, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(M(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let n = 0; n < this.inputs.length; n++) {
      const o = this.inputs[n];
      if (o.link != null) {
        const s = M(this, n)[0], r = (s == null ? void 0 : s.title) || "";
        o.name !== r && (o.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const fe = 34, he = 10;
function Dt(e, t, n) {
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
function Ht(e, t, n) {
  var r;
  if (!e.size) return;
  const o = he * 2 + t * fe, s = Math.max(e.size[0] || 0, n);
  (e.size[1] !== o || e.size[0] !== s) && ((r = e.setSize) == null || r.call(e, [s, o]));
}
const me = 260;
class Bt extends T {
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
    t && (Dt(t, this.rows, "Connect nodes to control them"), Ht(this, this.rows.length, me));
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
    const t = M(this), n = [];
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
const X = "Fast Muter (comfort)", tt = "Fast Bypasser (comfort)";
class ge extends Bt {
  constructor() {
    super(X), this.modeOn = v, this.modeOff = E;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class ye extends Bt {
  constructor() {
    super(tt), this.modeOn = v, this.modeOff = k;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const be = ge, xe = ye, Gt = "Node Collector (comfort)";
class we extends T {
  constructor() {
    super(Gt), this.addOutput("Output", "*");
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ve = we, et = "Mute / Bypass Repeater (comfort)";
class Ee extends T {
  constructor() {
    super(et), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const n = t;
    for (const o of n)
      o.mode !== this.mode && C(o, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, n) {
    if (this.configuring) return;
    const o = M(this);
    if (o.length) {
      for (const r of o) C(r, n);
      return;
    }
    const s = pe(this);
    if (s)
      for (const r of B(s))
        r !== this && C(r, n);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Ce = Ee;
function Y(e) {
  return (e == null ? void 0 : e.type) === et;
}
const Ne = 500;
class _e {
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
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), Ne));
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
const _ = new _e(), Wt = "Mode Relay (comfort)", ke = {
  ACTIVE: v,
  MUTE: E,
  BYPASS: k,
  NOTHING: -99
}, Se = {
  [E]: "on_muted_inputs",
  [k]: "on_bypassed_inputs",
  [v]: "on_any_active_inputs"
};
class Me extends T {
  constructor() {
    super(Wt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), ft.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  /**
   * With no inputs connected, the Relay acts as a plain mode forwarder: changing
   * its own mode drives the connected Repeater.
   */
  onModeChange(t, n) {
    if (super.onModeChange(t, n), this.configuring || M(this).length) return;
    const s = dt(this).filter(Y);
    for (const r of s)
      r.mode !== n && C(r, n);
  }
  /**
   * Restrict the REPEATER output to Repeater nodes only.
   * `inputNode` is the node whose input we are connecting to.
   */
  onConnectOutput(t, n, o, s, r) {
    return s ? Y(s) : !0;
  }
  /** Vote on the input modes and drive the connected Repeater. */
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = M(this);
    let n;
    for (const u of t) {
      const a = u.mode;
      if (n === void 0) n = a;
      else {
        if (n === a && (a === E || a === k)) continue;
        a === v || n === v ? n = v : n = void 0;
      }
    }
    if (n === void 0) return;
    const o = Se[n], s = o ? ke[String((c = this.properties) == null ? void 0 : c[o])] : n, r = s !== void 0 ? s : n;
    if (r === -99) return;
    const i = dt(this).filter(Y);
    for (const u of i)
      u.mode !== r && C(u, r);
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
    ft.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const L = /* @__PURE__ */ new Set(), pt = () => {
  for (const e of L)
    try {
      e.evaluate();
    } catch {
    }
}, ft = {
  register(e) {
    L.add(e), _.schedule(pt, 1);
  },
  unregister(e) {
    L.delete(e), L.size || _.unschedule(pt);
  }
}, Ie = Me, $t = "Random Unmuter (comfort)";
class Re extends T {
  constructor() {
    super($t), this.tempEnabled = null, ht.register(this);
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
    const t = M(this);
    if (!t.length || !t.every((s) => s.mode === E)) return;
    const o = t[Math.floor(Math.random() * t.length)];
    o && (C(o, v), this.tempEnabled = o);
  }
  /** Called after the prompt build; mute the temporarily-enabled node back. */
  onPromptEnd() {
    this.tempEnabled && (C(this.tempEnabled, E), this.tempEnabled = null);
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
    ht.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const D = /* @__PURE__ */ new Set(), ht = {
  register(e) {
    D.add(e), Ae();
  },
  unregister(e) {
    D.delete(e);
  }
};
let mt = !1;
function Ae() {
  if (mt) return;
  mt = !0;
  const e = x, t = e.queuePrompt;
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
      for (const c of D)
        try {
          c.onPromptStart();
        } catch {
        }
    const r = o.apply(e, s), i = () => {
      for (const c of D)
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
const Oe = Re, jt = "NInfer Suspend Gate (comfort)", gt = 30, Te = 24, Le = 32, Pe = 30, ze = 10, Ue = 300, Fe = 6, De = 1, He = 2e3, Be = 1e3, yt = ["indefinite", "1", "5", "10", "15", "30", "60"], Ge = (e) => new Promise((t) => setTimeout(t, e));
async function Yt(e, t, n) {
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
const bt = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map();
async function xt(e, t, n) {
  const o = e + "/v1/models";
  if (t) {
    const i = bt.get(o);
    if (i && Date.now() - i.at < Be) return i.models;
  }
  const s = V.get(o);
  if (s) return s;
  const r = (async () => {
    var a;
    const c = (a = (await Yt(o, void 0, n)).body) == null ? void 0 : a.data, u = Array.isArray(c) ? c.map((l) => {
      var d;
      return {
        id: String(l.id),
        value: String(((d = l.status) == null ? void 0 : d.value) ?? "")
      };
    }) : [];
    return bt.set(o, { at: Date.now(), models: u }), u;
  })().finally(() => V.delete(o));
  return V.set(o, r), r;
}
function We(e, t, n) {
  return Yt(
    e + "/v1/models/" + encodeURIComponent(t) + "/suspend",
    {},
    n
  );
}
class $e extends Q {
  constructor() {
    super(jt), this.properties.url = "", this.properties.timeout = "indefinite", this.properties.selected = null, this.st = this.setupWidget(), Ct.register(this);
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
    Ct.unregister(this), (t = super.onRemoved) == null || t.call(this);
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
    for (const f of yt) {
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
        const g = p.models.filter((y) => y.value === "loaded").map((y) => y.id);
        p.selected = new Set(g), this.properties.selected = g;
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
    t.timeoutSel.value = yt.includes(n) ? n : "indefinite", t.selected = this.computeSelected(t.models);
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
    const t = this.st.models.length, n = ze * 2 + gt + gt + Te + Le + t * Pe, o = Math.max(((r = this.size) == null ? void 0 : r[0]) || 0, Ue), s = this.size;
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
      const s = await xt(o, !t);
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
      o = await xt(n, !1);
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
            p = await We(n, a.id, d.signal);
          } catch {
            if (d.signal.aborted) break;
            throw new Error("suspend request failed");
          }
          if (p.status === 200) break;
          if (p.status === 409) {
            if (this.setBusy(a.id, l), await Ge(He), t.cancel || t.skip) break;
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
const S = /* @__PURE__ */ new Set();
let wt = !1;
const vt = () => {
  if (!document.hidden) {
    for (const e of Array.from(S))
      if (!e.removed)
        try {
          e.refresh();
        } catch {
        }
  }
}, Et = () => {
  for (const e of Array.from(S))
    if (!e.removed)
      try {
        e.updateLiveStatus();
      } catch {
      }
}, Ct = {
  register(e) {
    S.add(e), je(), _.schedule(vt, Fe), _.schedule(Et, De);
  },
  unregister(e) {
    S.delete(e), S.size || (_.unschedule(vt), _.unschedule(Et));
  }
};
function je() {
  if (wt) return;
  wt = !0;
  const e = x, t = e.queuePrompt;
  e.queuePrompt = async function(...n) {
    let o = !0;
    for (const s of Array.from(S)) {
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
function Ye() {
  return document.querySelector('[data-testid="queue-button"]');
}
function Ve() {
  var t;
  const e = x;
  return ((t = e.canvas) == null ? void 0 : t.graph) ?? e.graph ?? null;
}
function Vt() {
  const e = Ve();
  if (!e) return null;
  for (const t of S)
    if (!t.removed && t.graph === e) return t;
  return null;
}
function qe() {
  if (R && R.isConnected) return;
  const e = Ye();
  if (!e || !e.parentElement) return;
  const t = document.createElement("button");
  t.type = "button", t.className = "comfort-topbar-focus", t.title = "Focus NInfer gate", t.textContent = "⚡ NInfer", t.addEventListener("click", () => {
    const n = Vt();
    if (!n) return;
    const o = n.graph;
    if (o) {
      for (const p of o._nodes || []) p.selected = !1;
      n.selected = !0;
    }
    const s = x.canvas;
    if (!s) return;
    const r = n.size || [200, 150], i = r[0] || 200, c = r[1] || 150, u = s.canvas, a = u && u.clientWidth || window.innerWidth, l = u && u.clientHeight || window.innerHeight, d = Math.min(a * 0.5 / i, l * 0.5 / c);
    s.ds.scale = Math.min(Math.max(d, 0.75), 2), s.centerOnNode(n), s.setDirty(!0);
  }), e.parentElement.insertBefore(t, e.nextSibling), R = t;
}
const Ke = () => {
  qe(), R && (R.style.display = Vt() ? "" : "none");
};
function Je() {
  _.schedule(Ke, 1);
}
const nt = "Fast Groups Muter (comfort)", ot = "Fast Groups Bypasser (comfort)", Ze = 280;
function Qe(e) {
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
function Xe(e) {
  return B(e).some((t) => t.mode === v);
}
class qt extends Q {
  constructor(t) {
    super(t), this.modeOn = v, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), _t.register(this);
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
    C(o, n ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Qe(this), n = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let o = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: Xe(i)
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
    t && (Dt(t, this.rows, "No groups in this workflow"), Ht(this, this.rows.length, Ze));
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
    _t.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class tn extends qt {
  constructor() {
    super(nt), this.modeOff = E;
  }
}
class en extends qt {
  constructor() {
    super(ot), this.modeOff = k;
  }
}
const P = /* @__PURE__ */ new Set(), Nt = () => {
  for (const e of P)
    try {
      e.refresh();
    } catch {
    }
}, _t = {
  register(e) {
    P.add(e), _.schedule(Nt, 2);
  },
  unregister(e) {
    P.delete(e), P.size || _.unschedule(Nt);
  }
}, nn = tn, on = en, kt = /* @__PURE__ */ new Set();
function N(e, t) {
  kt.has(e) || (kt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function sn() {
  N(X, be), N(tt, xe), N(Gt, ve), N(et, Ce), N(Wt, Ie), N($t, Oe), N(nt, nn), N(ot, on), N(jt, $e);
}
function rn(e) {
  return (e == null ? void 0 : e.type) === X || (e == null ? void 0 : e.type) === tt;
}
function cn(e) {
  return (e == null ? void 0 : e.type) === nt || (e == null ? void 0 : e.type) === ot;
}
const an = 10, ln = /[/\\]/, St = "__comfort_original";
function un(e, t) {
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
    [St]: a,
    callback: (d) => n == null ? void 0 : n(d[St])
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
function Mt(e, t) {
  return !Array.isArray(e) || e.length < an ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((n) => n == null || typeof n == "string") ? e.some((n) => typeof n == "string" && ln.test(n)) ? un(e, t) : { values: e, options: t } : { values: e, options: t };
}
function dn() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(n, o, s) {
      const [r, i] = o, c = Mt(r, i);
      return Reflect.construct(n, [c.values, c.options], s);
    },
    apply(n, o, s) {
      const [r, i] = s, c = Mt(r, i);
      return n.call(o, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const A = 20, It = 6, pn = 6;
let H = /* @__PURE__ */ new Map();
function Rt(e, t) {
  const n = document.createElement("div");
  return n.className = "comfort-group-btn " + t, n.textContent = e, n.style.position = "fixed", n.style.display = "none", n.style.pointerEvents = "auto", n.style.zIndex = "100", n;
}
function fn(e) {
  let t = H.get(e);
  if (t) return t;
  const n = Rt("M", "comfort-btn-mute"), o = Rt("B", "comfort-btn-byp");
  return n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), Ot(e, "mute");
  }), o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), Ot(e, "bypass");
  }), t = { group: e, mute: n, byp: o }, H.set(e, t), document.body.appendChild(n), document.body.appendChild(o), t;
}
function At(e, t, n, o) {
  e.style.left = `${t}px`, e.style.top = `${n}px`, e.style.width = `${A * o}px`, e.style.height = `${A * o}px`, e.style.fontSize = `${Math.max(9, A * o * 0.5)}px`;
}
function hn(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function mn() {
  const e = x.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const o = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (l) => o.left + (l + r[0]) * s, c = (l) => o.top + (l + r[1]) * s, u = t._groups || [], a = /* @__PURE__ */ new Set();
  for (const l of u)
    (e.selected_group === l || hn(l, e.mouse)) && a.add(l);
  for (const l of a) {
    const d = fn(l), p = l.pos[0] + l.size[0] - It - A, f = l.pos[1] + It;
    At(d.mute, i(p - pn - A), c(f), s), At(d.byp, i(p), c(f), s), d.mute.style.display = "block", d.byp.style.display = "block";
  }
  for (const [l, d] of H)
    a.has(l) || (d.mute.style.display = "none", d.byp.style.display = "none"), u.includes(l) || (d.mute.remove(), d.byp.remove(), H.delete(l));
}
function Ot(e, t) {
  var u;
  const n = B(e);
  if (!n.length) return;
  const o = n.every((a) => a.mode === E), s = n.every((a) => a.mode === k), r = x.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const a = o ? v : E;
      n.forEach((l) => l.mode = a);
    } else {
      const a = s ? v : k;
      n.forEach((l) => l.mode = a);
    }
  } catch (a) {
    console.warn("[comfort] group toggle failed", a);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = x.canvas;
  (u = c == null ? void 0 : c.setDirty) == null || u.call(c, !0, !0);
}
function gn() {
  const e = x.canvas;
  if (!e || e.__comfortGroupTogglesInstalled) return;
  e.__comfortGroupTogglesInstalled = !0;
  const t = e.onDrawForeground;
  e.onDrawForeground = function(n, ...o) {
    t == null || t.call(this, n, ...o);
    try {
      mn();
    } catch (s) {
      console.warn("[comfort] group toggles update failed", s);
    }
  };
}
const z = "Any Router (comfort)", yn = 4, bn = 5;
function O(e) {
  return (e.inputs || []).filter((t) => t && t.name && t.name.startsWith("any_"));
}
function Kt(e) {
  var t;
  return (e == null ? void 0 : e.type) === z || (e == null ? void 0 : e.comfyClass) === z || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === z;
}
function st(e) {
  const t = O(e).length + 1;
  return "any_" + String(t).padStart(2, "0");
}
function xn(e) {
  const t = (e.widgets || []).find((n) => n.name === "selection");
  return t && t.value === "active_source" ? "active_source" : "non_empty";
}
function wn(e, t, n) {
  var c, u;
  const o = e.graph || x.graph;
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
function vn(e) {
  const t = e.inputs || [];
  for (let n = 0; n < t.length; n++) {
    if (t[n].link == null) continue;
    const o = wn(e, "input", n);
    if (o && o !== "*") return o;
  }
  return "*";
}
function Jt(e) {
  if (e.removed || !e.inputs) return;
  let t = O(e).length;
  for (; t > yn; ) {
    const s = e.inputs[e.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      e.removeInput(e.inputs.length - 1), t--;
    else
      break;
  }
  const n = e.inputs[e.inputs.length - 1];
  (!n || !n.name.startsWith("any_") || n.link != null) && e.addInput(st(e), "*");
  const o = vn(e);
  for (const s of O(e)) s.type = o;
  for (const s of e.outputs || [])
    s.type = o, s.label = String(o);
}
const q = /* @__PURE__ */ new WeakMap();
function En(e) {
  const t = q.get(e);
  t != null && window.clearTimeout(t), q.set(
    e,
    window.setTimeout(() => {
      q.delete(e), e.removed || Jt(e);
    }, 64)
  );
}
function Cn(e) {
  if (!e || e.__comfortAnyRouter) return;
  e.__comfortAnyRouter = !0, e.prototype.stabilizeComfortAnyRouter = function() {
    Jt(this);
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
        this.addInput(st(this), "*");
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
      En(this);
    } catch {
    }
    return s;
  };
}
function Nn(e) {
  let t = 0;
  for (; O(e).length < bn && t++ < 24; )
    e.addInput(st(e), "*");
  kn();
}
function _n(e) {
  return !!e && e.mode !== E && e.mode !== k;
}
function Tt(e) {
  if (!e || typeof e != "object") return;
  const t = e.output, n = x.graph;
  if (!(!t || !n || !n.nodes))
    for (const o of n.nodes) {
      if (!Kt(o) || o.mode === E || o.mode === k || xn(o) !== "active_source") continue;
      const s = t[o.id];
      if (!s || !s.inputs) continue;
      const r = o.inputs || [];
      let i = null;
      for (let c = 0; c < r.length; c++) {
        const u = o.getInputNode ? o.getInputNode(c) : null;
        if (_n(u)) {
          i = r[c].name;
          break;
        }
      }
      for (const c of Object.keys(s.inputs))
        c.startsWith("any_") && c !== i && delete s.inputs[c];
    }
}
let Lt = !1;
function kn() {
  if (Lt) return;
  Lt = !0;
  const e = x, t = e.graphToPrompt;
  typeof t == "function" && (e.graphToPrompt = function(...n) {
    const o = t.apply(e, n);
    return o && typeof o.then == "function" ? o.then(
      (s) => (Tt(s), s),
      (s) => {
        throw s;
      }
    ) : (Tt(o), o);
  });
}
const U = "Image Comparer (comfort)", K = 512;
function Sn(e) {
  var t;
  return (e == null ? void 0 : e.type) === U || (e == null ? void 0 : e.comfyClass) === U || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === U;
}
const Z = /* @__PURE__ */ new WeakMap();
function Pt(e) {
  var s, r;
  const t = new URLSearchParams({
    filename: e.filename,
    type: e.type,
    subfolder: e.subfolder
  }), n = x;
  let o;
  try {
    o = ((r = (s = n == null ? void 0 : n.api) == null ? void 0 : s.apiURL) == null ? void 0 : r.call(s, `/view?${t.toString()}`)) ?? `/view?${t.toString()}`;
  } catch {
    o = `/view?${t.toString()}`;
  }
  return typeof (n == null ? void 0 : n.getPreviewFormatParam) == "function" && (o += n.getPreviewFormatParam()), typeof (n == null ? void 0 : n.getRandParam) == "function" && (o += n.getRandParam()), o;
}
function Zt(e, t) {
  e.handle.style.left = `${t}%`, e.leftImg.style.clipPath = `inset(0 ${100 - t}% 0 0)`;
}
function Mn(e) {
  e.navEl.innerHTML = "";
  const t = [
    {
      label: "LEFT",
      count: e.leftUrls.length,
      idx: () => e.leftIdx,
      set: (n) => {
        e.leftIdx = n, e.leftImg.src = e.leftUrls[n] || "";
      }
    },
    {
      label: "RIGHT",
      count: e.rightUrls.length,
      idx: () => e.rightIdx,
      set: (n) => {
        e.rightIdx = n, e.rightImg.src = e.rightUrls[n] || "";
      }
    }
  ];
  for (const n of t) {
    if (n.count <= 1) continue;
    const o = document.createElement("span");
    o.className = "ci-nav-side";
    const s = document.createElement("button");
    s.type = "button", s.textContent = "‹", s.addEventListener("click", () => n.set(Math.max(0, n.idx() - 1)));
    const r = document.createElement("span");
    r.textContent = `${n.label} ${n.idx() + 1}/${n.count}`;
    const i = document.createElement("button");
    i.type = "button", i.textContent = "›", i.addEventListener("click", () => n.set(Math.min(n.count - 1, n.idx() + 1))), o.appendChild(s), o.appendChild(r), o.appendChild(i), e.navEl.appendChild(o);
  }
}
function In(e, t, n) {
  e.leftUrls = t, e.rightUrls = n, e.leftIdx >= e.leftUrls.length && (e.leftIdx = 0), e.rightIdx >= e.rightUrls.length && (e.rightIdx = 0);
  const o = e.leftUrls.length > 0, s = e.rightUrls.length > 0;
  e.leftImg.src = o ? e.leftUrls[e.leftIdx] : "", e.rightImg.src = s ? e.rightUrls[e.rightIdx] : "", e.leftImg.style.display = o ? "" : "none", e.rightImg.style.display = s ? "" : "none";
  const r = o && s;
  e.handle.style.display = r ? "" : "none", e.leftImg.style.clipPath = r ? "" : "none", e.empty.style.display = o || s ? "none" : "", Zt(e, 50), Mn(e);
}
function Rn(e, t) {
  const n = Z.get(e);
  if (!n) return;
  const o = t || {}, s = Array.isArray(o.left_images) ? o.left_images.map(Pt) : [], r = Array.isArray(o.right_images) ? o.right_images.map(Pt) : [];
  In(n, s, r);
}
function An(e) {
  var f, h, m;
  if (Z.has(e)) return;
  const t = document.createElement("div");
  t.className = "comfort-image-comparer";
  const n = document.createElement("div");
  n.className = "ci-nav", t.appendChild(n);
  const o = document.createElement("div");
  o.className = "ci-stage";
  const s = document.createElement("img");
  s.className = "ci-img ci-right", s.draggable = !1;
  const r = document.createElement("img");
  r.className = "ci-img ci-left", r.draggable = !1;
  const i = document.createElement("div");
  i.className = "ci-handle";
  const c = document.createElement("div");
  c.className = "ci-empty", c.textContent = "Connect images and run", o.appendChild(s), o.appendChild(r), o.appendChild(i), o.appendChild(c), t.appendChild(o);
  const u = {
    el: t,
    stage: o,
    leftImg: r,
    rightImg: s,
    handle: i,
    empty: c,
    navEl: n,
    leftUrls: [],
    rightUrls: [],
    leftIdx: 0,
    rightIdx: 0
  };
  Z.set(e, u), o.addEventListener("mousemove", (g) => {
    const y = o.getBoundingClientRect();
    if (y.width <= 0) return;
    const w = Math.max(0, Math.min(100, (g.clientX - y.left) / y.width * 100));
    Zt(u, w);
  });
  const a = 488, l = 24, d = (g) => {
    const y = t.parentElement;
    y && (y.style.width = g + "px"), o && (o.style.width = Math.max(0, g - l) + "px");
  };
  (f = e.setSize) == null || f.call(e, [K, a]), typeof e.addDOMWidget == "function" && e.addDOMWidget("compare", "comfort_image_compare", t, {
    serialize: !1,
    hideOnZoom: !0,
    getMinHeight: () => a,
    getMaxHeight: () => a
  }), e.minHeight = a;
  const p = (h = e.setSize) == null ? void 0 : h.bind(e);
  p && (e.setSize = (g, y) => {
    let w;
    Array.isArray(g) ? w = g[0] : w = g, typeof w == "number" && isFinite(w) && (w = Math.max(e.minWidth || 0, w));
    const G = p([w, a]);
    return d(w), G;
  }), (m = e.setSize) == null || m.call(e, [K, a]), d(K), setTimeout(() => {
    e.graph && e.size && d(e.size[0]);
  }, 1500);
}
function On(e) {
  if (!e || e.__comfortImageComparer) return;
  const t = e.prototype.onExecuted;
  e.prototype.onExecuted = function(n) {
    t == null || t.call(this, n), Rn(this, n);
  }, e.__comfortImageComparer = !0;
}
const Tn = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-ninfer{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}.comfort-ninfer-url,.comfort-ninfer-timeout{width:100%;box-sizing:border-box;padding:4px 6px;font-size:12px;font-family:inherit;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-ninfer-status{display:flex;align-items:center;gap:6px;min-height:18px;padding:2px;font-size:11px;opacity:.9}.comfort-ninfer-status-text{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-ninfer-ctrl{flex:0 0 auto;padding:1px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-ninfer-ctrl:hover{background:#7f7f7f33}.comfort-ninfer-bulk{display:flex;gap:6px}.comfort-bulk{flex:1 1 auto;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-bulk:hover{background:#7f7f7f33}.comfort-ninfer-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-ninfer-row.off .comfort-node-title{opacity:.5}.comfort-ninfer-row input[type=checkbox]{margin:0;cursor:pointer}.comfort-ninfer-badge{padding:1px 6px;border-radius:8px;font-size:10px;background:#7f7f7f40}.comfort-ninfer-badge.loaded{background:#7d2e2e;color:#fff}.comfort-ninfer-badge.suspended{background:#2e5d7d;color:#fff}.comfort-ninfer-badge.other{opacity:.7}.comfort-topbar-focus{padding:3px 8px;margin-left:6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-topbar-focus:hover{background:#7f7f7f33}.comfort-image-comparer{display:flex;flex-direction:column;width:100%}.ci-nav{min-height:28px;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;height:440px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}", rt = document.createElement("style");
rt.setAttribute("data-comfort-plugin", "true");
rt.textContent = Tn;
document.head.appendChild(rt);
sn();
dn();
x.registerExtension({
  name: "comfort.PowerLoraLoader",
  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    gn(), Je();
  },
  // ComfyUI auto-creates a class for every server-backed node def. For the Any
  // Router we replace its behavior in place (it has no fixed connection inputs
  // in the def; we add the dynamic `any_*` inputs and manage them).
  beforeRegisterNodeDef(e, t) {
    t && t.name === z && Cn(e), t && t.name === U && On(e);
  },
  nodeCreated(e) {
    if (ct(e)) {
      ue(e);
      return;
    }
    if (Kt(e)) {
      Nn(e);
      return;
    }
    Sn(e) && An(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (ct(e)) {
      const t = ne(e);
      if (t) {
        const n = (o) => {
          t.showSeparate = o, ie(e);
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
    if (rn(e)) {
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
    if (cn(e)) {
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
  W as NODE_NAME
};
