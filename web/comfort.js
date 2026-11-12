import { app as N } from "scripts/app.js";
const p = "Power Lora Loader (comfort)", m = /* @__PURE__ */ new WeakMap(), M = 32, k = 36, y = 34, w = 14, O = 380;
function C(e) {
  var t;
  return (e == null ? void 0 : e.type) === p || (e == null ? void 0 : e.comfyClass) === p || ((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.comfyClass) === p;
}
function x(e) {
  return m.get(e);
}
function g(e) {
  return w + M + e.rows.length * k + y + w;
}
function f(e, t) {
  var o;
  if (!e.size) return;
  const n = g(t), r = Math.max(e.size[0] || 0, O);
  (e.size[1] !== n || e.size[0] !== r) && ((o = e.setSize) == null || o.call(e, [r, n]));
}
function A(e) {
  return { lora: e ?? null, on: !0, strength: 1, strengthTwo: null };
}
function L(e) {
  let t = !0, n = !0;
  for (const r of e.rows)
    if (t = t && r.on === !0, n = n && r.on === !1, !t && !n) return null;
  return !!(t && e.rows.length > 0);
}
function T(e) {
  const t = !L(e);
  for (const n of e.rows) n.on = t;
}
function b(e, t, n) {
  const r = n ? "strengthTwo" : "strength", o = e[r] ?? 1;
  e[r] = Math.round((o + t * 0.05) * 100) / 100;
}
function v(e, t) {
  const n = document.createElement("button");
  return n.type = "button", n.className = "comfort-toggle " + (e ? "on" : "off"), n.textContent = t, n;
}
function d(e) {
  const t = document.createElement("span");
  return t.className = "comfort-col-label", t.textContent = e, t;
}
function h(e, t) {
  const n = document.createElement("div");
  n.className = "comfort-strength" + (t === "two" ? " comfort-strength-clip" : "");
  const r = document.createElement("button");
  r.type = "button", r.className = "comfort-dec", r.textContent = "−", r.title = "Decrease strength";
  const o = document.createElement("button");
  o.type = "button", o.className = "comfort-inc", o.textContent = "+", o.title = "Increase strength";
  const c = document.createElement("input");
  return c.type = "number", c.step = "0.05", c.min = "-2", c.max = "3", c.value = String(t === "two" ? e.strengthTwo ?? 1 : e.strength), c.title = t === "two" ? "Clip strength" : "Strength", n.appendChild(r), n.appendChild(c), n.appendChild(o), n;
}
function D(e, t, n) {
  const r = document.createElement("div");
  r.className = "comfort-lora-row" + (t.on ? "" : " off"), r.dataset.idx = String(n), r.appendChild(v(t.on, t.on ? "ON" : "OFF"));
  const o = document.createElement("span");
  o.className = "comfort-name", o.textContent = t.lora || "None", o.title = t.lora || "No lora selected — click to choose", r.appendChild(o);
  const c = document.createElement("span");
  c.className = "comfort-spacer", r.appendChild(c), e.showSeparate ? (r.appendChild(h(t, "one")), r.appendChild(h(t, "two"))) : r.appendChild(h(t, "one"));
  const l = document.createElement("button");
  return l.type = "button", l.className = "comfort-remove", l.textContent = "×", l.title = "Remove lora", r.appendChild(l), r;
}
function a(e) {
  const t = e.el;
  t.innerHTML = "";
  const n = document.createElement("div");
  n.className = "comfort-lora-header";
  const r = L(e), o = v(r !== !1, r === !1 ? "ALL OFF" : "ALL ON");
  o.className += " comfort-toggle-all", o.title = "Toggle all loras", n.appendChild(o);
  const c = document.createElement("span");
  c.className = "comfort-header-labels", e.showSeparate ? (c.appendChild(d("Model")), c.appendChild(d("Clip"))) : c.appendChild(d("Strength")), n.appendChild(c), t.appendChild(n), e.rows.forEach((u, i) => t.appendChild(D(e, u, i)));
  const l = document.createElement("div");
  l.className = "comfort-lora-footer";
  const s = document.createElement("button");
  s.type = "button", s.className = "comfort-add-btn", s.textContent = "➕ Add Lora", l.appendChild(s), t.appendChild(l);
}
function R(e) {
  const t = m.get(e);
  t && (a(t), f(e, t));
}
async function E(e, t, n, r) {
  let o = [];
  try {
    const c = await N.api.getList("loras");
    o = (c == null ? void 0 : c.name) ?? [];
  } catch {
    o = [];
  }
  o.length || (o = ["(no loras found)"]), new LiteGraph.ContextMenu(o, {
    title: "Choose Lora",
    event: n,
    callback: (c) => {
      c !== "(no loras found)" && r(c);
    }
  });
}
function _(e, t, n, r) {
  const o = t.rows[n];
  if (!o) return;
  const c = n > 0, l = n < t.rows.length - 1, s = (u) => {
    const i = n + u;
    if (i < 0 || i >= t.rows.length) return;
    const S = t.rows[n];
    t.rows[n] = t.rows[i], t.rows[i] = S, a(t);
  };
  new LiteGraph.ContextMenu(
    [
      {
        content: `${o.on ? "⚫" : "◯"} Toggle ${o.on ? "Off" : "On"}`,
        callback: () => {
          o.on = !o.on, a(t);
        }
      },
      null,
      { content: "⬆️ Move Up", disabled: !c, callback: () => s(-1) },
      { content: "⬇️ Move Down", disabled: !l, callback: () => s(1) },
      {
        content: "U0001f5d1️ Remove",
        callback: () => {
          t.rows.splice(n, 1), a(t), f(e, t);
        }
      }
    ],
    { title: "LORA", event: r }
  );
}
function z(e, t) {
  const n = t.el;
  n.addEventListener("click", (r) => {
    const o = r.target;
    if (o.closest(".comfort-toggle-all")) {
      T(t), a(t);
      return;
    }
    if (o.closest(".comfort-add-btn")) {
      E(t, e, r, (i) => {
        t.rows.push(A(i)), a(t), f(e, t);
      });
      return;
    }
    const c = o.closest(".comfort-lora-row");
    if (!c) return;
    const l = Number(c.dataset.idx), s = t.rows[l];
    if (!s) return;
    const u = !!o.closest(".comfort-strength-clip");
    if (o.closest(".comfort-toggle")) {
      s.on = !s.on, a(t);
      return;
    }
    if (o.closest(".comfort-name")) {
      E(t, e, r, (i) => {
        s.lora = i, a(t);
      });
      return;
    }
    if (o.closest(".comfort-dec")) {
      b(s, -1, u), a(t);
      return;
    }
    if (o.closest(".comfort-inc")) {
      b(s, 1, u), a(t);
      return;
    }
    if (o.closest(".comfort-remove")) {
      t.rows.splice(l, 1), a(t), f(e, t);
      return;
    }
  }), n.addEventListener("change", (r) => {
    const o = r.target, c = o.closest(".comfort-lora-row");
    if (!c || !o.matches("input[type='number']")) return;
    const l = t.rows[Number(c.dataset.idx)];
    if (!l) return;
    const s = parseFloat(o.value);
    Number.isFinite(s) && (o.closest(".comfort-strength-clip") ? l.strengthTwo = s : l.strength = s);
  }), n.addEventListener("contextmenu", (r) => {
    const o = r.target.closest(".comfort-lora-row");
    o && (r.preventDefault(), r.stopPropagation(), _(e, t, Number(o.dataset.idx), r));
  });
}
function H(e) {
  if (m.has(e)) return;
  const t = {
    rows: [],
    showSeparate: !1,
    el: document.createElement("div"),
    widget: null
  };
  t.el.className = "comfort-lora-list", m.set(e, t), e.serialize_widgets = !0, typeof e.addDOMWidget == "function" && (t.widget = e.addDOMWidget("loras", "comfort_lora_list", t.el, {
    serialize: !0,
    hideOnZoom: !0,
    getValue: () => t.rows,
    setValue: (n) => {
      t.rows = Array.isArray(n) ? n : [], a(t), f(e, t);
    },
    getMinHeight: () => g(t),
    getMaxHeight: () => g(t)
  })), z(e, t), a(t), f(e, t);
}
N.registerExtension({
  name: "comfort.PowerLoraLoader",
  nodeCreated(e) {
    C(e) && H(e);
  },
  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(e) {
    if (!C(e)) return [];
    const t = x(e);
    if (!t) return [];
    const n = (r) => {
      t.showSeparate = r, R(e);
    };
    return [
      null,
      {
        content: "Show Strengths",
        submenu: [
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
    ];
  }
});
export {
  p as NODE_NAME
};
