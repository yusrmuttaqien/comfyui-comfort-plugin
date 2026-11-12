import { app as v } from "/scripts/app.js";
const d = "Power Lora Loader (comfort)", u = /* @__PURE__ */ new WeakMap(), L = 32, S = 36, M = 34, b = 14, z = 380;
function x(e) {
  var t;
  return (e == null ? void 0 : e.type) === d || (e == null ? void 0 : e.comfyClass) === d || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === d;
}
function O(e) {
  return u.get(e);
}
function h(e) {
  return b + L + e.rows.length * S + M + b;
}
function p(e, t) {
  var r;
  if (!e.size) return;
  const o = h(t), n = Math.max(e.size[0] || 0, z);
  (e.size[1] !== o || e.size[0] !== n) && ((r = e.setSize) == null || r.call(e, [n, o]));
}
function A(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function y(e) {
  let t = !0, o = !0;
  for (const n of e.rows)
    if (t = t && n.on === !0, o = o && n.on === !1, !t && !o) return null;
  return !!(t && e.rows.length > 0);
}
function T(e) {
  const t = !y(e);
  for (const o of e.rows) o.on = t;
}
function C(e, t, o) {
  const n = o ? "strengthTwo" : "strength", r = e[n] ?? 1;
  e[n] = Math.round((r + t * 0.05) * 100) / 100;
}
function N(e, t) {
  const o = document.createElement("button");
  return o.type = "button", o.className = "comfort-toggle " + (e ? "on" : "off"), o.textContent = t, o;
}
function m(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function g(e, t) {
  const o = document.createElement("div");
  o.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const n = document.createElement("button");
  n.type = "button", n.className = "comfort-dec", n.textContent = "−", n.title = "Decrease strength";
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-inc", r.textContent = "+", r.title = "Increase strength";
  const c = document.createElement("input");
  return c.type = "number", c.step = "0.05", c.min = "-2", c.max = "3", c.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), c.title = t === "two" ? "Clip strength" : "Strength", o.appendChild(n), o.appendChild(c), o.appendChild(r), o;
}
function D(e, t, o) {
  const n = document.createElement("div");
  n.className = "comfort-lora-row" + (t.on ? "" : " off"), n.dataset.idx = String(o), n.appendChild(N(t.on, t.on ? "ON" : "OFF"));
  const r = document.createElement("span");
  r.className = "comfort-name", r.textContent = t.lora || "None", r.title = t.lora || "No lora selected — click to choose", n.appendChild(r);
  const c = document.createElement("span");
  c.className = "comfort-spacer", n.appendChild(c), e.showSeparate ? (n.appendChild(g(t, "one")), n.appendChild(g(t, "two"))) : n.appendChild(g(t, "one"));
  const a = document.createElement("button");
  return a.type = "button", a.className = "comfort-remove", a.textContent = "×", a.title = "Remove lora", n.appendChild(a), n;
}
function s(e) {
  const t = e.el;
  t.innerHTML = "";
  const o = document.createElement("div");
  o.className = "comfort-lora-header";
  const n = y(e), r = N(n !== !1, n === !1 ? "ALL OFF" : "ALL ON");
  r.className += " comfort-toggle-all", r.title = "Toggle all loras", o.appendChild(r);
  const c = document.createElement("span");
  c.className = "comfort-header-labels", e.showSeparate ? (c.appendChild(m("Model")), c.appendChild(m("Clip"))) : c.appendChild(m("Strength")), o.appendChild(c), t.appendChild(o), e.rows.forEach((f, i) => t.appendChild(D(e, f, i)));
  const a = document.createElement("div");
  a.className = "comfort-lora-footer";
  const l = document.createElement("button");
  l.type = "button", l.className = "comfort-add-btn", l.textContent = "➕ Add Lora", a.appendChild(l), t.appendChild(a);
}
function R(e) {
  const t = u.get(e);
  t && (s(t), p(e, t));
}
async function _() {
  try {
    const e = await fetch("/api/models/loras");
    if (!e.ok) return [];
    const t = await e.json();
    return Array.isArray(t) ? t : (t == null ? void 0 : t.name) ?? [];
  } catch {
    return [];
  }
}
async function E(e, t, o, n) {
  const r = await _();
  r.length || (r = ["(no loras found)"]), new LiteGraph.ContextMenu(r, {
    title: "Choose Lora",
    event: o,
    callback: (c) => {
      c !== "(no loras found)" && n(c);
    }
  });
}
function H(e, t, o, n) {
  const r = t.rows[o];
  if (!r) return;
  const c = o > 0, a = o < t.rows.length - 1, l = (f) => {
    const i = o + f;
    if (i < 0 || i >= t.rows.length) return;
    const k = t.rows[o];
    t.rows[o] = t.rows[i], t.rows[i] = k, s(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${r.on ? "⚫" : "◯"} Toggle ${r.on ? "Off" : "On"}`,
        callback: () => {
          r.on = !r.on, s(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !c, callback: () => l(-1) },
      { content: "⬇️ Move Down", disabled: !a, callback: () => l(1) },
      {
        content: "U0001f5d1️ Remove",
        callback: () => {
          t.rows.splice(o, 1), s(t), p(e, t);
        }
      }
    ],
    { title: "LORA", event: n }
  );
}
function F(e, t) {
  const o = t.el;
  o.addEventListener("click", (n) => {
    const r = n.target;
    if (r.closest(".comfort-toggle-all")) {
      T(t), s(t);
      return;
    }
    if (r.closest(".comfort-add-btn")) {
      E(t, e, n, (i) => {
        t.rows.push(A(i)), s(t), p(e, t);
      });
      return;
    }
    const c = r.closest(".comfort-lora-row");
    if (!c) return;
    const a = Number(c.dataset.idx), l = t.rows[a];
    if (!l) return;
    const f = !!r.closest(".comfort-strength-clip");
    if (r.closest(".comfort-toggle")) {
      l.on = !l.on, s(t);
      return;
    }
    if (r.closest(".comfort-name")) {
      E(t, e, n, (i) => {
        l.lora = i, s(t);
      });
      return;
    }
    if (r.closest(".comfort-dec")) {
      C(l, -1, f), s(t);
      return;
    }
    if (r.closest(".comfort-inc")) {
      C(l, 1, f), s(t);
      return;
    }
    if (r.closest(".comfort-remove")) {
      t.rows.splice(a, 1), s(t), p(e, t);
      return;
    }
  }), o.addEventListener("change", (n) => {
    const r = n.target, c = r.closest(".comfort-lora-row");
    if (!c || !r.matches("input[type='number']")) return;
    const a = t.rows[Number(c.dataset.idx)];
    if (!a) return;
    const l = parseFloat(r.value);
    Number.isFinite(l) && (r.closest(".comfort-strength-clip") ? a.strengthTwo = l : a.strength = l);
  }), o.addEventListener("contextmenu", (n) => {
    const r = n.target.closest(".comfort-lora-row");
    r && (n.preventDefault(), n.stopPropagation(), H(e, t, Number(r.dataset.idx), n));
  });
}
function P(e) {
  if (u.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", u.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (o) => {
      t.rows = Array.isArray(o) ? o : [], s(t), p(e, t);
    },
    getMinHeight: () => h(t),
    getMaxHeight: () => h(t)
  })), F(e, t), s(t), p(e, t);
}
const W = ".comfort-lora-list{font-family:inherit;font-size:12px;color:var(--text-color, #eeeeee);-webkit-user-select:none;user-select:none;width:100%;box-sizing:border-box}.comfort-lora-header,.comfort-lora-footer{display:flex;align-items:center;gap:6px;padding:4px 6px}.comfort-lora-header{justify-content:space-between}.comfort-header-labels{display:inline-flex;gap:10px;margin-right:24px}.comfort-col-label{opacity:.6;font-size:11px}.comfort-lora-row{display:flex;align-items:center;gap:6px;padding:4px 6px;margin:3px 0;border-radius:6px;background:#7f7f7f1f}.comfort-lora-row.off .comfort-name{opacity:.5}.comfort-toggle{width:44px;min-width:44px;padding:2px 0;border-radius:10px;border:1px solid rgba(127,127,127,.5);background:transparent;color:inherit;font-size:10px;cursor:pointer}.comfort-toggle.on{background:#2e7d5b;border-color:#2e7d5b;color:#fff}.comfort-toggle.off{opacity:.85}.comfort-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.comfort-spacer{flex:0 0 8px}.comfort-strength{display:flex;align-items:center;gap:2px}.comfort-strength button{width:18px;height:18px;border:1px solid rgba(127,127,127,.4);border-radius:4px;background:transparent;color:inherit;font-size:11px;line-height:1;cursor:pointer;padding:0}.comfort-strength input{width:54px;padding:1px 2px;font-size:11px;text-align:center;background:#00000040;border:1px solid rgba(127,127,127,.35);border-radius:4px;color:inherit}.comfort-remove{width:18px;height:18px;border:none;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;border-radius:4px;padding:0}.comfort-remove:hover{background:#c8505066}.comfort-add-btn{padding:3px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font-size:12px;cursor:pointer}.comfort-add-btn:hover{background:#7f7f7f33}", w = document.createElement("style");
w.setAttribute("data-comfort-plugin", "true");
w.textContent = W;
document.head.appendChild(w);
v.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    x(e) && P(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (!x(e)) return [];
    const t = O(e);
    if (!t) return [];
    const o = (n) => {
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
            callback: () => o(!1)
          },
          {
            content: "Separate Model & Clip",
            checked: () => t.showSeparate,
            callback: () => o(!0)
          }
        ]
      }
    ];
  }
});
export {
  d as NODE_NAME
};
