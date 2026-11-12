import { app as ot } from "/scripts/app.js";
const v = "Power Lora Loader (comfort)", E = /* @__PURE__ */ new WeakMap(), nt = 32, st = 36, rt = 34, D = 14, it = 380;
function P(e) {
  var t;
  return (e == null ? void 0 : e.type) === v || (e == null ? void 0 : e.comfyClass) === v || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === v;
}
function ct(e) {
  return E.get(e);
}
function k(e) {
  return D + nt + e.rows.length * st + rt + D;
}
function b(e, t) {
  var s;
  if (!e.size) return;
  const n = k(t), o = Math.max(e.size[0] || 0, it);
  (e.size[1] !== n || e.size[0] !== o) && ((s = e.setSize) == null || s.call(e, [o, n]));
}
function lt(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function j(e) {
  let t = !0, n = !0;
  for (const o of e.rows)
    if (t = t && o.on === !0, n = n && o.on === !1, !t && !n) return null;
  return !!(t && e.rows.length > 0);
}
function at(e) {
  const t = !j(e);
  for (const n of e.rows) n.on = t;
}
function W(e, t, n) {
  const o = n ? "strengthTwo" : "strength", s = e[o] ?? 1;
  e[o] = Math.round((s + t * 0.05) * 100) / 100;
}
function U(e, t) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (e ? "on" : "off"), n.textContent = t, n;
}
function M(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function O(e, t) {
  const n = document.createElement("div");
  n.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-dec", o.textContent = "−", o.title = "Decrease strength";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-inc", s.textContent = "+", s.title = "Increase strength";
  const r = document.createElement("input");
  return r.type = "number", r.step = "0.05", r.min = "-2", r.max = "3", r.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), r.title = t === "two" ? "Clip strength" : "Strength", n.appendChild(o), n.appendChild(r), n.appendChild(s), n;
}
function ut(e, t, n) {
  const o = document.createElement("div");
  o.className = "comfort-lora-row" + (t.on ? "" : " off"), o.dataset.idx = String(n), o.appendChild(U(t.on, t.on ? "ON" : "OFF"));
  const s = document.createElement("span");
  s.className = "comfort-name", s.textContent = t.lora || "None", s.title = t.lora || "No lora selected — click to choose", o.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-spacer", o.appendChild(r), e.showSeparate ? (o.appendChild(O(t, "one")), o.appendChild(O(t, "two"))) : o.appendChild(O(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", o.appendChild(i), o;
}
function p(e) {
  const t = e.el;
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const o = j(e), s = U(o !== !1, o === !1 ? "ALL OFF" : "ALL ON");
  s.className += " comfort-toggle-all", s.title = "Toggle all loras", n.appendChild(s);
  const r = document.createElement("span");
  r.className = "comfort-header-labels", e.showSeparate ? (r.appendChild(M("Model")), r.appendChild(M("Clip"))) : r.appendChild(M("Strength")), n.appendChild(r), t.appendChild(n), e.rows.forEach((a, l) => t.appendChild(ut(e, a, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function dt(e) {
  const t = E.get(e);
  t && (p(t), b(e, t));
}
async function ft() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function H(e, t, n, o) {
  const s = await ft() || ["(no loras found)"], r = s.length ? s : ["(no loras found)"];
  new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: n,
    callback: (i) => {
      i !== "(no loras found)" && o(i);
    }
  });
}
function pt(e, t, n, o) {
  const s = t.rows[n];
  if (!s) return;
  const r = n > 0, i = n < t.rows.length - 1, c = (a) => {
    const l = n + a;
    if (l < 0 || l >= t.rows.length) return;
    const u = t.rows[n];
    t.rows[n] = t.rows[l], t.rows[l] = u, p(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${s.on ? "⚫" : "◯"} Toggle ${s.on ? "Off" : "On"}`,
        callback: () => {
          s.on = !s.on, p(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !r, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(n, 1), p(t), b(e, t);
        }
      }
    ],
    { title: "LORA", event: o }
  );
}
function ht(e, t) {
  const n = t.el;
  n.addEventListener("click", (o) => {
    const s = o.target;
    if (s.closest(".comfort-toggle-all")) {
      at(t), p(t);
      return;
    }
    if (s.closest(".comfort-add-btn")) {
      H(t, e, o, (l) => {
        t.rows.push(lt(l)), p(t), b(e, t);
      });
      return;
    }
    const r = s.closest(".comfort-lora-row");
    if (!r) return;
    const i = Number(r.dataset.idx), c = t.rows[i];
    if (!c) return;
    const a = !!s.closest(".comfort-strength-clip");
    if (s.closest(".comfort-toggle")) {
      c.on = !c.on, p(t);
      return;
    }
    if (s.closest(".comfort-name")) {
      H(t, e, o, (l) => {
        c.lora = l, p(t);
      });
      return;
    }
    if (s.closest(".comfort-dec")) {
      W(c, -1, a), p(t);
      return;
    }
    if (s.closest(".comfort-inc")) {
      W(c, 1, a), p(t);
      return;
    }
    if (s.closest(".comfort-remove")) {
      t.rows.splice(i, 1), p(t), b(e, t);
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
    s && (o.preventDefault(), o.stopPropagation(), pt(e, t, Number(s.dataset.idx), o));
  });
}
function mt(e) {
  if (E.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", E.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (n) => {
      t.rows = Array.isArray(n) ? n : [], p(t), b(e, t);
    },
    getMinHeight: () => k(t),
    getMaxHeight: () => k(t)
  })), ht(e, t), p(t), b(e, t);
}
function gt(e, t) {
  let n = Object.getPrototypeOf(e);
  for (; n; ) {
    const o = Object.getOwnPropertyDescriptor(n, t);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
class Y extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !1, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = gt(this, "mode"), n = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
  /** Called after the subclass finishes setting up slots/widgets. */
  constructed() {
    this.__constructed__ = !0;
  }
  configure(t) {
    this.configuring = !0, super.configure(t), this.configuring = !1;
  }
  /** Fire when this node's own mode changes. Guard with `this.configuring`. */
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
const _ = 0, K = 2, Z = 4;
function w(e, t) {
  var o;
  if (Array.isArray(e)) {
    for (const s of e) w(s, t);
    return;
  }
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const n = (o = e.subgraph) == null ? void 0 : o.nodes;
  if (Array.isArray(n))
    for (const s of n) w(s, t);
}
function B(e) {
  var n;
  const t = (e == null ? void 0 : e.type) || ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function wt(e, t, n) {
  var c, a;
  const o = e.graph;
  if (!o) return [];
  const s = [], r = /* @__PURE__ */ new Set(), i = (l) => {
    if (!l || r.has(l)) return;
    r.add(l);
    let u;
    u = (l.inputs || []).map((d) => d.link);
    for (const d of u) {
      if (d == null) continue;
      const h = o.links[d];
      if (!h) continue;
      const f = h.origin_id, m = o.getNodeById(f);
      !m || r.has(m) || (B(m) ? i(m) : s.push(m));
    }
  };
  if (n != null) {
    const l = [(a = (c = e.inputs) == null ? void 0 : c[n]) == null ? void 0 : a.link];
    for (const u of l) {
      if (u == null) continue;
      const d = o.links[u];
      if (!d) continue;
      const h = d.origin_id, f = o.getNodeById(h);
      !f || r.has(f) || (B(f) ? i(f) : s.push(f));
    }
  } else
    i(e);
  return s;
}
function N(e, t) {
  return wt(e, "INPUT", t);
}
function L(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((n) => {
    var o;
    return n && (n.isLGraphNode || ((o = n.constructor) == null ? void 0 : o.type));
  }) : [];
}
function bt(e) {
  var c, a, l, u, d, h, f, m;
  const t = e.graph;
  if (!t) return null;
  const n = t._groups || t.groups || [], o = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, s = ((a = e.pos) == null ? void 0 : a[1]) ?? 0, r = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((u = e.size) == null ? void 0 : u[1]) ?? 0;
  for (const x of n) {
    const G = ((d = x.pos) == null ? void 0 : d[0]) ?? 0, I = ((h = x.pos) == null ? void 0 : h[1]) ?? 0, tt = ((f = x.size) == null ? void 0 : f[0]) ?? 0, et = ((m = x.size) == null ? void 0 : m[1]) ?? 0;
    if (o >= G && s >= I && o + r <= G + tt && s + i <= I + et)
      return x;
  }
  return null;
}
class S extends Y {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, n, o, s, r) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, n, o, s, r), this.stabilizeFanIn(), this.onConnectedNodesChanged(N(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let n = 0; n < this.inputs.length; n++) {
      const o = this.inputs[n];
      if (o.link != null) {
        const s = N(this, n)[0], r = (s == null ? void 0 : s.title) || "";
        o.name !== r && (o.name = r);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const xt = 34, yt = 10, Ct = 260;
class q extends S {
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
        const n = document.createElement("div");
        n.className = "comfort-node-empty", n.textContent = "Connect nodes to control them", t.appendChild(n);
      }
      this.rows.forEach((n, o) => {
        const s = document.createElement("div");
        s.className = "comfort-node-row" + (n.on ? "" : " off"), s.dataset.idx = String(o);
        const r = document.createElement("button");
        r.type = "button", r.className = "comfort-toggle " + (n.on ? "on" : "off"), r.textContent = n.on ? "ON" : "OFF", s.appendChild(r);
        const i = document.createElement("span");
        i.className = "comfort-node-title", i.textContent = n.title, i.title = n.title, s.appendChild(i), t.appendChild(s);
      }), this.resizeForRows();
    }
  }
  resizeForRows() {
    var o;
    if (!this.size) return;
    const t = yt * 2 + this.rows.length * xt, n = Math.max(this.size[0] || 0, Ct);
    (this.size[1] !== t || this.size[0] !== n) && ((o = this.setSize) == null || o.call(this, [n, t]));
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
    const t = N(this), n = [];
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
  /** Actions: set every row on/off/toggle. */
  setAllRows(t) {
    for (const n of this.rows)
      t !== null && (n.on = t), this.applyRowMode(n);
    this.renderList();
  }
}
const F = "Fast Muter (comfort)", A = "Fast Bypasser (comfort)";
class Et extends q {
  constructor() {
    super(F), this.modeOn = _, this.modeOff = K;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class Nt extends q {
  constructor() {
    super(A), this.modeOn = _, this.modeOff = Z;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const _t = Et, vt = Nt, J = "Node Collector (comfort)";
class Mt extends S {
  constructor() {
    super(J), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const Ot = Mt, Q = "Mute / Bypass Repeater (comfort)";
class kt extends S {
  constructor() {
    super(Q), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const n = t;
    for (const o of n)
      o.mode !== this.mode && w(o, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, n) {
    if (this.configuring) return;
    const o = N(this);
    if (o.length) {
      for (const r of o) w(r, n);
      return;
    }
    const s = bt(this);
    if (s)
      for (const r of L(s))
        r !== this && w(r, n);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Lt = kt, R = "Fast Groups Muter (comfort)", z = "Fast Groups Bypasser (comfort)", St = 34, Ft = 10, At = 280;
function Rt(e) {
  const t = e.graph;
  if (!t) return [];
  const n = [], o = (s) => {
    var r;
    for (const i of s._groups || s.groups || []) n.push(i);
    for (const i of s._subgraphs || []) o(i);
    for (const i of s._nodes || [])
      (r = i.subgraph) != null && r._groups && o(i.subgraph);
  };
  return o(t), n.sort((s, r) => {
    var u, d, h, f;
    const i = ((u = s.pos) == null ? void 0 : u[1]) ?? 0, c = ((d = r.pos) == null ? void 0 : d[1]) ?? 0;
    if (i !== c) return i - c;
    const a = ((h = s.pos) == null ? void 0 : h[0]) ?? 0, l = ((f = r.pos) == null ? void 0 : f[0]) ?? 0;
    return a !== l ? a - l : String(s.title || "").localeCompare(String(r.title || ""));
  }), n;
}
function zt(e) {
  return L(e).some((t) => t.mode === _);
}
class X extends Y {
  constructor(t) {
    super(t), this.modeOn = _, this.listEl = null, this.rows = [], this.lastKey = "", this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.setupListWidget(), V.register(this), this.constructed();
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
    const o = L(t.group);
    w(o, n ? this.modeOn : this.modeOff);
  }
  /** Rebuild the group list. Called on a shared interval + on demand. */
  refresh() {
    var r;
    const t = Rt(this), n = String(((r = this.properties) == null ? void 0 : r.matchTitle) || "").trim();
    let o = t.map((i) => ({
      group: i,
      title: String(i.title || "group"),
      on: zt(i)
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
    var n;
    const t = this.listEl;
    if (t) {
      if (t.innerHTML = "", !this.rows.length) {
        const o = document.createElement("div");
        o.className = "comfort-node-empty", o.textContent = "No groups in this workflow", t.appendChild(o);
      }
      if (this.rows.forEach((o, s) => {
        const r = document.createElement("div");
        r.className = "comfort-node-row" + (o.on ? "" : " off"), r.dataset.idx = String(s);
        const i = document.createElement("button");
        i.type = "button", i.className = "comfort-toggle " + (o.on ? "on" : "off"), i.textContent = o.on ? "ON" : "OFF", r.appendChild(i);
        const c = document.createElement("span");
        c.className = "comfort-node-title", c.textContent = o.title, c.title = o.title, r.appendChild(c), t.appendChild(r);
      }), this.size) {
        const o = Ft * 2 + this.rows.length * St, s = Math.max(this.size[0] || 0, At);
        (this.size[1] !== o || this.size[0] !== s) && ((n = this.setSize) == null || n.call(this, [s, o]));
      }
    }
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
    V.unregister(this), (t = super.onRemoved) == null || t.call(this);
  }
}
class Tt extends X {
  constructor() {
    super(R), this.modeOff = K;
  }
}
class Gt extends X {
  constructor() {
    super(z), this.modeOff = Z;
  }
}
const C = /* @__PURE__ */ new Set();
let y = null;
const V = {
  register(e) {
    C.add(e), y == null && (y = setInterval(() => {
      for (const t of C)
        try {
          t.refresh();
        } catch {
        }
    }, 1e3));
  },
  unregister(e) {
    C.delete(e), !C.size && y != null && (clearInterval(y), y = null);
  }
}, It = Tt, Dt = Gt, $ = /* @__PURE__ */ new Set();
function g(e, t) {
  $.has(e) || ($.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function Pt() {
  g(F, _t), g(A, vt), g(J, Ot), g(Q, Lt), g(R, It), g(z, Dt);
}
function Wt(e) {
  return (e == null ? void 0 : e.type) === F || (e == null ? void 0 : e.type) === A;
}
function Ht(e) {
  return (e == null ? void 0 : e.type) === R || (e == null ? void 0 : e.type) === z;
}
const Bt = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}", T = document.createElement("style");
T.setAttribute("data-comfort-plugin", "true");
T.textContent = Bt;
document.head.appendChild(T);
Pt();
ot.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    P(e) && mt(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (P(e)) {
      const t = ct(e);
      if (t) {
        const n = (o) => {
          t.showSeparate = o, dt(e);
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
    if (Wt(e)) {
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
    if (Ht(e)) {
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
  v as NODE_NAME
};
