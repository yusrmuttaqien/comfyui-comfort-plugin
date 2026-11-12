import { app as H } from "/scripts/app.js";
const b = "Power Lora Loader (comfort)", w = /* @__PURE__ */ new WeakMap(), W = 32, B = 36, j = 34, _ = 14, V = 380;
function L(e) {
  var t;
  return (e == null ? void 0 : e.type) === b || (e == null ? void 0 : e.comfyClass) === b || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === b;
}
function G(e) {
  return w.get(e);
}
function E(e) {
  return _ + W + e.rows.length * B + j + _;
}
function h(e, t) {
  var r;
  if (!e.size) return;
  const o = E(t), n = Math.max(e.size[0] || 0, V);
  (e.size[1] !== o || e.size[0] !== n) && ((r = e.setSize) == null || r.call(e, [n, o]));
}
function Y(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function A(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function $(e) {
  const t = !A(e);
  for (const o of e.rows) o.on = t;
}
function M(e, t, o) {
  const n = o ? "strengthTwo" : "strength", r = e[n] ?? 1;
  e[n] = Math.round((r + t * 0.05) * 100) / 100;
}
function F(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function x(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function C(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const s = document.createElement("input");
  return s.type = "number", s.step = "0.05", s.min = "-2", s.max = "3", s.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), s.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(s), o.appendChild(r), o;
}
function U(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(F(t.on, t.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = t.lora || "None", r.title = t.lora || "No lora selected — click to choose", n.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-spacer", n.appendChild(s), e.showSeparate ? (n.appendChild(C(t, "one")), n.appendChild(C(t, "two"))) : n.appendChild(C(t, "one"));
  const i = document.createElement("button");
  return i.type = "button", i.className = "comfort-remove", i.textContent = "×", i.title = "Remove lora", n.appendChild(i), n;
}
function a(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = A(e), r = F(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", o.appendChild(r);
  const s = document.createElement("span");
  s.className = "comfort-header-labels", e.showSeparate ? (s.appendChild(x("Model")), s.appendChild(x("Clip"))) : s.appendChild(x("Strength")), o.appendChild(s), t.appendChild(o), e.rows.forEach((d, l) => t.appendChild(U(e, d, l)));
  const i = document.createElement("div");
  i.className = "comfort-lora-footer";
  const c = document.createElement("button");
  c.type = "button", c.className = "comfort-add-btn", c.textContent = "➕ Add Lora", i.appendChild(c), t.appendChild(i);
}
function Z(e) {
  const t = w.get(e);
  t && (a(t), h(e, t));
}
async function q() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function S(e, t, o, n) {
  const r = await q() || ["(no loras found)"], s = r.length ? r : ["(no loras found)"];
  new LiteGraph.ContextMenu(s, {
    title: "Choose Lora",
    event: o,
    callback: (i) => {
      i !== "(no loras found)" && n(i);
    }
  });
}
function J(e, t, o, n) {
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
          t.rows.splice(o, 1), a(t), h(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function K(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const r = n.target;
    if (r.closest(".comfort-toggle-all")) {
      $(t), a(t);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      S(t, e, n, (l) => {
        t.rows.push(Y(l)), a(t), h(e, t);
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
      S(t, e, n, (l) => {
        c.lora = l, a(t);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      M(c, -1, d), a(t);
      return;
    }
    if (r.closest(".comfort-inc")) {
      M(c, 1, d), a(t);
      return;
    }
    if (r.closest(".comfort-remove")) {
      t.rows.splice(i, 1), a(t), h(e, t);
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
    r && (n.preventDefault(), n.stopPropagation(), J(e, t, Number(r.dataset.idx), n));
  });
}
function Q(e) {
  if (w.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", w.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], a(t), h(e, t);
    },
    getMinHeight: () => E(t),
    getMaxHeight: () => E(t)
  })), K(e, t), a(t), h(e, t);
}
function X(e, t) {
  let o = Object.getPrototypeOf(e);
  for (; o; ) {
    const n = Object.getOwnPropertyDescriptor(o, t);
    if (n) return n;
    o = Object.getPrototypeOf(o);
  }
}
class tt extends LGraphNode {
  constructor(t) {
    super(t), this.configuring = !0, this.__constructed__ = !1, this.removed = !1, this.widgets = this.widgets || [], this.properties = this.properties || {}, this.installModeInterceptor(), this.__constructed__ = !0;
  }
  /**
   * Wrap `this.mode` so reads/writes go through us and `onModeChange` fires.
   * Delegates to the prototype accessor (Nodes 2.0) when present, else to a
   * private field (legacy LiteGraph).
   */
  installModeInterceptor() {
    const t = X(this, "mode"), o = () => t != null && t.get ? t.get.call(this) : this.__comfort_mode;
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
const T = 0, et = 2, ot = 4;
function z(e) {
  var o;
  const t = (e == null ? void 0 : e.type) || ((o = e == null ? void 0 : e.constructor) == null ? void 0 : o.type) || "";
  return t.includes("Reroute") || t.includes("Node Collector") || t.includes("Node Combiner");
}
function nt(e, t, o) {
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
      const g = n.links[f];
      if (!g) continue;
      const p = g.origin_id, m = n.getNodeById(p);
      !m || s.has(m) || (z(m) ? i(m) : r.push(m));
    }
  };
  if (o != null) {
    const l = [(d = (c = e.inputs) == null ? void 0 : c[o]) == null ? void 0 : d.link];
    for (const u of l) {
      if (u == null) continue;
      const f = n.links[u];
      if (!f) continue;
      const g = f.origin_id, p = n.getNodeById(g);
      !p || s.has(p) || (z(p) ? i(p) : r.push(p));
    }
  } else
    i(e);
  return r;
}
function N(e, t) {
  return nt(e, "INPUT", t);
}
class I extends tt {
  constructor(t) {
    super(t), this.addInput("", "*");
  }
  onConnectionsChange(t, o, n, r, s) {
    var i;
    (i = super.onConnectionsChange) == null || i.call(this, t, o, n, r, s), this.stabilizeFanIn(), this.onConnectedNodesChanged(N(this));
  }
  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
  stabilizeFanIn() {
    if (!this.inputs) return;
    for (let o = 0; o < this.inputs.length; o++) {
      const n = this.inputs[o];
      if (n.link != null) {
        const r = N(this, o)[0], s = (r == null ? void 0 : r.title) || "";
        n.name !== s && (n.name = s);
      }
    }
    const t = this.inputs[this.inputs.length - 1];
    (!t || t.link != null) && this.addInput("", "*");
  }
}
const rt = 34, st = 10, it = 260;
class D extends I {
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
    const t = st * 2 + this.rows.length * rt, o = Math.max(this.size[0] || 0, it);
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
    const t = N(this), o = [];
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
const v = "Fast Muter (comfort)", k = "Fast Bypasser (comfort)";
class ct extends D {
  constructor() {
    super(v), this.modeOn = T, this.modeOff = et;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}
class lt extends D {
  constructor() {
    super(k), this.modeOn = T, this.modeOff = ot;
  }
  getHelp() {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}
const at = ct, dt = lt, P = "Node Collector (comfort)";
class ut extends I {
  constructor() {
    super(P), this.addOutput("Output", "*"), this.constructed();
  }
  onConnectedNodesChanged(t) {
  }
  getHelp() {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}
const ft = ut, R = /* @__PURE__ */ new Set();
function y(e, t) {
  R.has(e) || (R.add(e), t.category = "comfort", LiteGraph.registerNodeType(e, t));
}
function pt() {
  y(v, at), y(k, dt), y(P, ft);
}
function ht(e) {
  return (e == null ? void 0 : e.type) === v || (e == null ? void 0 : e.type) === k;
}
const mt = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}.comfort-node-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-node-empty{padding:6px;opacity:.55;font-style:italic}.comfort-node-row{display:flex;align-items:center;gap:8px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-node-row.off .comfort-node-title{opacity:.5}.comfort-node-title{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}", O = document.createElement("style");
O.setAttribute("data-comfort-plugin", "true");
O.textContent = mt;
document.head.appendChild(O);
pt();
H.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    L(e) && Q(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (L(e)) {
      const t = G(e);
      if (t) {
        const o = (n) => {
          t.showSeparate = n, Z(e);
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
    if (ht(e)) {
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
  b as NODE_NAME
};
