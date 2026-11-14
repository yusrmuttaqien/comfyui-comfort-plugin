import { app as E } from "/scripts/app.js";
const D = "Power Lora Loader (comfort)", P = /* @__PURE__ */ new WeakMap(), Ut = 32, Dt = 36, Gt = 34, tt = 14, Ht = 380;
function et(t) {
  var e;
  return (t == null ? void 0 : t.type) === D || (t == null ? void 0 : t.comfyClass) === D || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === D;
}
function Bt(t) {
  return P.get(t);
}
function $(t) {
  return tt + Ut + t.rows.length * Dt + Gt + tt;
}
function N(t, e) {
  var r;
  if (!t.size) return;
  const o = $(e), n = Math.max(t.size[0] || 0, Ht);
  (t.size[1] !== o || t.size[0] !== n) && ((r = t.setSize) == null || r.call(t, [n, o]));
}
function Wt(t) {
  return { lora: t ?? null, on: !0, strength: 1, strengthTwo: null };
}
function vt(t) {
  let e = !0, o = !0;
  for (const n of t.rows)
    if (e = e && n.on === !0, o = o && n.on === !1, !e && !o) return null;
  return !!(e && t.rows.length > 0);
}
function $t(t) {
  const e = !vt(t);
  for (const o of t.rows) o.on = e;
}
function ot(t, e, o) {
  const n = o ? "strengthTwo" : "strength", r = t[n] ?? 1;
  t[n] = Math.round((r + e * 0.05) * 100) / 100;
}
function Ct(t, e) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (t ? "on" : "off"), o.textContent = e, o;
}
function G(t) {
  const e = document.createElement("span");
  return e.className = "comfort-col-label", e.textContent = t, e;
}
function H(t, e) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (e === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(e === "two" ? t.strengthTwo ?? 1 : t.strength), s.title = e === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(s), o.appendChild(r), o;
}
function jt(t, e, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (e.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(Ct(e.on, e.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = e.lora || "None", r.title = e.lora || "No lora selected — click to choose", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", n.appendChild(s), t.showSeparate ? (n.appendChild(H(e, "one")), n.appendChild(H(e, "two"))) : n.appendChild(H(e, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function g(t) {
  const e = t.el;
  e.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = vt(t), r = Ct(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", t.showSeparate ? (s.appendChild(G("Model")), s.appendChild(G("Clip"))) : s.appendChild(G("Strength")), o.appendChild(s), e.appendChild(o), t.rows.forEach((u, l) => e.appendChild(jt(t, u, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), e.appendChild(i);
}
function Yt(t) {
  const e = P.get(t);
  e && (g(e), N(t, e));
}
async function Vt() {
  try {
    const t = await fetch("/api/models/loras");
    if (!t.ok) return [];
    const e = await t.json();
    return Array.isArray(e) ? e : (e == null ? void 0 : e.name) ?? [];
  } catch {
    return [];
  }
}
async function nt(t, e, o, n) {
  const r = await Vt() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: o,
    className: "dark",
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function qt(t, e, o, n) {
  const r = e.rows[o];
  if (!r) return;
  const s = o > 0, i = o < e.rows.length - 1, c = (u) => {
    const l = o + u;
    if (l < 0 || l >= e.rows.length) return;
    const a = e.rows[o];
    e.rows[o] = e.rows[l], e.rows[l] = a, g(e);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${r.on ? "⚫" : "◯"} Toggle ${r.on ? "Off" : "On"}`,
        callback: () => {
          r.on = !r.on, g(e);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !s, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          e.rows.splice(o, 1), g(e), N(t, e);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function Kt(t, e) {
  const o = e.el;
  o.addEventListener("click", (n) => {
    const r = n.target;
    if (r.closest(".comfort-toggle-all")) {
      $t(e), g(e);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      nt(e, t, n, (l) => {
        e.rows.push(Wt(l)), g(e), N(t, e);
      });
      return;
    }
    const s = r.closest(".comfort-lora-row");
    if (!s) return;
    const i = Number(s.dataset.idx), c = e.rows[i];
    if (!c) return;
    const u = !!r.closest(".comfort-strength-clip");
    if (r.closest(".comfort-toggle")) {
      c.on = !c.on, g(e);
      return;
    }
    if (r.closest(".comfort-name")) {
      nt(e, t, n, (l) => {
        c.lora = l, g(e);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      ot(c, -1, u), g(e);
      return;
    }
    if (r.closest(".comfort-inc")) {
      ot(c, 1, u), g(e);
      return;
    }
    if (r.closest(".comfort-remove")) {
      e.rows.splice(i, 1), g(e), N(t, e);
      return;
    }
  }), o.addEventListener("change", (n) => {
    const r = n.target, s = r.closest(".comfort-lora-row");
    if (!s || !r.matches("input[type='number']")) return;
    const i = e.rows[Number(s.dataset.idx)];
    if (!i) return;
    const c = parseFloat(r.value);
    Number.isFinite(c) && (r.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), o.addEventListener("contextmenu", (n) => {
    const r = n.target.closest(".comfort-lora-row");
    r && (n.preventDefault(), n.stopPropagation(), qt(t, e, Number(r.dataset.idx), n));
  });
}
function Zt(t) {
  if (P.has(t)) return;
  const e = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  e.el.className = "comfort-lora-list", P.set(t, e), t.serialize_widgets = !0, typeof t.addDOMWidget == "function" && t.addDOMWidget("loras", "comfort_lora_list", e.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => e.rows,
    setValue: (o) => {
      e.rows = Array.isArray(o) ? o : [], g(e), N(t, e);
    },
    getMinHeight: () => $(e),
    getMaxHeight: () => $(e)
  }), Kt(t, e), g(e), N(t, e);
}
function Jt(t, e) {
  let o = Object.getPrototypeOf(t);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, e);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class Nt extends LGraphNode {
  constructor(e) {
    super(e), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
  installModeInterceptor() {
    const e = Jt(this, "mode"), o = () => e != null && e.get ? e.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: o,
      set: (n) => {
        const r = o();
        e != null && e.set ? e.set.call(this, n) : this.__comfort_mode = n, r !== n && this.onModeChange(r, n);
      }
    });
  }
  configure(e) {
    this.configuring = !0, super.configure(e), this.configuring = !1;
  }
  onModeChange(e, o) {
  }
  getHelp() {
    return "";
  }
  onRemoved() {
    var e;
    (e = super.onRemoved) == null || e.call(this), this.removed = !0;
  }
}
const y = 0, w = 2, _ = 4;
function x(t, e) {
  var n;
  if (Array.isArray(t)) {
    for (const r of t) x(r, e);
    return;
  }
  if (!t) return;
  try {
    t.mode = e;
  } catch {
  }
  const o = (n = t.subgraph) == null ? void 0 : n.nodes;
  if (Array.isArray(o))
    for (const r of o) x(r, e);
}
function rt(t) {
  var o;
  const e = (t == null ? void 0 : t.type) || ((o = t == null ? void 0 : t.constructor) == null ? void 0 : o.type) || "";
  return e.includes("Reroute") || e.includes("Node Collector") || e.includes("Node Combiner");
}
function Mt(t, e, o) {
  var c, u, l, a;
  const n = t.graph;
  if (!n) return [];
  const r = [], s = /* @__PURE__ */ new Set(), i = (f) => {
    if (!f || s.has(f)) return;
    s.add(f);
    let d;
    e === "OUTPUT" ? d = (f.outputs || []).flatMap((p) => p.links || []) : d = (f.inputs || []).map((p) => p.link);
    for (const p of d) {
      if (p == null) continue;
      const h = n.links[p];
      if (!h) continue;
      const m = e === "OUTPUT" ? h.target_id : h.origin_id, b = n.getNodeById(m);
      !b || s.has(b) || (rt(b) ? i(b) : r.push(b));
    }
  };
  if (o != null) {
    const f = e === "OUTPUT" ? ((u = (c = t.outputs) == null ? void 0 : c[o]) == null ? void 0 : u.links) || [] : [(a = (l = t.inputs) == null ? void 0 : l[o]) == null ? void 0 : a.link];
    for (const d of f) {
      if (d == null) continue;
      const p = n.links[d];
      if (!p) continue;
      const h = e === "OUTPUT" ? p.target_id : p.origin_id, m = n.getNodeById(h);
      !m || s.has(m) || (rt(m) ? i(m) : r.push(m));
    }
  } else
    i(t);
  return r;
}
function C(t, e) {
  return Mt(t, "INPUT", e);
}
function st(t, e) {
  return Mt(t, "OUTPUT", e);
}
function U(t) {
  if (t != null && t.graph && typeof t.recomputeInsideNodes == "function")
    try {
      t.recomputeInsideNodes();
    } catch {
    }
  const e = t == null ? void 0 : t._children;
  return e ? Array.from(e).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function Qt(t) {
  var c, u, l, a, f, d, p, h;
  const e = t.graph;
  if (!e) return null;
  const o = e._groups || e.groups || [], n = ((c = t.pos) == null ? void 0 : c[0]) ?? 0, r = ((u = t.pos) == null ? void 0 : u[1]) ?? 0, s = ((l = t.size) == null ? void 0 : l[0]) ?? 0, i = ((a = t.size) == null ? void 0 : a[1]) ?? 0;
  for (const m of o) {
    const b = ((f = m.pos) == null ? void 0 : f[0]) ?? 0, O = ((d = m.pos) == null ? void 0 : d[1]) ?? 0, zt = ((p = m.size) == null ? void 0 : p[0]) ?? 0, Ft = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= b && r >= O && n + s <= b + zt && r + i <= O + Ft)
      return m;
  }
  return null;
}
class R extends Nt {
  constructor(e) {
    super(e), this.addInput("", "*");
  }
  onConnectedNodesChanged(e) {
  }
  onConnectionsChange(e, o, n, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, e, o, n, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(C(this));
  }
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const r = C(this, o)[0], s = (r == null ? void 0 : r.title) || "";
        n.name !== s && (n.name = s);
      }
    }
    const e = this.inputs[this.inputs.length - 1];
    (!e || e.link != null) && this.addInput("", "*");
  }
}
const Xt = 34, te = 10;
function kt(t, e, o) {
  if (t.innerHTML = "", !e.length) {
    const n = document.createElement("div");
    n.className = "comfort-node-empty", n.textContent = o, t.appendChild(n);
    return;
  }
  e.forEach((n, r) => {
    const s = document.createElement("div");
    s.className = "comfort-node-row" + (n.on ? "" : " off"), s.dataset.idx = String(r);
    const i = document.createElement("button");
    i.type = "button", i.className = "comfort-toggle " + (n.on ? "on" : "off"), i.textContent = n.on ? "ON" : "OFF", s.appendChild(i);
    const c = document.createElement("span");
    c.className = "comfort-node-title", c.textContent = n.title, c.title = n.title, s.appendChild(c), t.appendChild(s);
  });
}
function Rt(t, e, o) {
  var s;
  if (!t.size) return;
  const n = te * 2 + e * Xt, r = Math.max(t.size[0] || 0, o);
  (t.size[1] !== n || t.size[0] !== r) && ((s = t.setSize) == null || s.call(t, [r, n]));
}
const ee = 260;
class Ot extends R {
  constructor(e) {
    super(e), this.listEl = null, this.rows = [], this.setupListWidget();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("nodes", "comfort_node_list", this.listEl, {
      serialize: !0,
      hideOnZoom: !0,
      getValue: () => this.rows.map((e) => ({ title: e.title, on: e.on })),
      setValue: () => {
      }
    }), this.bindListEvents(), this.renderList();
  }
  renderList() {
    const e = this.listEl;
    e && (kt(e, this.rows, "Connect nodes to control them"), Rt(this, this.rows.length, ee));
  }
  bindListEvents() {
    const e = this.listEl;
    e && e.addEventListener("click", (o) => {
      const r = o.target.closest(".comfort-node-row");
      if (!r) return;
      const s = Number(r.dataset.idx), i = this.rows[s];
      i && (i.on = !i.on, this.applyRowMode(i), this.renderList());
    });
  }
  /** Subclass hook: change the connected node's mode to match row.on. */
  applyRowMode(e) {
    if (e.node)
      try {
        e.node.mode = e.on ? this.modeOn : this.modeOff;
      } catch {
      }
  }
  /** Rebuild rows from live connections. Called on connect/disconnect/load. */
  syncRows() {
    const e = C(this), o = [];
    for (const n of e) {
      const r = n.title || n.type || "node", s = this.rows.find((c) => c.node === n), i = s ? s.on : n.mode === this.modeOn;
      o.push({ node: n, title: r, on: i });
    }
    this.rows = o, this.renderList();
  }
  /** Called by the fan-in base whenever the connected-node set changes. */
  onConnectedNodesChanged(e) {
    this.syncRows();
  }
  /** Bulk actions: set every row on, off, or toggle each one. */
  setAllRows(e) {
    for (const o of this.rows)
      o.on = e === null ? !o.on : e, this.applyRowMode(o);
    this.renderList();
  }
}
const V = "Fast Muter (comfort)", q = "Fast Bypasser (comfort)";
class oe extends Ot {
  constructor() {
    super(V), this.modeOn = y, this.modeOff = w;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class ne extends Ot {
  constructor() {
    super(q), this.modeOn = y, this.modeOff = _;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const re = oe, se = ne, At = "Node Collector (comfort)";
class ie extends R {
  constructor() {
    super(At), this.addOutput("Output", "*");
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ce = ie, K = "Mute / Bypass Repeater (comfort)";
class le extends R {
  constructor() {
    super(K), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }
  onConnectedNodesChanged(e) {
    if (this.configuring) return;
    const o = e;
    for (const n of o)
      n.mode !== this.mode && x(n, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(e, o) {
    if (this.configuring) return;
    const n = C(this);
    if (n.length) {
      for (const s of n) x(s, o);
      return;
    }
    const r = Qt(this);
    if (r)
      for (const s of U(r))
        s !== this && x(s, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const ae = le;
function B(t) {
  return (t == null ? void 0 : t.type) === K;
}
const ue = 500;
class fe {
  constructor() {
    this.timer = null, this.counter = 0, this.jobs = /* @__PURE__ */ new Map();
  }
  schedule(e, o) {
    this.jobs.set(e, Math.max(1, o)), this.ensureTimer();
  }
  unschedule(e) {
    this.jobs.delete(e), this.jobs.size || this.stopTimer();
  }
  ensureTimer() {
    this.timer == null && (this.timer = window.setInterval(() => this.tick(), ue));
  }
  stopTimer() {
    this.timer != null && (window.clearInterval(this.timer), this.timer = null);
  }
  tick() {
    this.counter = (this.counter + 1) % 1e6;
    for (const [e, o] of this.jobs)
      if (this.counter % o === 0)
        try {
          e();
        } catch {
        }
  }
}
const T = new fe(), It = "Mode Relay (comfort)", pe = {
  ACTIVE: y,
  MUTE: w,
  BYPASS: _,
  NOTHING: -99
}, de = {
  [w]: "on_muted_inputs",
  [_]: "on_bypassed_inputs",
  [y]: "on_any_active_inputs"
};
class he extends R {
  constructor() {
    super(It), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), ct.register(this);
  }
  onConnectedNodesChanged(e) {
    this.evaluate();
  }
  onModeChange(e, o) {
    if (super.onModeChange(e, o), this.configuring || C(this).length) return;
    const r = st(this).filter(B);
    for (const s of r)
      s.mode !== o && x(s, o);
  }
  onConnectOutput(e, o, n, r, s) {
    return r ? B(r) : !0;
  }
  evaluate() {
    var c;
    if (this.configuring) return;
    const e = C(this);
    let o;
    for (const u of e) {
      const l = u.mode;
      if (o === void 0) o = l;
      else {
        if (o === l && (l === w || l === _)) continue;
        l === y || o === y ? o = y : o = void 0;
      }
    }
    if (o === void 0) return;
    const n = de[o], r = n ? pe[String((c = this.properties) == null ? void 0 : c[n])] : o, s = r !== void 0 ? r : o;
    if (s === -99) return;
    const i = st(this).filter(B);
    for (const u of i)
      u.mode !== s && x(u, s);
  }
  getHelp() {
    return `<p>Watches the mode of the nodes connected to its inputs and drives
a connected <b>Repeater</b> with the result: all inputs muted → MUTE, all
bypassed → BYPASS, any active → ACTIVE. Set the <code>on_muted_inputs</code>,
<code>on_bypassed_inputs</code> and <code>on_any_active_inputs</code>
properties to remap or suppress (NOTHING) each signal.</p>`;
  }
  onRemoved() {
    var e;
    ct.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const A = /* @__PURE__ */ new Set(), it = () => {
  for (const t of A)
    try {
      t.evaluate();
    } catch {
    }
}, ct = {
  register(t) {
    A.add(t), T.schedule(it, 1);
  },
  unregister(t) {
    A.delete(t), A.size || T.unschedule(it);
  }
}, me = he, St = "Random Unmuter (comfort)";
class ge extends R {
  constructor() {
    super(St), this.tempEnabled = null, lt.register(this);
  }
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const e = C(this);
    if (!e.length || !e.every((r) => r.mode === w)) return;
    const n = e[Math.floor(Math.random() * e.length)];
    n && (x(n, y), this.tempEnabled = n);
  }
  onPromptEnd() {
    this.tempEnabled && (x(this.tempEnabled, w), this.tempEnabled = null);
  }
  getHelp() {
    return `<p>Each time a prompt is queued, this node temporarily unmutes one
randomly-chosen connected node (which must be muted) for the duration of the
prompt, then mutes it back. All connected nodes must be muted for it to act.
Tip: connect a Repeater's output to this node's input to randomly unmute a whole
group.</p>`;
  }
  onRemoved() {
    var e;
    lt.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
const z = /* @__PURE__ */ new Set(), lt = {
  register(t) {
    z.add(t), ye();
  },
  unregister(t) {
    z.delete(t);
  }
};
let at = !1;
function ye() {
  if (at) return;
  at = !0;
  const t = E, e = t.queuePrompt;
  let o = !1;
  t.queuePrompt = async function(...r) {
    o = !0;
    try {
      return await e.apply(t, r);
    } finally {
      o = !1;
    }
  };
  const n = t.graphToPrompt;
  t.graphToPrompt = function(...r) {
    if (o)
      for (const c of z)
        try {
          c.onPromptStart();
        } catch {
        }
    const s = n.apply(t, r), i = () => {
      for (const c of z)
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
const be = ge, Z = "Fast Groups Muter (comfort)", J = "Fast Groups Bypasser (comfort)", we = 280;
function xe(t) {
  const e = t.graph;
  if (!e) return [];
  const o = /* @__PURE__ */ new Set(), n = [], r = (s) => {
    var i;
    if (!(!s || o.has(s))) {
      o.add(s);
      for (const c of s._groups || s.groups || []) n.push(c);
      for (const c of s._subgraphs || []) r(c);
      for (const c of s._nodes || [])
        (i = c.subgraph) != null && i._groups && r(c.subgraph);
    }
  };
  return r(e), n.sort((s, i) => {
    var f, d, p, h;
    const c = ((f = s.pos) == null ? void 0 : f[1]) ?? 0, u = ((d = i.pos) == null ? void 0 : d[1]) ?? 0;
    if (c !== u) return c - u;
    const l = ((p = s.pos) == null ? void 0 : p[0]) ?? 0, a = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return l !== a ? l - a : String(s.title || "").localeCompare(String(i.title || ""));
  }), n;
}
function Ee(t) {
  return U(t).some((e) => e.mode === y);
}
class Lt extends Nt {
  constructor(e) {
    super(e), this.modeOn = y, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), ft.register(this);
  }
  onAdded() {
    var e;
    (e = super.onAdded) == null || e.call(this), this.refresh();
  }
  setupListWidget() {
    this.listEl = document.createElement("div"), this.listEl.className = "comfort-node-list", typeof this.addDOMWidget == "function" && this.addDOMWidget("groups", "comfort_group_list", this.listEl, {
      serialize: !1,
      hideOnZoom: !0,
      getValue: () => this.rows.map((e) => ({ title: e.title, on: e.on })),
      setValue: () => {
      }
    }), this.listEl.addEventListener("click", (e) => {
      const n = e.target.closest(".comfort-node-row");
      if (!n) return;
      const r = this.rows[Number(n.dataset.idx)];
      r && (this.applyGroupMode(r, !r.on), this.refresh());
    }), this.refresh();
  }
  applyGroupMode(e, o) {
    const n = U(e.group);
    x(n, o ? this.modeOn : this.modeOff);
  }
  refresh() {
    var s;
    const e = xe(this), o = String(((s = this.properties) == null ? void 0 : s.matchTitle) || "").trim();
    let n = e.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: Ee(i)
    }));
    if (o)
      try {
        const i = new RegExp(o, "i");
        n = n.filter((c) => i.test(c.title));
      } catch {
        n = n.filter((i) => i.title.toLowerCase().includes(o.toLowerCase()));
      }
    const r = n.map((i) => i.title + (i.on ? 1 : 0)).join("|");
    r !== this.lastKey && (this.lastKey = r, this.rows = n, this.renderList());
  }
  renderList() {
    const e = this.listEl;
    e && (kt(e, this.rows, "No groups in this workflow"), Rt(this, this.rows.length, we));
  }
  setAllGroups(e) {
    for (const o of this.rows) {
      const n = e === null ? !o.on : e;
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
    var e;
    ft.unregister(this), (e = super.onRemoved) == null || e.call(this);
  }
}
class _e extends Lt {
  constructor() {
    super(Z), this.modeOff = w;
  }
}
class ve extends Lt {
  constructor() {
    super(J), this.modeOff = _;
  }
}
const I = /* @__PURE__ */ new Set(), ut = () => {
  for (const t of I)
    try {
      t.refresh();
    } catch {
    }
}, ft = {
  register(t) {
    I.add(t), T.schedule(ut, 2);
  },
  unregister(t) {
    I.delete(t), I.size || T.unschedule(ut);
  }
}, Ce = _e, Ne = ve, pt = /* @__PURE__ */ new Set();
function v(t, e) {
  pt.has(t) || (pt.add(t), e.category = "comfort", LiteGraph.registerNodeType(t, e));
}
function Me() {
  v(V, re), v(q, se), v(At, ce), v(K, ae), v(It, me), v(St, be), v(Z, Ce), v(J, Ne);
}
function ke(t) {
  return (t == null ? void 0 : t.type) === V || (t == null ? void 0 : t.type) === q;
}
function Re(t) {
  return (t == null ? void 0 : t.type) === Z || (t == null ? void 0 : t.type) === J;
}
const Oe = 10, Ae = /[/\\]/, dt = "__comfort_original";
function Ie(t, e) {
  const o = e == null ? void 0 : e.callback, n = /* @__PURE__ */ new Map(), r = [];
  for (const l of t) {
    if (l == null) {
      r.push(l);
      continue;
    }
    const a = String(l), f = a.indexOf("/") > -1 ? "/" : "\\", d = a.indexOf(f);
    if (d > -1) {
      const p = a.slice(0, d), h = a.slice(d + 1);
      n.has(p) || n.set(p, []), n.get(p).push({ full: a, sub: h });
    } else
      r.push(l);
  }
  const s = (l, a) => ({
    content: a,
    [dt]: l,
    callback: (f) => o == null ? void 0 : o(f[dt])
  }), i = [], c = [...n.keys()].sort((l, a) => l.localeCompare(a));
  for (const l of c) {
    const a = n.get(l).map((f) => s(f.full, f.sub));
    i.push({
      content: `📁 ${l}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: a }
    });
  }
  for (const l of r)
    typeof l == "string" ? i.push(s(l, l)) : i.push(l);
  const u = Object.assign({}, e);
  return u.callback = void 0, { values: i, options: u };
}
function ht(t, e) {
  return !Array.isArray(t) || t.length < Oe ? { values: t, options: e } : (e == null ? void 0 : e.className) !== "dark" ? { values: t, options: e } : t.every((o) => o == null || typeof o == "string") ? t.some((o) => typeof o == "string" && Ae.test(o)) ? Ie(t, e) : { values: t, options: e } : { values: t, options: e };
}
function Se() {
  const t = LiteGraph.ContextMenu;
  if (!t || t.__comfortAutoNest) return;
  const e = new Proxy(t, {
    construct(o, n, r) {
      const [s, i] = n, c = ht(s, i);
      return Reflect.construct(o, [c.values, c.options], r);
    },
    apply(o, n, r) {
      const [s, i] = r, c = ht(s, i);
      return o.call(n, c.values, c.options);
    }
  });
  e.__comfortAutoNest = !0, LiteGraph.ContextMenu = e;
}
const M = 20, mt = 6, Le = 6;
let F = /* @__PURE__ */ new Map();
function gt(t, e) {
  const o = document.createElement("div");
  return o.className = "comfort-group-btn " + e, o.textContent = t, o.style.position = "fixed", o.style.display = "none", o.style.pointerEvents = "auto", o.style.zIndex = "100", o;
}
function Pe(t) {
  let e = F.get(t);
  if (e) return e;
  const o = gt("M", "comfort-btn-mute"), n = gt("B", "comfort-btn-byp");
  return o.addEventListener("pointerdown", (r) => {
    r.stopPropagation(), r.preventDefault(), bt(t, "mute");
  }), n.addEventListener("pointerdown", (r) => {
    r.stopPropagation(), r.preventDefault(), bt(t, "bypass");
  }), e = { group: t, mute: o, byp: n }, F.set(t, e), document.body.appendChild(o), document.body.appendChild(n), e;
}
function yt(t, e, o, n) {
  t.style.left = `${e}px`, t.style.top = `${o}px`, t.style.width = `${M * n}px`, t.style.height = `${M * n}px`, t.style.fontSize = `${Math.max(9, M * n * 0.5)}px`;
}
function Te(t, e) {
  return !e || e.length < 2 ? !1 : e[0] >= t.pos[0] && e[0] <= t.pos[0] + t.size[0] && e[1] >= t.pos[1] && e[1] <= t.pos[1] + t.size[1];
}
function ze() {
  const t = E.canvas, e = t == null ? void 0 : t.graph;
  if (!e) return;
  const n = t.canvas.getBoundingClientRect(), r = t.ds.scale, s = t.ds.offset, i = (a) => n.left + (a + s[0]) * r, c = (a) => n.top + (a + s[1]) * r, u = e._groups || [], l = /* @__PURE__ */ new Set();
  for (const a of u)
    (t.selected_group === a || Te(a, t.mouse)) && l.add(a);
  for (const a of l) {
    const f = Pe(a), d = a.pos[0] + a.size[0] - mt - M, p = a.pos[1] + mt;
    yt(f.mute, i(d - Le - M), c(p), r), yt(f.byp, i(d), c(p), r), f.mute.style.display = "block", f.byp.style.display = "block";
  }
  for (const [a, f] of F)
    l.has(a) || (f.mute.style.display = "none", f.byp.style.display = "none"), u.includes(a) || (f.mute.remove(), f.byp.remove(), F.delete(a));
}
function bt(t, e) {
  var u;
  const o = U(t);
  if (!o.length) return;
  const n = o.every((l) => l.mode === w), r = o.every((l) => l.mode === _), s = E.graph, i = s == null ? void 0 : s.version;
  try {
    if (e === "mute") {
      const l = n ? y : w;
      o.forEach((a) => a.mode = l);
    } else {
      const l = r ? y : _;
      o.forEach((a) => a.mode = l);
    }
  } catch (l) {
    console.warn("[comfort] group toggle failed", l);
    return;
  }
  s && s.version === i && s.setVersion(s.version + 1);
  const c = E.canvas;
  (u = c == null ? void 0 : c.setDirty) == null || u.call(c, !0, !0);
}
function Fe() {
  const t = E.canvas;
  if (!t || t.__comfortGroupTogglesInstalled) return;
  t.__comfortGroupTogglesInstalled = !0;
  const e = t.onDrawForeground;
  t.onDrawForeground = function(o, ...n) {
    e == null || e.call(this, o, ...n);
    try {
      ze();
    } catch (r) {
      console.warn("[comfort] group toggles update failed", r);
    }
  };
}
const S = "Any Router (comfort)", Ue = 4, De = 5;
function k(t) {
  return (t.inputs || []).filter((e) => e && e.name && e.name.startsWith("any_"));
}
function Pt(t) {
  var e;
  return (t == null ? void 0 : t.type) === S || (t == null ? void 0 : t.comfyClass) === S || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === S;
}
function Q(t) {
  const e = k(t).length + 1;
  return "any_" + String(e).padStart(2, "0");
}
function Ge(t) {
  const e = (t.widgets || []).find((o) => o.name === "selection");
  return e && e.value === "active_source" ? "active_source" : "non_empty";
}
function He(t, e, o) {
  var c, u;
  const n = t.graph || E.graph;
  if (!n) return null;
  let r = t, s = o, i = e;
  for (let l = 0; l < 12; l++) {
    const a = i === "input" ? (c = r.inputs) == null ? void 0 : c[s] : (u = r.outputs) == null ? void 0 : u[s];
    if (!a) return null;
    if (a.type != null && a.type !== "*") return String(a.type);
    const f = i === "input" ? a.link : a.links && a.links[0];
    if (f == null) return null;
    const d = n.links && (n.links.get ? n.links.get(f) : n.links[f]) || null;
    if (!d || (i === "input" ? (r = n.getNodeById(d.origin_id), s = d.origin_slot, i = "output") : (r = n.getNodeById(d.target_id), s = d.target_slot, i = "input"), !r)) return null;
  }
  return null;
}
function Be(t) {
  const e = t.inputs || [];
  for (let o = 0; o < e.length; o++) {
    if (e[o].link == null) continue;
    const n = He(t, "input", o);
    if (n && n !== "*") return n;
  }
  return "*";
}
function Tt(t) {
  if (t.removed || !t.inputs) return;
  let e = k(t).length;
  for (; e > Ue; ) {
    const r = t.inputs[t.inputs.length - 1];
    if (r && r.name.startsWith("any_") && r.link == null)
      t.removeInput(t.inputs.length - 1), e--;
    else
      break;
  }
  const o = t.inputs[t.inputs.length - 1];
  (!o || !o.name.startsWith("any_") || o.link != null) && t.addInput(Q(t), "*");
  const n = Be(t);
  for (const r of k(t)) r.type = n;
  for (const r of t.outputs || [])
    r.type = n, r.label = String(n);
}
const W = /* @__PURE__ */ new WeakMap();
function We(t) {
  const e = W.get(t);
  e != null && window.clearTimeout(e), W.set(
    t,
    window.setTimeout(() => {
      W.delete(t), t.removed || Tt(t);
    }, 64)
  );
}
function $e(t) {
  if (!t || t.__comfortAnyRouter) return;
  t.__comfortAnyRouter = !0, t.prototype.stabilizeComfortAnyRouter = function() {
    Tt(this);
  }, t.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const e = t.prototype.configure;
  t.prototype.configure = function(n) {
    try {
      const s = (n && n.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; k(this).length < s; )
        this.addInput(Q(this), "*");
    } catch {
    }
    const r = e ? e.call(this, n) : void 0;
    try {
      this.removed || this.stabilizeComfortAnyRouter();
    } catch {
    }
    return r;
  };
  const o = t.prototype.onConnectionsChange;
  t.prototype.onConnectionsChange = function(...n) {
    const r = o ? o.apply(this, n) : void 0;
    try {
      We(this);
    } catch {
    }
    return r;
  };
}
function je(t) {
  let e = 0;
  for (; k(t).length < De && e++ < 24; )
    t.addInput(Q(t), "*");
  Ve();
}
function Ye(t) {
  return !!t && t.mode !== w && t.mode !== _;
}
function wt(t) {
  if (!t || typeof t != "object") return;
  const e = t.output, o = E.graph;
  if (!(!e || !o || !o.nodes))
    for (const n of o.nodes) {
      if (!Pt(n) || n.mode === w || n.mode === _ || Ge(n) !== "active_source") continue;
      const r = e[n.id];
      if (!r || !r.inputs) continue;
      const s = n.inputs || [];
      let i = null;
      for (let c = 0; c < s.length; c++) {
        const u = n.getInputNode ? n.getInputNode(c) : null;
        if (Ye(u)) {
          i = s[c].name;
          break;
        }
      }
      for (const c of Object.keys(r.inputs))
        c.startsWith("any_") && c !== i && delete r.inputs[c];
    }
}
let xt = !1;
function Ve() {
  if (xt) return;
  xt = !0;
  const t = E, e = t.graphToPrompt;
  typeof e == "function" && (t.graphToPrompt = function(...o) {
    const n = e.apply(t, o);
    return n && typeof n.then == "function" ? n.then(
      (r) => (wt(r), r),
      (r) => {
        throw r;
      }
    ) : (wt(n), n);
  });
}
const L = "Image Comparer (comfort)", qe = 512, Et = 488;
function Ke(t) {
  var e;
  return (t == null ? void 0 : t.type) === L || (t == null ? void 0 : t.comfyClass) === L || ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.comfyClass) === L;
}
const j = /* @__PURE__ */ new WeakMap();
function _t(t) {
  var r, s;
  const e = new URLSearchParams({
    filename: t.filename,
    type: t.type,
    subfolder: t.subfolder
  }), o = E;
  let n;
  try {
    n = ((s = (r = o == null ? void 0 : o.api) == null ? void 0 : r.apiURL) == null ? void 0 : s.call(r, `/view?${e.toString()}`)) ?? `/view?${e.toString()}`;
  } catch {
    n = `/view?${e.toString()}`;
  }
  return typeof (o == null ? void 0 : o.getPreviewFormatParam) == "function" && (n += o.getPreviewFormatParam()), typeof (o == null ? void 0 : o.getRandParam) == "function" && (n += o.getRandParam()), n;
}
function Y(t, e) {
  t.handle.style.left = `${e}%`, t.leftImg.style.clipPath = `inset(0 ${100 - e}% 0 0)`;
}
function Ze(t) {
  t.navEl.innerHTML = "";
  const e = [
    { label: "LEFT", count: t.leftUrls.length, idx: () => t.leftIdx, set: (o) => {
      t.leftIdx = o, t.leftImg.src = t.leftUrls[o] || "";
    } },
    { label: "RIGHT", count: t.rightUrls.length, idx: () => t.rightIdx, set: (o) => {
      t.rightIdx = o, t.rightImg.src = t.rightUrls[o] || "";
    } }
  ];
  for (const o of e) {
    if (o.count <= 1) continue;
    const n = document.createElement("span");
    n.className = "ci-nav-side";
    const r = document.createElement("button");
    r.type = "button", r.textContent = "‹", r.addEventListener("click", () => o.set(Math.max(0, o.idx() - 1)));
    const s = document.createElement("span");
    s.textContent = `${o.label} ${o.idx() + 1}/${o.count}`;
    const i = document.createElement("button");
    i.type = "button", i.textContent = "›", i.addEventListener("click", () => o.set(Math.min(o.count - 1, o.idx() + 1))), n.appendChild(r), n.appendChild(s), n.appendChild(i), t.navEl.appendChild(n);
  }
}
function Je(t, e, o) {
  t.leftUrls = e, t.rightUrls = o, t.leftIdx >= t.leftUrls.length && (t.leftIdx = 0), t.rightIdx >= t.rightUrls.length && (t.rightIdx = 0);
  const n = t.leftUrls.length > 0, r = t.rightUrls.length > 0;
  t.leftImg.src = n ? t.leftUrls[t.leftIdx] : "", t.rightImg.src = r ? t.rightUrls[t.rightIdx] : "", t.leftImg.style.display = n ? "" : "none", t.rightImg.style.display = r ? "" : "none", t.handle.style.display = "none", t.leftImg.style.clipPath = "none", t.empty.style.display = n || r ? "none" : "", Y(t, 100), Ze(t);
}
function Qe(t, e) {
  const o = j.get(t);
  if (!o) return;
  const n = e || {}, r = Array.isArray(n.left_images) ? n.left_images.map(_t) : [], s = Array.isArray(n.right_images) ? n.right_images.map(_t) : [];
  Je(o, r, s);
}
function Xe(t) {
  var f, d;
  if (j.has(t)) return;
  const e = document.createElement("div");
  e.className = "comfort-image-comparer";
  const o = document.createElement("div");
  o.className = "ci-nav", e.appendChild(o);
  const n = document.createElement("div");
  n.className = "ci-stage";
  const r = document.createElement("img");
  r.className = "ci-img ci-right", r.draggable = !1;
  const s = document.createElement("img");
  s.className = "ci-img ci-left", s.draggable = !1;
  const i = document.createElement("div");
  i.className = "ci-handle";
  const c = document.createElement("div");
  c.className = "ci-empty", c.textContent = "Connect images and run", n.appendChild(r), n.appendChild(s), n.appendChild(i), n.appendChild(c), e.appendChild(n);
  const u = {
    el: e,
    stage: n,
    leftImg: s,
    rightImg: r,
    handle: i,
    empty: c,
    navEl: o,
    leftUrls: [],
    rightUrls: [],
    leftIdx: 0,
    rightIdx: 0,
    rafId: null
  };
  j.set(t, u), n.addEventListener("mouseenter", () => {
    u.leftUrls.length && u.rightUrls.length && (u.handle.style.display = "");
  }), n.addEventListener("mouseleave", () => {
    u.handle.style.display = "none", Y(u, 100);
  }), n.addEventListener("mousemove", (p) => {
    const h = n.getBoundingClientRect();
    if (h.width <= 0) return;
    const m = Math.max(0, Math.min(100, (p.clientX - h.left) / h.width * 100));
    Y(u, m);
  }), t.__comfortLoaded || (f = t.setSize) == null || f.call(t, [qe, Et]), typeof t.addDOMWidget == "function" && t.addDOMWidget("compare", "comfort_image_compare", e, {
    serialize: !1,
    hideOnZoom: !0,
    getMinHeight: () => 200,
    getMaxHeight: () => 0
  });
  const l = () => {
    var b;
    if (!t.graph) {
      u.rafId = null;
      return;
    }
    const p = t.size ? t.size[1] : Et, h = (b = t.widgets) == null ? void 0 : b.find((O) => O.name === "compare"), m = h && typeof h.y == "number" ? h.y : 20;
    e.style.height = Math.max(60, p - m - 20) + "px", u.rafId = requestAnimationFrame(l);
  };
  u.rafId = requestAnimationFrame(l);
  const a = (d = t.onRemoved) == null ? void 0 : d.bind(t);
  t.onRemoved = (...p) => {
    u.rafId !== null && cancelAnimationFrame(u.rafId), a == null || a(...p);
  };
}
function to(t) {
  if (!t || t.__comfortImageComparer) return;
  const e = t.prototype.onExecuted;
  t.prototype.onExecuted = function(n) {
    e == null || e.call(this, n), Qe(this, n);
  };
  const o = t.prototype.configure;
  t.prototype.configure = function(n) {
    o == null || o.call(this, n), this.__comfortLoaded = !0;
  }, t.__comfortImageComparer = !0;
}
const eo = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-image-comparer{display:flex;flex-direction:column;width:100%;min-width:0;min-height:0}.ci-nav{min-height:28px;flex-shrink:0;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb;min-width:0}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;min-width:0;flex:1;min-height:100px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}", X = document.createElement("style");
X.setAttribute("data-comfort-plugin", "true");
X.textContent = eo;
document.head.appendChild(X);
Me();
Se();
E.registerExtension({
  name: "comfort.PowerLoraLoader",
  async init() {
    Fe();
  },
  beforeRegisterNodeDef(t, e) {
    e && e.name === S && $e(t), e && e.name === L && to(t);
  },
  nodeCreated(t) {
    if (et(t)) {
      Zt(t);
      return;
    }
    if (Pt(t)) {
      je(t);
      return;
    }
    Ke(t) && Xe(t);
  },
  getNodeMenuItems(t) {
    if (et(t)) {
      const e = Bt(t);
      if (e) {
        const o = (n) => {
          e.showSeparate = n, Yt(t);
        };
        return [
          null,
          {
            content: "Show Strengths",
            has_submenu: !0,
            submenu: {
              options: [
                { content: "Single Strength", checked: () => !e.showSeparate, callback: () => o(!1) },
                { content: "Separate Model & Clip", checked: () => e.showSeparate, callback: () => o(!0) }
              ]
            }
          }
        ];
      }
    }
    if (ke(t)) {
      const e = (o) => {
        var n;
        return (n = t.setAllRows) == null ? void 0 : n.call(t, o);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    if (Re(t)) {
      const e = (o) => {
        var n;
        return (n = t.setAllGroups) == null ? void 0 : n.call(t, o);
      };
      return [null, { content: "Enable all", callback: () => e(!0) }, { content: "Disable all", callback: () => e(!1) }, { content: "Toggle all", callback: () => e(null) }];
    }
    return [];
  }
});
export {
  D as NODE_NAME
};
