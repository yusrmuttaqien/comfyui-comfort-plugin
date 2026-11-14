// Image Comparer (comfort) — wipe-slider image comparison, dual-renderer.
// Re-worked from rgthree-comfy (MIT) and native ComfyUI ImageCompare (Vue-only).

import { app } from "/scripts/app.js";

export const IMAGE_COMPARER = "Image Comparer (comfort)";
const NODE_W = 512;
const NODE_H = 488;

export function isComfortImageComparer(node: any): boolean {
  return (
    node?.type === IMAGE_COMPARER ||
    node?.comfyClass === IMAGE_COMPARER ||
    node?.constructor?.comfyClass === IMAGE_COMPARER
  );
}

type CiState = {
  el: HTMLElement;
  stage: HTMLElement;
  leftImg: HTMLImageElement;
  rightImg: HTMLImageElement;
  handle: HTMLElement;
  empty: HTMLElement;
  navEl: HTMLElement;
  leftUrls: string[];
  rightUrls: string[];
  leftIdx: number;
  rightIdx: number;
  rafId: number | null;
};

const stateMap = new WeakMap<any, CiState>();

function imageUrl(data: any): string {
  const params = new URLSearchParams({
    filename: data.filename,
    type: data.type,
    subfolder: data.subfolder,
  });
  const a = app as any;
  let url: string;
  try {
    url = a?.api?.apiURL?.(`/view?${params.toString()}`) ?? `/view?${params.toString()}`;
  } catch {
    url = `/view?${params.toString()}`;
  }
  if (typeof a?.getPreviewFormatParam === "function") url += a.getPreviewFormatParam();
  if (typeof a?.getRandParam === "function") url += a.getRandParam();
  return url;
}

function setWipe(st: CiState, pos: number): void {
  st.handle.style.left = `${pos}%`;
  st.leftImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
}

function renderNav(st: CiState): void {
  st.navEl.innerHTML = "";
  const sides = [
    { label: "LEFT", count: st.leftUrls.length, idx: () => st.leftIdx, set: (i: number) => { st.leftIdx = i; st.leftImg.src = st.leftUrls[i] || ""; } },
    { label: "RIGHT", count: st.rightUrls.length, idx: () => st.rightIdx, set: (i: number) => { st.rightIdx = i; st.rightImg.src = st.rightUrls[i] || ""; } },
  ];
  for (const s of sides) {
    if (s.count <= 1) continue;
    const wrap = document.createElement("span");
    wrap.className = "ci-nav-side";
    const prev = document.createElement("button");
    prev.type = "button";
    prev.textContent = "‹";
    prev.addEventListener("click", () => s.set(Math.max(0, s.idx() - 1)));
    const mid = document.createElement("span");
    mid.textContent = `${s.label} ${s.idx() + 1}/${s.count}`;
    const next = document.createElement("button");
    next.type = "button";
    next.textContent = "›";
    next.addEventListener("click", () => s.set(Math.min(s.count - 1, s.idx() + 1)));
    wrap.appendChild(prev);
    wrap.appendChild(mid);
    wrap.appendChild(next);
    st.navEl.appendChild(wrap);
  }
}

function applyImages(st: CiState, leftImages: string[], rightImages: string[]): void {
  st.leftUrls = leftImages;
  st.rightUrls = rightImages;
  if (st.leftIdx >= st.leftUrls.length) st.leftIdx = 0;
  if (st.rightIdx >= st.rightUrls.length) st.rightIdx = 0;
  const hasLeft = st.leftUrls.length > 0;
  const hasRight = st.rightUrls.length > 0;
  st.leftImg.src = hasLeft ? st.leftUrls[st.leftIdx] : "";
  st.rightImg.src = hasRight ? st.rightUrls[st.rightIdx] : "";
  st.leftImg.style.display = hasLeft ? "" : "none";
  st.rightImg.style.display = hasRight ? "" : "none";
  const both = hasLeft && hasRight;
  st.handle.style.display = "none";
  st.leftImg.style.clipPath = "none";
  st.empty.style.display = hasLeft || hasRight ? "none" : "";
  setWipe(st, 100);
  renderNav(st);
}

function updateFromResult(node: any, output: any): void {
  const st = stateMap.get(node);
  if (!st) return;
  const out = output || {};
  const left = Array.isArray(out.left_images) ? out.left_images.map(imageUrl) : [];
  const right = Array.isArray(out.right_images) ? out.right_images.map(imageUrl) : [];
  applyImages(st, left, right);
}

export function setupImageComparerNode(node: any): void {
  if (stateMap.has(node)) return;

  const el = document.createElement("div");
  el.className = "comfort-image-comparer";

  const navEl = document.createElement("div");
  navEl.className = "ci-nav";
  el.appendChild(navEl);

  const stage = document.createElement("div");
  stage.className = "ci-stage";

  const rightImg = document.createElement("img");
  rightImg.className = "ci-img ci-right";
  rightImg.draggable = false;

  const leftImg = document.createElement("img");
  leftImg.className = "ci-img ci-left";
  leftImg.draggable = false;

  const handle = document.createElement("div");
  handle.className = "ci-handle";

  const empty = document.createElement("div");
  empty.className = "ci-empty";
  empty.textContent = "Connect images and run";

  stage.appendChild(rightImg);
  stage.appendChild(leftImg);
  stage.appendChild(handle);
  stage.appendChild(empty);
  el.appendChild(stage);

  const st: CiState = {
    el, stage, leftImg, rightImg, handle, empty, navEl,
    leftUrls: [], rightUrls: [], leftIdx: 0, rightIdx: 0, rafId: null,
  };
  stateMap.set(node, st);

  stage.addEventListener("mouseenter", () => {
    if (st.leftUrls.length && st.rightUrls.length) st.handle.style.display = "";
  });
  stage.addEventListener("mouseleave", () => {
    st.handle.style.display = "none";
    setWipe(st, 100);
  });
  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    if (r.width <= 0) return;
    const pos = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    setWipe(st, pos);
  });

  if (!node.__comfortLoaded) {
    node.setSize?.([NODE_W, NODE_H]);
  }
  if (typeof node.addDOMWidget === "function") {
    node.addDOMWidget("compare", "comfort_image_compare", el, {
      serialize: false,
      hideOnZoom: true,
      getMinHeight: () => 200,
      getMaxHeight: () => 0,
    });
  }

  const syncHeight = () => {
    if (!node.graph) { st.rafId = null; return; }
    const h = node.size ? node.size[1] : NODE_H;
    const widget = node.widgets?.find((w: any) => w.name === "compare");
    const yOff = widget && typeof widget.y === "number" ? widget.y : 20;
    el.style.height = Math.max(60, h - yOff - 20) + "px";
    st.rafId = requestAnimationFrame(syncHeight);
  };
  st.rafId = requestAnimationFrame(syncHeight);

  const origOnRemoved = node.onRemoved?.bind(node);
  node.onRemoved = (...args: any[]) => {
    if (st.rafId !== null) cancelAnimationFrame(st.rafId);
    origOnRemoved?.(...args);
  };
}

export function augmentImageComparerClass(nodeType: any): void {
  if (!nodeType || nodeType.__comfortImageComparer) return;
  const base = nodeType.prototype.onExecuted;
  nodeType.prototype.onExecuted = function (output: any) {
    base?.call(this, output);
    updateFromResult(this, output);
  };
  const baseConfigure = nodeType.prototype.configure;
  nodeType.prototype.configure = function (data: any) {
    baseConfigure?.call(this, data);
    this.__comfortLoaded = true;
  };
  nodeType.__comfortImageComparer = true;
}
