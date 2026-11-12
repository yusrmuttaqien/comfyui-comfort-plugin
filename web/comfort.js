import { app as $ } from "/scripts/app.js";
const N = "Power Lora Loader (comfort)", y = /* @__PURE__ */ new WeakMap(), U = 32, Z = 36, q = 34, S = 14, J = 380;
function A(e) {
  var t;
  return (e == null ? void 0 : e.type) === N || (e == null ? void 0 : e.comfyClass) === N || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === N;
}
function K(e) {
  return y.get(e);
}
function _(e) {
  return S + U + e.rows.length * Z + q + S;
}
function g(e, t) {
  var r;
  if (!e.size) return;
  const o = _(t), n = Math.max(e.size[0] || 0, J);
  (e.size[1] !== o || e.size[0] !== n) && ((r = e.setSize) == null || r.call(e, [n, o]));
}
function Q(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function P(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function X(e) {
  const t = !P(e);
  for (const o of e.rows) o.on = t;
}
function F(e, t, o) {
  const n = o ? "strengthTwo" : "strength", r = e[n] ?? 1;
  e[n] = Math.round((r + t * 0.05) * 100) / 100;
}
function H(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function E(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function v(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), s.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(s), o.appendChild(r), o;
}
function tt(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(H(t.on, t.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = t.lora || "None", r.title = t.lora || "No lora selected — click to choose", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", n.appendChild(s), e.showSeparate ? (n.appendChild(v(t, "one")), n.appendChild(v(t, "two"))) : n.appendChild(v(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function a(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = P(e), r = H(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", e.showSeparate ? (s.appendChild(E("Model")), s.appendChild(E("Clip"))) : s.appendChild(E("Strength")), o.appendChild(s), t.appendChild(o), e.rows.forEach((d, l) => t.appendChild(tt(e, d, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function et(e) {
  const t = y.get(e);
  t && (a(t), g(e, t));
}
async function ot() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function T(e, t, o, n) {
  const r = await ot() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function nt(e, t, o, n) {
  const r = t.rows[o];
  if (!r) return;
  const s = o > 0, i = o < t.rows.length - 1, c = (d) => {
    const l = o + d;
    if (l < 0 || l >= t.rows.length) return;
    const u = t.rows[o];
    t.rows[o] = t.rows[l], t.rows[l] = u, a(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${r.on ? "⚫" : "◯"} Toggle ${r.on ? "Off" : "On"}`,
        callback: () => {
          r.on = !r.on, a(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !s, callback: () => c(-1) },
      { content: "⬇️ Move Down", disabled: !i, callback: () => c(1) },
      {
        content: "🗑️ Remove",
        callback: () => {
          t.rows.splice(o, 1), a(t), g(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function rt(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const r = n.target;
    if (r.closest(".comfort-toggle-all")) {
      X(t), a(t);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      T(t, e, n, (l) => {
        t.rows.push(Q(l)), a(t), g(e, t);
      });
      return;
    }
    const s = r.closest(".comfort-lora-row");
    if (!s) return;
    const i = Number(s.dataset.idx), c = t.rows[i];
    if (!c) return;
    const d = !!r.closest(".comfort-strength-clip");
    if (r.closest(".comfort-toggle")) {
      c.on = !c.on, a(t);
      return;
    }
    if (r.closest(".comfort-name")) {
      T(t, e, n, (l) => {
        c.lora = l, a(t);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      F(c, -1, d), a(t);
      return;
    }
    if (r.closest(".comfort-inc")) {
      F(c, 1, d), a(t);
      return;
    }
    if (r.closest(".comfort-remove")) {
      t.rows.splice(i, 1), a(t), g(e, t);
      return;
    }
  }), o.addEventListener("change", (n) => {
    const r = n.target, s = r.closest(".comfort-lora-row");
    if (!s || !r.matches("input[type='number']")) return;
    const i = t.rows[Number(s.dataset.idx)];
    if (!i) return;
    const c = parseFloat(r.value);
    Number.isFinite(c) && (r.closest(".comfort-strength-clip") ? i.strengthTwo = c : i.strength = c);
  }), o.addEventListener("contextmenu", (n) => {
    const r = n.target.closest(".comfort-lora-row");
    r && (n.preventDefault(), n.stopPropagation(), nt(e, t, Number(r.dataset.idx), n));
  });
}
function st(e) {
  if (y.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", y.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], a(t), g(e, t);
    },
    getMinHeight: () => _(t),
    getMaxHeight: () => _(t)
  })), rt(e, t), a(t), g(e, t);
}
function it(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class ct extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !0, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = it(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
    Object.defineProperty(this, "mode", {
      configurable: !0,
      enumerable: !0,
      get: o,
      set: (n) => {
        const r = o();
        t != null && t.set ? t.set.call(this, n) : this.__comfort_mode = n, r !== n && this.onModeChange(r, n);
      }
    });
  }
  /** Called after the subclass finishes setting up slots/widgets. */
  constructed() {
    this.__constructed__ = !0;
  }
  configure(t) {
    this.configuring = !0, super.configure(t), setTimeout(() => {
      this.configuring = !1;
    }, 0);
  }
  /** Fire when this node's own mode changes. Guard with `this.configuring`. */
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
const W = 0, lt = 2, at = 4;
function x(e, t) {
  var n;
  if (!e) return;
  try {
    e.mode = t;
  } catch {
  }
  const o = (n = e.subgraph) == null ? void 0 : n.nodes;
  if (Array.isArray(o))
    for (const r of o) x(r, t);
}
function I(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function dt(e, t, o) {
  var c, d;
  const n = e.graph;
  if (!n) return [];
  const r = [], s = /* @__PURE__ */ new Set(), i = (l) => {
    if (!l || s.has(l)) return;
    s.add(l);
    let u;
    u = (l.inputs || []).map((f) => f.link);
    for (const f of u) {
      if (f == null) continue;
      const m = n.links[f];
      if (!m) continue;
      const p = m.origin_id, h = n.getNodeById(p);
      !h || s.has(h) || (I(h) ? i(h) : r.push(h));
    }
  };
  if (o != null) {
    const l = [(d = (c = e.inputs) == null ? void 0 : c[o]) == null ? void 0 : d.link];
    for (const u of l) {
      if (u == null) continue;
      const f = n.links[u];
      if (!f) continue;
      const m = f.origin_id, p = n.getNodeById(m);
      !p || s.has(p) || (I(p) ? i(p) : r.push(p));
    }
  } else
    i(e);
  return r;
}
function C(e, t) {
  return dt(e, "INPUT", t);
}
function ut(e) {
  const t = e == null ? void 0 : e._children;
  return t ? Array.from(t).filter((o) => {
    var n;
    return o && (o.isLGraphNode || ((n = o.constructor) == null ? void 0 : n.type));
  }) : [];
}
function ft(e) {
  var c, d, l, u, f, m, p, h;
  const t = e.graph;
  if (!t) return null;
  const o = t._groups || t.groups || [], n = ((c = e.pos) == null ? void 0 : c[0]) ?? 0, r = ((d = e.pos) == null ? void 0 : d[1]) ?? 0, s = ((l = e.size) == null ? void 0 : l[0]) ?? 0, i = ((u = e.size) == null ? void 0 : u[1]) ?? 0;
  for (const w of o) {
    const z = ((f = w.pos) == null ? void 0 : f[0]) ?? 0, R = ((m = w.pos) == null ? void 0 : m[1]) ?? 0, V = ((p = w.size) == null ? void 0 : p[0]) ?? 0, Y = ((h = w.size) == null ? void 0 : h[1]) ?? 0;
    if (n >= z && r >= R && n + s <= z + V && r + i <= R + Y)
      return w;
  }
  return null;
}
class O extends ct {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, n, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(C(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const r = C(this, o)[0], s = (r == null ? void 0 : r.title) || "";
        n.name !== s && (n.name = s);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const pt = 34, ht = 10, mt = 260;
class B extends O {
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
        const r = document.createElement("div");
        r.className = "comfort-node-row" + (o.on ? "" : " off"), r.dataset.idx = String(n);
        const s = document.createElement("button");
        s.type = "button", s.className = "comfort-toggle " + (o.on ? "on" : "off"), s.textContent = o.on ? "ON" : "OFF", r.appendChild(s);
        const i = document.createElement("span");
        i.className = "comfort-node-title", i.textContent = o.title, i.title = o.title, r.appendChild(i), t.appendChild(r);
      }), this.resizeForRows();
    }
  }
  resizeForRows() {
    var n;
    if (!this.size) return;
    const t = ht * 2 + this.rows.length * pt, o = Math.max(this.size[0] || 0, mt);
    (this.size[1] !== t || this.size[0] !== o) && ((n = this.setSize) == null || n.call(this, [o, t]));
  }
  bindListEvents() {
    const t = this.listEl;
    t && t.addEventListener("click", (o) => {
      const r = o.target.closest(".comfort-node-row");
      if (!r) return;
      const s = Number(r.dataset.idx), i = this.rows[s];
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
      const r = n.title || n.type || "node", s = this.rows.find((c) => c.node === n), i = s ? s.on : n.mode === this.modeOn;
      o.push({ node: n, title: r, on: i });
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
const M = "Fast Muter (comfort)", k = "Fast Bypasser (comfort)";
class gt extends B {
  constructor() {
    super(M), this.modeOn = W, this.modeOff = lt;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class wt extends B {
  constructor() {
    super(k), this.modeOn = W, this.modeOff = at;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const bt = gt, xt = wt, G = "Node Collector (comfort)";
class yt extends O {
  constructor() {
    super(G), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const Ct = yt, j = "Mute / Bypass Repeater (comfort)";
class Nt extends O {
  constructor() {
    super(j), this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" }), this.constructed();
  }
  onConnectedNodesChanged(t) {
    if (this.configuring) return;
    const o = t;
    for (const n of o)
      n.mode !== this.mode && x(n, this.mode);
  }
  /** Propagate our mode to every connected input node (or our group). */
  onModeChange(t, o) {
    if (this.configuring) return;
    const n = C(this);
    if (n.length) {
      for (const s of n) x(s, o);
      return;
    }
    const r = ft(this);
    if (r)
      for (const s of ut(r))
        s !== this && x(s, o);
  }
  getHelp() {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}
const Et = Nt, D = /* @__PURE__ */ new Set();
function b(e, t) {
  D.has(e) || (D.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function vt() {
  b(M, bt), b(k, xt), b(G, Ct), b(j, Et);
}
function _t(e) {
  return (e == null ? void 0 : e.type) === M || (e == null ? void 0 : e.type) === k;
}
const Ot = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}", L = document.createElement("style");
L.setAttribute("data-comfort-plugin", "true");
L.textContent = Ot;
document.head.appendChild(L);
vt();
$.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    A(e) && st(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (A(e)) {
      const t = K(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, et(e);
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
    if (_t(e)) {
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
    return [];
  }
});
export {
  N as NODE_NAME
};
