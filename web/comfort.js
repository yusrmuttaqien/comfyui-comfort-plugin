import { app as b } from "/scripts/app.js";
const H = "Power Lora Loader (comfort)", U = /* @__PURE__ */ new WeakMap(), Qt = 32, Xt = 36, te = 34, st = 14, ee = 380;
function rt(e) {
  var t;
  return (e == null ? void 0 : e.type) === H || (e == null ? void 0 : e.comfyClass) === H || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === H;
}
function ne(e) {
  return U.get(e);
}
function q(e) {
  return st + Qt + e.rows.length * Xt + te + st;
}
function M(e, t) {
  var s;
  if (!e.size) return;
  const n = q(t), o = Math.max(e.size[0] || 0, ee);
  (e.size[1] !== n || e.size[0] !== o) && ((s = e.setSize) == null || s.call(e, [o, n]));
}
function oe(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function Pt(e) {
  let t = !0, n = !0;
  for (const o of e.rows)
    if (t = t && o.on === !0, n = n && o.on === !1, !t && !n) return null;
  return !!(t && e.rows.length > 0);
}
function se(e) {
  const t = !Pt(e);
  for (const n of e.rows) n.on = t;
}
function it(e, t, n) {
  const o = n ? "strengthTwo" : "strength", s = e[o] ?? 1;
  e[o] = Math.round((s + t * 0.05) * 100) / 100;
}
function zt(e, t) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (e ? "on" : "off"), n.textContent = t, n;
}
function G(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function $(e, t) {
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
  o.className = "comfort-lora-row" + (t.on ? "" : " off"), o.dataset.idx = String(n), o.appendChild(zt(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", o.appendChild(r), e.showSeparate ? (o.appendChild($(t, "one")), o.appendChild($(t, "two"))) : o.appendChild($(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", o.appendChild(i), o;
}
function y(e) {
  const t = e.el;
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const o = Pt(e), s = zt(o !== !1, o === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(G("Model")), r.appendChild(G("Clip"))) : r.appendChild(G("Strength")), n.appendChild(r), t.appendChild(n), e.rows.forEach((l, a) => t.appendChild(re(e, l, a)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function ie(e) {
  const t = U.get(e);
  t && (y(t), M(e, t));
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
async function ct(e, t, n, o) {
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
  const r = n > 0, i = n < t.rows.length - 1, c = (l) => {
    const a = n + l;
    if (a < 0 || a >= t.rows.length) return;
    const u = t.rows[n];
    t.rows[n] = t.rows[a], t.rows[a] = u, y(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${s.on ? "⚫" : "◯"} Toggle ${s.on ? "Off" : "On"}`,
        callback: () => {
          s.on = !s.on, y(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !r, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(n, 1), y(t), M(e, t);
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
      se(t), y(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      ct(t, e, o, (a) => {
        t.rows.push(oe(a)), y(t), M(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const l = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, y(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      ct(t, e, o, (a) => {
        c.lora = a, y(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      it(c, -1, l), y(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      it(c, 1, l), y(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), y(t), M(e, t);
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
  if (U.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div")
  };
  t.el.className = "comfort-lora-list", U.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (n) => {
      t.rows = Array.isArray(n) ? n : [], y(t), M(e, t);
    },
    getMinHeight: () => q(t),
    getMaxHeight: () => q(t)
  }), le(e, t), y(t), M(e, t);
}
function de(e, t) {
  let n = Object.getPrototypeOf(e);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, t);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
class J extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.isVirtualNode = !0, this.installModeInterceptor();
  }
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
  onModeChange(t, n) {
  }
  getHelp() {
    return "";
  }
  onRemoved() {
    var t;
    (t = super.onRemoved) == null || t.call(this), this.removed = !0;
  }
}
const w = 0, x = 2, N = 4;
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
function at(e) {
  var n;
  const t = (e == null ? void 0 : e.type) || ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function Ut(e, t, n) {
  var c, l, a, u;
  const o = e.graph;
  if (!o) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (d) => {
    if (!d || r.has(d)) return;
    r.add(d);
    let f;
    t === "OUTPUT" ? f = (d.outputs || []).flatMap((p) => p.links || []) : f = (d.inputs || []).map((p) => p.link);
    for (const p of f) {
      if (p == null) continue;
      const h = o.links[p];
      if (!h) continue;
      const m = t === "OUTPUT" ? h.target_id : h.origin_id, g = o.getNodeById(m);
      !g || r.has(g) || (at(g) ? i(g) : s.push(g));
    }
  };
  if (n != null) {
    const d = t === "OUTPUT" ? ((l = (c = e.outputs) == null ? void 0 : c[n]) == null ? void 0 : l.links) || [] : [(u = (a = e.inputs) == null ? void 0 : a[n]) == null ? void 0 : u.link];
    for (const f of d) {
      if (f == null) continue;
      const p = o.links[f];
      if (!p) continue;
      const h = t === "OUTPUT" ? p.target_id : p.origin_id, m = o.getNodeById(h);
      !m || r.has(m) || (at(m) ? i(m) : s.push(m));
    }
  } else
    i(e);
  return s;
}
function S(e, t) {
  return Ut(e, "INPUT", t);
}
function lt(e, t) {
  return Ut(e, "OUTPUT", t);
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
function fe(e) {
  var c, l, a, u, d, f, p, h;
  const t = e.graph;
  if (!t) return null;
  const n = t._groups || t.groups || [], o = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((l = e.pos) == null ? void 0 : l[1]) ?? 0, r = ((a = e.size) == null ? void 0 : a[0]) ?? 0, i = ((u = e.size) == null ? void 0 : u[1]) ?? 0;
  for (const m of n) {
    const g = ((d = m.pos) == null ? void 0 : d[0]) ?? 0, _ = ((f = m.pos) == null ? void 0 : f[1]) ?? 0, Jt = ((p = m.size) == null ? void 0 : p[0]) ?? 0, Zt = ((h = m.size) == null ? void 0 : h[1]) ?? 0;
    if (o >= g && s >= _ && o + r <= g + Jt && s + i <= _ + Zt)
      return m;
  }
  return null;
}
class O extends J {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectedNodesChanged(t) {
  }
  onConnectionsChange(t, n, o, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, n, o, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(S(this));
  }
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let n = 0; n < this.inputs.length; n++) {
      const o = this.inputs[n];
      if (o.link != null) {
        const s = S(this, n)[0], r = (s == null ? void 0 : s.title) || "";
        o.name !== r && (o.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const pe = 34, he = 10;
function Ft(e, t, n) {
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
function Dt(e, t, n) {
  var r;
  if (!e.size) return;
  const o = he * 2 + t * pe, s = Math.max(e.size[0] || 0, n);
  (e.size[1] !== o || e.size[0] !== s) && ((r = e.setSize) == null || r.call(e, [s, o]));
}
const me = 260;
class Bt extends O {
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
    t && (Ft(t, this.rows, "Connect nodes to control them"), Dt(this, this.rows.length, me));
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
    const t = S(this), n = [];
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
const Z = "Fast Muter (comfort)", Q = "Fast Bypasser (comfort)";
class ge extends Bt {
  constructor() {
    super(Z), this.modeOn = w, this.modeOff = x;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class ye extends Bt {
  constructor() {
    super(Q), this.modeOn = w, this.modeOff = N;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const be = ge, we = ye, Ht = "Node Collector (comfort)";
class xe extends O {
  constructor() {
    super(Ht), this.addOutput("Output", "*");
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ve = xe, X = "Mute / Bypass Repeater (comfort)";
class Ee extends O {
  constructor() {
    super(X), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
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
    const o = S(this);
    if (o.length) {
      for (const r of o) v(r, n);
      return;
    }
    const s = fe(this);
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
const Ce = Ee;
function W(e) {
  return (e == null ? void 0 : e.type) === X;
}
const Ne = 500;
class _e {
  constructor() {
    this.timer = null, this.counter = 0, this.jobs = /* @__PURE__ */ new Map();
  }
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
const C = new _e(), Gt = "Mode Relay (comfort)", ke = {
  ACTIVE: w,
  MUTE: x,
  BYPASS: N,
  NOTHING: -99
}, Se = {
  [x]: "on_muted_inputs",
  [N]: "on_bypassed_inputs",
  [w]: "on_any_active_inputs"
};
class Me extends O {
  constructor() {
    super(Gt), this.properties.on_muted_inputs = "MUTE", this.properties.on_bypassed_inputs = "BYPASS", this.properties.on_any_active_inputs = "ACTIVE", this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5
    }), dt.register(this);
  }
  onConnectedNodesChanged(t) {
    this.evaluate();
  }
  onModeChange(t, n) {
    if (super.onModeChange(t, n), this.configuring || S(this).length) return;
    const s = lt(this).filter(W);
    for (const r of s)
      r.mode !== n && v(r, n);
  }
  onConnectOutput(t, n, o, s, r) {
    return s ? W(s) : !0;
  }
  evaluate() {
    var c;
    if (this.configuring) return;
    const t = S(this);
    let n;
    for (const l of t) {
      const a = l.mode;
      if (n === void 0) n = a;
      else {
        if (n === a && (a === x || a === N)) continue;
        a === w || n === w ? n = w : n = void 0;
      }
    }
    if (n === void 0) return;
    const o = Se[n], s = o ? ke[String((c = this.properties) == null ? void 0 : c[o])] : n, r = s !== void 0 ? s : n;
    if (r === -99) return;
    const i = lt(this).filter(W);
    for (const l of i)
      l.mode !== r && v(l, r);
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
    dt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const L = /* @__PURE__ */ new Set(), ut = () => {
  for (const e of L)
    try {
      e.evaluate();
    } catch {
    }
}, dt = {
  register(e) {
    L.add(e), C.schedule(ut, 1);
  },
  unregister(e) {
    L.delete(e), L.size || C.unschedule(ut);
  }
}, Ie = Me, $t = "Random Unmuter (comfort)";
class Re extends O {
  constructor() {
    super($t), this.tempEnabled = null, ft.register(this);
  }
  onPromptStart() {
    if (this.configuring) return;
    this.tempEnabled = null;
    const t = S(this);
    if (!t.length || !t.every((s) => s.mode === x)) return;
    const o = t[Math.floor(Math.random() * t.length)];
    o && (v(o, w), this.tempEnabled = o);
  }
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
    ft.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
const F = /* @__PURE__ */ new Set(), ft = {
  register(e) {
    F.add(e), Ae();
  },
  unregister(e) {
    F.delete(e);
  }
};
let pt = !1;
function Ae() {
  if (pt) return;
  pt = !0;
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
const Oe = Re, Le = 1e3;
async function Wt(e, t, n) {
  const o = t === void 0 ? await fetch("/comfort/ninfer/forward?url=" + encodeURIComponent(e), { signal: n }) : await fetch("/comfort/ninfer/forward", {
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
const ht = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
async function mt(e, t, n) {
  const o = e + "/v1/models";
  if (t) {
    const i = ht.get(o);
    if (i && Date.now() - i.at < Le) return i.models;
  }
  const s = j.get(o);
  if (s) return s;
  const r = (async () => {
    var a;
    const c = (a = (await Wt(o, void 0, n)).body) == null ? void 0 : a.data, l = Array.isArray(c) ? c.map((u) => {
      var d;
      return { id: String(u.id), value: String(((d = u.status) == null ? void 0 : d.value) ?? "") };
    }) : [];
    return ht.set(o, { at: Date.now(), models: l }), l;
  })().finally(() => j.delete(o));
  return j.set(o, r), r;
}
function Te(e, t, n) {
  return Wt(e + "/v1/models/" + encodeURIComponent(t) + "/suspend", {}, n);
}
const Pe = (e) => new Promise((t) => setTimeout(t, e));
let I = null;
function ze() {
  return document.querySelector('[data-testid="queue-button"]');
}
function Ue() {
  var t;
  const e = b;
  return ((t = e.canvas) == null ? void 0 : t.graph) ?? e.graph ?? null;
}
function jt(e) {
  const t = Ue();
  if (!t) return null;
  for (const n of e)
    if (!n.removed && n.graph === t) return n;
  return null;
}
function Fe(e) {
  if (I && I.isConnected) return;
  const t = ze();
  if (!t || !t.parentElement) return;
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-topbar-focus", n.title = "Focus NInfer gate", n.textContent = "⚡ NInfer", n.addEventListener("click", () => {
    const o = jt(e);
    if (!o) return;
    const s = o.graph;
    if (s) {
      for (const d of s._nodes || []) d.selected = !1;
      o.selected = !0;
    }
    const r = b.canvas;
    if (!r) return;
    const i = o.size || [200, 150], c = r.canvas, l = c && c.clientWidth || window.innerWidth, a = c && c.clientHeight || window.innerHeight, u = Math.min(l * 0.5 / (i[0] || 200), a * 0.5 / (i[1] || 150));
    r.ds.scale = Math.min(Math.max(u, 0.75), 2), r.centerOnNode(o), r.setDirty(!0);
  }), t.parentElement.insertBefore(n, t.nextSibling), I = n;
}
function De(e) {
  const t = () => {
    Fe(e), I && (I.style.display = jt(e) ? "" : "none");
  };
  C.schedule(t, 1);
}
const Yt = "NInfer Suspend Gate (comfort)", gt = 30, Be = 24, He = 32, Ge = 30, $e = 10, We = 300, je = 6, Ye = 1, qe = 2e3, yt = ["indefinite", "1", "5", "10", "15", "30", "60"];
class Ve extends J {
  constructor() {
    super(Yt), this.properties.url = "", this.properties.timeout = "indefinite", this.properties.selected = null, this.st = this.setupWidget(), vt.register(this);
  }
  configure(t) {
    super.configure(t), this.syncFieldsFromProperties();
  }
  onAdded() {
    var t;
    (t = super.onAdded) == null || t.call(this), this.syncFieldsFromProperties(), this.refresh();
  }
  onRemoved() {
    var t;
    vt.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
  updateLiveStatus() {
    (this.st.phase === "suspending" || this.st.phase === "busy") && this.renderStatus();
  }
  baseUrl() {
    return String(this.properties.url || "").trim().replace(/\/+$/, "");
  }
  timeoutMs() {
    const t = String(this.properties.timeout || "indefinite");
    if (t === "indefinite") return 1 / 0;
    const n = parseInt(t, 10);
    return Number.isFinite(n) && n > 0 ? n * 60 * 1e3 : 1 / 0;
  }
  computeSelected(t) {
    const n = this.properties.selected;
    return n == null ? new Set(t.filter((o) => o.value === "loaded").map((o) => o.id)) : new Set(Array.isArray(n) ? n.map(String) : []);
  }
  setupWidget() {
    const t = document.createElement("div");
    t.className = "comfort-ninfer";
    const n = document.createElement("input");
    n.type = "text", n.className = "comfort-ninfer-url", n.placeholder = "NInfer URL  (http://host:30001)", t.appendChild(n);
    const o = document.createElement("select");
    o.className = "comfort-ninfer-timeout";
    for (const p of yt) {
      const h = document.createElement("option");
      h.value = p, h.textContent = p === "indefinite" ? "Busy timeout: indefinite" : `Busy timeout: ${p} min`, o.appendChild(h);
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
    const l = document.createElement("div");
    l.className = "comfort-ninfer-bulk";
    const a = document.createElement("button");
    a.type = "button", a.className = "comfort-bulk", a.dataset.bulk = "all", a.textContent = "Select all";
    const u = document.createElement("button");
    u.type = "button", u.className = "comfort-bulk", u.dataset.bulk = "none", u.textContent = "Deselect all", l.appendChild(a), l.appendChild(u), t.appendChild(l);
    const d = document.createElement("div");
    d.className = "comfort-ninfer-rows", t.appendChild(d);
    const f = {
      el: t,
      urlInput: n,
      timeoutSel: o,
      statusEl: s,
      statusText: r,
      cancelBtn: i,
      skipBtn: c,
      bulkEl: l,
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
      var p;
      f.cancel = !0, (p = f.abort) == null || p.abort();
    }), c.addEventListener("click", () => {
      var p;
      f.skip = !0, (p = f.abort) == null || p.abort();
    }), d.addEventListener("change", (p) => {
      const h = p.target;
      if (h.type !== "checkbox" || !h.dataset.id) return;
      const m = new Set(f.selected);
      h.checked ? m.add(h.dataset.id) : m.delete(h.dataset.id), f.selected = m, this.properties.selected = Array.from(m);
    }), l.addEventListener("click", (p) => {
      var m;
      const h = (m = p.target.dataset) == null ? void 0 : m.bulk;
      if (h === "all") {
        const g = f.models.filter((_) => _.value === "loaded").map((_) => _.id);
        f.selected = new Set(g), this.properties.selected = g;
      } else if (h === "none")
        f.selected = /* @__PURE__ */ new Set(), this.properties.selected = [];
      else
        return;
      this.renderRows();
    }), n.addEventListener("input", () => {
      this.properties.url = n.value.trim();
    }), n.addEventListener("change", () => {
      this.properties.url = n.value.trim(), this.properties.selected = null, f.phase = "idle", f.resultText = "", f.models = [], f.selected = /* @__PURE__ */ new Set(), this.refresh();
    }), o.addEventListener("change", () => {
      this.properties.timeout = o.value;
    }), typeof this.addDOMWidget == "function" && this.addDOMWidget("ninfer", "comfort_ninfer_list", t, {
      serialize: !1,
      hideOnZoom: !0
    }), f;
  }
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
      const l = o.value || "unknown", a = document.createElement("span");
      a.className = "comfort-ninfer-badge " + (l === "loaded" ? "loaded" : l === "sleeping" ? "suspended" : "other"), a.textContent = l === "sleeping" ? "suspended" : l, r.appendChild(a), n.appendChild(r);
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
    const t = this.st.models.length, n = $e * 2 + gt + gt + Be + He + t * Ge, o = Math.max(((r = this.size) == null ? void 0 : r[0]) || 0, We), s = this.size;
    (!s || s[1] !== n || s[0] !== o) && ((i = this.setSize) == null || i.call(this, [o, n]));
  }
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
      const s = await mt(o, !t);
      n.models = s, this.properties.selected == null && (this.properties.selected = s.filter((r) => r.value === "loaded").map((r) => r.id)), n.selected = this.computeSelected(s), this.renderRows(), this.layout(), (n.phase === "done" || n.phase === "error") && n.resultHold > 0 ? n.resultHold-- : n.phase !== "idle" && (n.phase = "idle", n.resultText = ""), this.renderStatus();
    } catch {
      n.phase === "idle" && (n.phase = "error", n.resultText = "NInfer unreachable"), this.renderStatus();
    } finally {
      n.polling = !1;
    }
  }
  async suspendChecked() {
    const t = this.st, n = this.baseUrl();
    if (!n) return { proceed: !0 };
    t.cancel = !1, t.skip = !1, t.abort = null;
    let o;
    try {
      o = await mt(n, !1);
    } catch {
      return this.finish("NInfer unreachable", !0), { proceed: !1 };
    }
    t.models = o;
    const s = this.computeSelected(o);
    t.selected = s, this.renderRows();
    const r = o.filter((l) => l.value === "loaded" && s.has(l.id));
    if (!r.length)
      return this.finish("Ready (nothing to suspend)", !1), { proceed: !0 };
    const i = Date.now(), c = this.timeoutMs();
    try {
      for (const a of r) {
        if (t.cancel || t.skip) break;
        const u = Date.now();
        for (this.beginSuspending(a.id, u); !(t.cancel || t.skip); ) {
          const d = new AbortController();
          t.abort = d;
          let f;
          try {
            f = await Te(n, a.id, d.signal);
          } catch {
            if (d.signal.aborted) break;
            throw new Error("suspend request failed");
          }
          if (f.status === 200) break;
          if (f.status === 409) {
            if (this.setBusy(a.id, u), await Pe(qe), t.cancel || t.skip) break;
            if (Date.now() - i > c)
              throw new Error("timed out waiting for NInfer to idle");
            continue;
          }
          throw new Error(`suspend failed (HTTP ${f.status})`);
        }
      }
      if (t.abort = null, t.cancel)
        return this.finish("Cancelled", !1), { proceed: !1 };
      if (t.skip)
        return this.finish("Skipped — running now", !1), { proceed: !0 };
      const l = Math.round((Date.now() - i) / 1e3);
      this.finish(`Suspended ${r.length} model${r.length === 1 ? "" : "s"} (${l}s)`, !1), t.resultHold = 2;
      try {
        await this.refresh(!0);
      } catch {
      }
      return { proceed: !0 };
    } catch (l) {
      return this.finish(l instanceof Error ? l.message : String(l), !0), { proceed: !1 };
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
let bt = !1;
const wt = () => {
  if (!document.hidden) {
    for (const e of Array.from(k))
      if (!e.removed)
        try {
          e.refresh();
        } catch {
        }
  }
}, xt = () => {
  for (const e of Array.from(k))
    if (!e.removed)
      try {
        e.updateLiveStatus();
      } catch {
      }
}, vt = {
  register(e) {
    k.add(e), Ke(), C.schedule(wt, je), C.schedule(xt, Ye);
  },
  unregister(e) {
    k.delete(e), k.size || (C.unschedule(wt), C.unschedule(xt));
  }
};
function Ke() {
  if (bt) return;
  bt = !0;
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
function Je() {
  De(k);
}
const tt = "Fast Groups Muter (comfort)", et = "Fast Groups Bypasser (comfort)", Ze = 280;
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
    var d, f, p, h;
    const c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0, l = ((f = i.pos) == null ? void 0 : f[1]) ?? 0;
    if (c !== l) return c - l;
    const a = ((p = r.pos) == null ? void 0 : p[0]) ?? 0, u = ((h = i.pos) == null ? void 0 : h[0]) ?? 0;
    return a !== u ? a - u : String(r.title || "").localeCompare(String(i.title || ""));
  }), o;
}
function Xe(e) {
  return B(e).some((t) => t.mode === w);
}
class qt extends J {
  constructor(t) {
    super(t), this.modeOn = w, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), Ct.register(this);
  }
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
    t && (Ft(t, this.rows, "No groups in this workflow"), Dt(this, this.rows.length, Ze));
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
    Ct.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class tn extends qt {
  constructor() {
    super(tt), this.modeOff = x;
  }
}
class en extends qt {
  constructor() {
    super(et), this.modeOff = N;
  }
}
const T = /* @__PURE__ */ new Set(), Et = () => {
  for (const e of T)
    try {
      e.refresh();
    } catch {
    }
}, Ct = {
  register(e) {
    T.add(e), C.schedule(Et, 2);
  },
  unregister(e) {
    T.delete(e), T.size || C.unschedule(Et);
  }
}, nn = tn, on = en, Nt = /* @__PURE__ */ new Set();
function E(e, t) {
  Nt.has(e) || (Nt.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function sn() {
  E(Z, be), E(Q, we), E(Ht, ve), E(X, Ce), E(Gt, Ie), E($t, Oe), E(tt, nn), E(et, on), E(Yt, Ve);
}
function rn(e) {
  return (e == null ? void 0 : e.type) === Z || (e == null ? void 0 : e.type) === Q;
}
function cn(e) {
  return (e == null ? void 0 : e.type) === tt || (e == null ? void 0 : e.type) === et;
}
const an = 10, ln = /[/\\]/, _t = "__comfort_original";
function un(e, t) {
  const n = t == null ? void 0 : t.callback, o = /* @__PURE__ */ new Map(), s = [];
  for (const a of e) {
    if (a == null) {
      s.push(a);
      continue;
    }
    const u = String(a), d = u.indexOf("/") > -1 ? "/" : "\\", f = u.indexOf(d);
    if (f > -1) {
      const p = u.slice(0, f), h = u.slice(f + 1);
      o.has(p) || o.set(p, []), o.get(p).push({ full: u, sub: h });
    } else
      s.push(a);
  }
  const r = (a, u) => ({
    content: u,
    [_t]: a,
    callback: (d) => n == null ? void 0 : n(d[_t])
  }), i = [], c = [...o.keys()].sort((a, u) => a.localeCompare(u));
  for (const a of c) {
    const u = o.get(a).map((d) => r(d.full, d.sub));
    i.push({
      content: `📁 ${a}`,
      has_submenu: !0,
      callback: () => {
      },
      submenu: { options: u }
    });
  }
  for (const a of s)
    typeof a == "string" ? i.push(r(a, a)) : i.push(a);
  const l = Object.assign({}, t);
  return l.callback = void 0, { values: i, options: l };
}
function kt(e, t) {
  return !Array.isArray(e) || e.length < an ? { values: e, options: t } : (t == null ? void 0 : t.className) !== "dark" ? { values: e, options: t } : e.every((n) => n == null || typeof n == "string") ? e.some((n) => typeof n == "string" && ln.test(n)) ? un(e, t) : { values: e, options: t } : { values: e, options: t };
}
function dn() {
  const e = LiteGraph.ContextMenu;
  if (!e || e.__comfortAutoNest) return;
  const t = new Proxy(e, {
    construct(n, o, s) {
      const [r, i] = o, c = kt(r, i);
      return Reflect.construct(n, [c.values, c.options], s);
    },
    apply(n, o, s) {
      const [r, i] = s, c = kt(r, i);
      return n.call(o, c.values, c.options);
    }
  });
  t.__comfortAutoNest = !0, LiteGraph.ContextMenu = t;
}
const R = 20, St = 6, fn = 6;
let D = /* @__PURE__ */ new Map();
function Mt(e, t) {
  const n = document.createElement("div");
  return n.className = "comfort-group-btn " + t, n.textContent = e, n.style.position = "fixed", n.style.display = "none", n.style.pointerEvents = "auto", n.style.zIndex = "100", n;
}
function pn(e) {
  let t = D.get(e);
  if (t) return t;
  const n = Mt("M", "comfort-btn-mute"), o = Mt("B", "comfort-btn-byp");
  return n.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), Rt(e, "mute");
  }), o.addEventListener("pointerdown", (s) => {
    s.stopPropagation(), s.preventDefault(), Rt(e, "bypass");
  }), t = { group: e, mute: n, byp: o }, D.set(e, t), document.body.appendChild(n), document.body.appendChild(o), t;
}
function It(e, t, n, o) {
  e.style.left = `${t}px`, e.style.top = `${n}px`, e.style.width = `${R * o}px`, e.style.height = `${R * o}px`, e.style.fontSize = `${Math.max(9, R * o * 0.5)}px`;
}
function hn(e, t) {
  return !t || t.length < 2 ? !1 : t[0] >= e.pos[0] && t[0] <= e.pos[0] + e.size[0] && t[1] >= e.pos[1] && t[1] <= e.pos[1] + e.size[1];
}
function mn() {
  const e = b.canvas, t = e == null ? void 0 : e.graph;
  if (!t) return;
  const o = e.canvas.getBoundingClientRect(), s = e.ds.scale, r = e.ds.offset, i = (u) => o.left + (u + r[0]) * s, c = (u) => o.top + (u + r[1]) * s, l = t._groups || [], a = /* @__PURE__ */ new Set();
  for (const u of l)
    (e.selected_group === u || hn(u, e.mouse)) && a.add(u);
  for (const u of a) {
    const d = pn(u), f = u.pos[0] + u.size[0] - St - R, p = u.pos[1] + St;
    It(d.mute, i(f - fn - R), c(p), s), It(d.byp, i(f), c(p), s), d.mute.style.display = "block", d.byp.style.display = "block";
  }
  for (const [u, d] of D)
    a.has(u) || (d.mute.style.display = "none", d.byp.style.display = "none"), l.includes(u) || (d.mute.remove(), d.byp.remove(), D.delete(u));
}
function Rt(e, t) {
  var l;
  const n = B(e);
  if (!n.length) return;
  const o = n.every((a) => a.mode === x), s = n.every((a) => a.mode === N), r = b.graph, i = r == null ? void 0 : r.version;
  try {
    if (t === "mute") {
      const a = o ? w : x;
      n.forEach((u) => u.mode = a);
    } else {
      const a = s ? w : N;
      n.forEach((u) => u.mode = a);
    }
  } catch (a) {
    console.warn("[comfort] group toggle failed", a);
    return;
  }
  r && r.version === i && r.setVersion(r.version + 1);
  const c = b.canvas;
  (l = c == null ? void 0 : c.setDirty) == null || l.call(c, !0, !0);
}
function gn() {
  const e = b.canvas;
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
const P = "Any Router (comfort)", yn = 4, bn = 5;
function A(e) {
  return (e.inputs || []).filter((t) => t && t.name && t.name.startsWith("any_"));
}
function Vt(e) {
  var t;
  return (e == null ? void 0 : e.type) === P || (e == null ? void 0 : e.comfyClass) === P || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === P;
}
function nt(e) {
  const t = A(e).length + 1;
  return "any_" + String(t).padStart(2, "0");
}
function wn(e) {
  const t = (e.widgets || []).find((n) => n.name === "selection");
  return t && t.value === "active_source" ? "active_source" : "non_empty";
}
function xn(e, t, n) {
  var c, l;
  const o = e.graph || b.graph;
  if (!o) return null;
  let s = e, r = n, i = t;
  for (let a = 0; a < 12; a++) {
    const u = i === "input" ? (c = s.inputs) == null ? void 0 : c[r] : (l = s.outputs) == null ? void 0 : l[r];
    if (!u) return null;
    if (u.type != null && u.type !== "*") return String(u.type);
    const d = i === "input" ? u.link : u.links && u.links[0];
    if (d == null) return null;
    const f = o.links && (o.links.get ? o.links.get(d) : o.links[d]) || null;
    if (!f || (i === "input" ? (s = o.getNodeById(f.origin_id), r = f.origin_slot, i = "output") : (s = o.getNodeById(f.target_id), r = f.target_slot, i = "input"), !s)) return null;
  }
  return null;
}
function vn(e) {
  const t = e.inputs || [];
  for (let n = 0; n < t.length; n++) {
    if (t[n].link == null) continue;
    const o = xn(e, "input", n);
    if (o && o !== "*") return o;
  }
  return "*";
}
function Kt(e) {
  if (e.removed || !e.inputs) return;
  let t = A(e).length;
  for (; t > yn; ) {
    const s = e.inputs[e.inputs.length - 1];
    if (s && s.name.startsWith("any_") && s.link == null)
      e.removeInput(e.inputs.length - 1), t--;
    else
      break;
  }
  const n = e.inputs[e.inputs.length - 1];
  (!n || !n.name.startsWith("any_") || n.link != null) && e.addInput(nt(e), "*");
  const o = vn(e);
  for (const s of A(e)) s.type = o;
  for (const s of e.outputs || [])
    s.type = o, s.label = String(o);
}
const Y = /* @__PURE__ */ new WeakMap();
function En(e) {
  const t = Y.get(e);
  t != null && window.clearTimeout(t), Y.set(
    e,
    window.setTimeout(() => {
      Y.delete(e), e.removed || Kt(e);
    }, 64)
  );
}
function Cn(e) {
  if (!e || e.__comfortAnyRouter) return;
  e.__comfortAnyRouter = !0, e.prototype.stabilizeComfortAnyRouter = function() {
    Kt(this);
  }, e.prototype.getHelp = function() {
    return "<p>Routes one of several <b>Any</b> inputs to a single Any output.</p><p><b>Non-empty:</b> the first input that is not empty wins.</p><p><b>Active source:</b> the first input whose source node is active (not muted / not bypassed) wins. Mute or bypass a source to switch away from it.</p>";
  };
  const t = e.prototype.configure;
  e.prototype.configure = function(o) {
    try {
      const r = (o && o.inputs || []).filter(
        (i) => i && i.name && i.name.startsWith("any_")
      ).length;
      for (; A(this).length < r; )
        this.addInput(nt(this), "*");
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
  for (; A(e).length < bn && t++ < 24; )
    e.addInput(nt(e), "*");
  kn();
}
function _n(e) {
  return !!e && e.mode !== x && e.mode !== N;
}
function At(e) {
  if (!e || typeof e != "object") return;
  const t = e.output, n = b.graph;
  if (!(!t || !n || !n.nodes))
    for (const o of n.nodes) {
      if (!Vt(o) || o.mode === x || o.mode === N || wn(o) !== "active_source") continue;
      const s = t[o.id];
      if (!s || !s.inputs) continue;
      const r = o.inputs || [];
      let i = null;
      for (let c = 0; c < r.length; c++) {
        const l = o.getInputNode ? o.getInputNode(c) : null;
        if (_n(l)) {
          i = r[c].name;
          break;
        }
      }
      for (const c of Object.keys(s.inputs))
        c.startsWith("any_") && c !== i && delete s.inputs[c];
    }
}
let Ot = !1;
function kn() {
  if (Ot) return;
  Ot = !0;
  const e = b, t = e.graphToPrompt;
  typeof t == "function" && (e.graphToPrompt = function(...n) {
    const o = t.apply(e, n);
    return o && typeof o.then == "function" ? o.then(
      (s) => (At(s), s),
      (s) => {
        throw s;
      }
    ) : (At(o), o);
  });
}
const z = "Image Comparer (comfort)", Sn = 512, Lt = 488;
function Mn(e) {
  var t;
  return (e == null ? void 0 : e.type) === z || (e == null ? void 0 : e.comfyClass) === z || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === z;
}
const V = /* @__PURE__ */ new WeakMap();
function Tt(e) {
  var s, r;
  const t = new URLSearchParams({
    filename: e.filename,
    type: e.type,
    subfolder: e.subfolder
  }), n = b;
  let o;
  try {
    o = ((r = (s = n == null ? void 0 : n.api) == null ? void 0 : s.apiURL) == null ? void 0 : r.call(s, `/view?${t.toString()}`)) ?? `/view?${t.toString()}`;
  } catch {
    o = `/view?${t.toString()}`;
  }
  return typeof (n == null ? void 0 : n.getPreviewFormatParam) == "function" && (o += n.getPreviewFormatParam()), typeof (n == null ? void 0 : n.getRandParam) == "function" && (o += n.getRandParam()), o;
}
function K(e, t) {
  e.handle.style.left = `${t}%`, e.leftImg.style.clipPath = `inset(0 ${100 - t}% 0 0)`;
}
function In(e) {
  e.navEl.innerHTML = "";
  const t = [
    { label: "LEFT", count: e.leftUrls.length, idx: () => e.leftIdx, set: (n) => {
      e.leftIdx = n, e.leftImg.src = e.leftUrls[n] || "";
    } },
    { label: "RIGHT", count: e.rightUrls.length, idx: () => e.rightIdx, set: (n) => {
      e.rightIdx = n, e.rightImg.src = e.rightUrls[n] || "";
    } }
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
function Rn(e, t, n) {
  e.leftUrls = t, e.rightUrls = n, e.leftIdx >= e.leftUrls.length && (e.leftIdx = 0), e.rightIdx >= e.rightUrls.length && (e.rightIdx = 0);
  const o = e.leftUrls.length > 0, s = e.rightUrls.length > 0;
  e.leftImg.src = o ? e.leftUrls[e.leftIdx] : "", e.rightImg.src = s ? e.rightUrls[e.rightIdx] : "", e.leftImg.style.display = o ? "" : "none", e.rightImg.style.display = s ? "" : "none", e.handle.style.display = "none", e.leftImg.style.clipPath = "none", e.empty.style.display = o || s ? "none" : "", K(e, 100), In(e);
}
function An(e, t) {
  const n = V.get(e);
  if (!n) return;
  const o = t || {}, s = Array.isArray(o.left_images) ? o.left_images.map(Tt) : [], r = Array.isArray(o.right_images) ? o.right_images.map(Tt) : [];
  Rn(n, s, r);
}
function On(e) {
  var d, f;
  if (V.has(e)) return;
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
  const l = {
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
    rightIdx: 0,
    rafId: null
  };
  V.set(e, l), o.addEventListener("mouseenter", () => {
    l.leftUrls.length && l.rightUrls.length && (l.handle.style.display = "");
  }), o.addEventListener("mouseleave", () => {
    l.handle.style.display = "none", K(l, 100);
  }), o.addEventListener("mousemove", (p) => {
    const h = o.getBoundingClientRect();
    if (h.width <= 0) return;
    const m = Math.max(0, Math.min(100, (p.clientX - h.left) / h.width * 100));
    K(l, m);
  }), e.__comfortLoaded || (d = e.setSize) == null || d.call(e, [Sn, Lt]), typeof e.addDOMWidget == "function" && e.addDOMWidget("compare", "comfort_image_compare", t, {
    serialize: !1,
    hideOnZoom: !0,
    getMinHeight: () => 200,
    getMaxHeight: () => 0
  });
  const a = () => {
    var g;
    if (!e.graph) {
      l.rafId = null;
      return;
    }
    const p = e.size ? e.size[1] : Lt, h = (g = e.widgets) == null ? void 0 : g.find((_) => _.name === "compare"), m = h && typeof h.y == "number" ? h.y : 20;
    t.style.height = Math.max(60, p - m - 20) + "px", l.rafId = requestAnimationFrame(a);
  };
  l.rafId = requestAnimationFrame(a);
  const u = (f = e.onRemoved) == null ? void 0 : f.bind(e);
  e.onRemoved = (...p) => {
    l.rafId !== null && cancelAnimationFrame(l.rafId), u == null || u(...p);
  };
}
function Ln(e) {
  if (!e || e.__comfortImageComparer) return;
  const t = e.prototype.onExecuted;
  e.prototype.onExecuted = function(o) {
    t == null || t.call(this, o), An(this, o);
  };
  const n = e.prototype.configure;
  e.prototype.configure = function(o) {
    n == null || n.call(this, o), this.__comfortLoaded = !0;
  }, e.__comfortImageComparer = !0;
}
const Tn = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.comfort-group-btn{display:flex;align-items:center;justify-content:center;border-radius:4px;font-family:inherit;font-weight:600;line-height:1;-webkit-user-select:none;user-select:none;cursor:pointer;color:#e8e8e8;box-shadow:0 1px 3px #0006}.comfort-btn-mute{background:#7850c88c;border:1px solid rgba(120,80,200,.9)}.comfort-btn-byp{background:#c88c288c;border:1px solid rgba(200,140,40,.9)}.comfort-group-btn:hover{filter:brightness(1.3)}.comfort-ninfer{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}.comfort-ninfer-url,.comfort-ninfer-timeout{width:100%;box-sizing:border-box;padding:4px 6px;font-size:12px;font-family:inherit;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-ninfer-status{display:flex;align-items:center;gap:6px;min-height:18px;padding:2px;font-size:11px;opacity:.9}.comfort-ninfer-status-text{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.comfort-ninfer-ctrl{flex:0 0 auto;padding:1px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-ninfer-ctrl:hover{background:#7f7f7f33}.comfort-ninfer-bulk{display:flex;gap:6px}.comfort-bulk{flex:1 1 auto;padding:3px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:11px;cursor:pointer}.comfort-bulk:hover{background:#7f7f7f33}.comfort-ninfer-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-ninfer-row.off .comfort-node-title{opacity:.5}.comfort-ninfer-row input[type=checkbox]{margin:0;cursor:pointer}.comfort-ninfer-badge{padding:1px 6px;border-radius:8px;font-size:10px;background:#7f7f7f40}.comfort-ninfer-badge.loaded{background:#7d2e2e;color:#fff}.comfort-ninfer-badge.suspended{background:#2e5d7d;color:#fff}.comfort-ninfer-badge.other{opacity:.7}.comfort-topbar-focus{padding:3px 8px;margin-left:6px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-topbar-focus:hover{background:#7f7f7f33}.comfort-image-comparer{display:flex;flex-direction:column;width:100%;min-width:0;min-height:0}.ci-nav{min-height:28px;flex-shrink:0;display:flex;gap:12px;align-items:center;padding:2px 4px;font-size:12px;color:#bbb;min-width:0}.ci-nav-side{display:inline-flex;align-items:center;gap:4px}.ci-nav-side button{width:18px;height:18px;line-height:1;border:1px solid rgba(127,127,127,.5);border-radius:4px;background:transparent;color:inherit;cursor:pointer;padding:0}.ci-nav-side button:hover{background:#7f7f7f40}.ci-stage{position:relative;width:100%;min-width:0;flex:1;min-height:100px;overflow:hidden;background:#161616;border-radius:6px}.ci-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain}.ci-handle{position:absolute;top:0;left:50%;width:2px;height:100%;background:#ffffffd9;box-shadow:0 0 4px #0009;pointer-events:none}.ci-empty{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;pointer-events:none}", ot = document.createElement("style");
ot.setAttribute("data-comfort-plugin", "true");
ot.textContent = Tn;
document.head.appendChild(ot);
sn();
dn();
b.registerExtension({
  name: "comfort.PowerLoraLoader",
  async init() {
    gn(), Je();
  },
  beforeRegisterNodeDef(e, t) {
    t && t.name === P && Cn(e), t && t.name === z && Ln(e);
  },
  nodeCreated(e) {
    if (rt(e)) {
      ue(e);
      return;
    }
    if (Vt(e)) {
      Nn(e);
      return;
    }
    Mn(e) && On(e);
  },
  getNodeMenuItems(e) {
    if (rt(e)) {
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
                { content: "Single Strength", checked: () => !t.showSeparate, callback: () => n(!1) },
                { content: "Separate Model & Clip", checked: () => t.showSeparate, callback: () => n(!0) }
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
      return [null, { content: "Enable all", callback: () => t(!0) }, { content: "Disable all", callback: () => t(!1) }, { content: "Toggle all", callback: () => t(null) }];
    }
    if (cn(e)) {
      const t = (n) => {
        var o;
        return (o = e.setAllGroups) == null ? void 0 : o.call(e, n);
      };
      return [null, { content: "Enable all", callback: () => t(!0) }, { content: "Disable all", callback: () => t(!1) }, { content: "Toggle all", callback: () => t(null) }];
    }
    return [];
  }
});
export {
  H as NODE_NAME
};
