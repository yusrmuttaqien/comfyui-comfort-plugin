import { app as N } from "/scripts/app.js";
const u = "Power Lora Loader (comfort)", d = /* @__PURE__ */ new WeakMap(), L = 32, S = 36, M = 34, w = 14, z = 380;
function x(e) {
  var t;
  return (e == null ? void 0 : e.type) === u || (e == null ? void 0 : e.comfyClass) === u || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === u;
}
function O(e) {
  return d.get(e);
}
function h(e) {
  return w + L + e.rows.length * S + M + w;
}
function f(e, t) {
  var o;
  if (!e.size) return;
  const r = h(t), n = Math.max(e.size[0] || 0, z);
  (e.size[1] !== r || e.size[0] !== n) && ((o = e.setSize) == null || o.call(e, [n, r]));
}
function A(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function v(e) {
  let t = !0, r = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, r = r && n.on === !1, !t && !r) return null;
  return !!(t && e.rows.length > 0);
}
function T(e) {
  const t = !v(e);
  for (const r of e.rows) r.on = t;
}
function C(e, t, r) {
  const n = r ? "strengthTwo" : "strength", o = e[n] ?? 1;
  e[n] = Math.round((o + t * 0.05) * 100) / 100;
}
function y(e, t) {
  const r = document.createElement("button");
  return r.type = "button", r.className = "comfort-toggle " + (e ? "on" : "off"), r.textContent = t, r;
}
function m(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function g(e, t) {
  const r = document.createElement("div");
  r.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-inc", o.textContent = "+", o.title = "Increase strength";
  const c = document.createElement("input");
  return c.type = "number", c.step = "0.05", c.min = "-2", c.max = "3", c.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), c.title = t === "two" ? "Clip strength" : "Strength", r.appendChild(n), r.appendChild(c), r.appendChild(o), r;
}
function D(e, t, r) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(r), n.appendChild(y(t.on, t.on ? "ON" : "OFF"));
  const o = document.createElement("span");
  o.className = "comfort-name", o.textContent = t.lora || "None", o.title = t.lora || "No lora selected — click to choose", n.appendChild(o);
  const c = document.createElement("span");
  c.className = "comfort-spacer", n.appendChild(c), e.showSeparate ? (n.appendChild(g(t, "one")), n.appendChild(g(t, "two"))) : n.appendChild(g(t, "one"));
  const a = document.createElement("button");
  return a.type = "button", a.className = "comfort-remove", a.textContent = "×", a.title = "Remove lora", n.appendChild(a), n;
}
function s(e) {
  const t = e.el;
  t.innerHTML = "";
  const r = document.createElement("div");
  r.className = "comfort-lora-header";
  const n = v(e), o = y(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  o.className += " comfort-toggle-all", o.title = "Toggle all loras", r.appendChild(o);
  const c = document.createElement("span");
  c.className = "comfort-header-labels", e.showSeparate ? (c.appendChild(m("Model")), c.appendChild(m("Clip"))) : c.appendChild(m("Strength")), r.appendChild(c), t.appendChild(r), e.rows.forEach((p, i) => t.appendChild(D(e, p, i)));
  const a = document.createElement("div");
  a.className = "comfort-lora-footer";
  const l = document.createElement("button");
  l.type = "button", l.className = "comfort-add-btn", l.textContent = "➕ Add Lora", a.appendChild(l), t.appendChild(a);
}
function R(e) {
  const t = d.get(e);
  t && (s(t), f(e, t));
}
async function E(e, t, r, n) {
  let o = [];
  try {
    const c = await N.api.getList("loras");
    o = (c == null ? void 0 : c.name) ?? [];
  } catch {
    o = [];
  }
  o.length || (o = ["(no loras found)"]), new LiteGraph.ContextMenu(o, {
    title: "Choose Lora",
    event: r,
    callback: (c) => {
      c !== "(no loras found)" && n(c);
    }
  });
}
function _(e, t, r, n) {
  const o = t.rows[r];
  if (!o) return;
  const c = r > 0, a = r < t.rows.length - 1, l = (p) => {
    const i = r + p;
    if (i < 0 || i >= t.rows.length) return;
    const k = t.rows[r];
    t.rows[r] = t.rows[i], t.rows[i] = k, s(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${o.on ? "⚫" : "◯"} Toggle ${o.on ? "Off" : "On"}`,
        callback: () => {
          o.on = !o.on, s(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !c, callback: () => l(-1) },
      { content: "⬇️ Move Down", disabled: !a, callback: () => l(1) },
      {
        content: "U0001f5d1️ Remove",
        callback: () => {
          t.rows.splice(r, 1), s(t), f(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function H(e, t) {
  const r = t.el;
  r.addEventListener("click", (n) => {
    const o = n.target;
    if (o.closest(".comfort-toggle-all")) {
      T(t), s(t);
      return;
    }
    if (o.closest(".comfort-add-btn")) {
      E(t, e, n, (i) => {
        t.rows.push(A(i)), s(t), f(e, t);
      });
      return;
    }
    const c = o.closest(".comfort-lora-row");
    if (!c) return;
    const a = Number(c.dataset.idx), l = t.rows[a];
    if (!l) return;
    const p = !!o.closest(".comfort-strength-clip");
    if (o.closest(".comfort-toggle")) {
      l.on = !l.on, s(t);
      return;
    }
    if (o.closest(".comfort-name")) {
      E(t, e, n, (i) => {
        l.lora = i, s(t);
      });
      return;
    }
    if (o.closest(".comfort-dec")) {
      C(l, -1, p), s(t);
      return;
    }
    if (o.closest(".comfort-inc")) {
      C(l, 1, p), s(t);
      return;
    }
    if (o.closest(".comfort-remove")) {
      t.rows.splice(a, 1), s(t), f(e, t);
      return;
    }
  }), r.addEventListener("change", (n) => {
    const o = n.target, c = o.closest(".comfort-lora-row");
    if (!c || !o.matches("input[type='number']")) return;
    const a = t.rows[Number(c.dataset.idx)];
    if (!a) return;
    const l = parseFloat(o.value);
    Number.isFinite(l) && (o.closest(".comfort-strength-clip") ? a.strengthTwo = l : a.strength = l);
  }), r.addEventListener("contextmenu", (n) => {
    const o = n.target.closest(".comfort-lora-row");
    o && (n.preventDefault(), n.stopPropagation(), _(e, t, Number(o.dataset.idx), n));
  });
}
function F(e) {
  if (d.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", d.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (r) => {
      t.rows = Array.isArray(r) ? r : [], s(t), f(e, t);
    },
    getMinHeight: () => h(t),
    getMaxHeight: () => h(t)
  })), H(e, t), s(t), f(e, t);
}
const P = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}", b = document.createElement("style");
b.setAttribute("data-comfort-plugin", "true");
b.textContent = P;
document.head.appendChild(b);
N.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    x(e) && F(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (!x(e)) return [];
    const t = O(e);
    if (!t) return [];
    const r = (n) => {
      t.showSeparate = n, R(e);
    };
    return [
      null,
      {
        content: "Show Strengths",
        submenu: [
          {
            content: "Single Strength",
            checked: () => !t.showSeparate,
            callback: () => r(!1)
          },
          {
            content: "Separate Model & Clip",
            checked: () => t.showSeparate,
            callback: () => r(!0)
          }
        ]
      }
    ];
  }
});
export {
  u as NODE_NAME
};
