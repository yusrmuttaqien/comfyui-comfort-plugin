// Image Comparer (comfort) — dual-renderer frontend.
//
// A server-backed node that compares two images with a wipe slider. Connect an
// image to `image_left` and another to `image_right`; after a run the node
// shows both and lets you wipe between them by moving the mouse (the left image
// is revealed from the left over the right image, which is the base).
//
// The comparison UI is one DOM widget (renders natively in both the legacy
// LiteGraph and Nodes 2.0 Vue renderers), so no canvas drawing or prototype
// patching is involved. Re-worked from rgthree-comfy's Image Comparer (MIT)
// and the native ComfyUI ImageCompare (whose widget is Vue-only).

import { app } from "/scripts/app.js";

export const IMAGE_COMPARER = "Image Comparer (comfort)";

// Default node width (px). The stage keeps a fixed 11:10 aspect ratio and scales
// with the node width; the node's height auto-computes to fit it.
const NODE_W = 512;

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
};

const stateMap = new WeakMap<any, CiState>();

// Build a /view URL for a temp-saved image ({filename, subfolder, type}).
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
  // image_left is the "before" layer, revealed from the left; image_right is
  // the base. At pos=50 the left half shows image_left, the right half
  // image_right.
  st.leftImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
}

function renderNav(st: CiState): void {
  st.navEl.innerHTML = "";
  const sides: Array<{
    label: string;
    count: number;
    idx: () => number;
    set: (i: number) => void;
  }> = [
    {
      label: "LEFT",
      count: st.leftUrls.length,
      idx: () => st.leftIdx,
      set: (i) => {
        st.leftIdx = i;
        st.leftImg.src = st.leftUrls[i] || "";
      },
    },
    {
      label: "RIGHT",
      count: st.rightUrls.length,
      idx: () => st.rightIdx,
      set: (i) => {
        st.rightIdx = i;
        st.rightImg.src = st.rightUrls[i] || "";
      },
    },
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
  st.handle.style.display = both ? "" : "none";
  st.leftImg.style.clipPath = both ? "" : "none";
  st.empty.style.display = hasLeft || hasRight ? "none" : "";
  // Reset the divider to the middle when the images change.
  setWipe(st, 50);
  renderNav(st);
}

/**
 * Update the widget from a node execution result. `output` is the node's `ui`
 * dict: { left_images: [{filename,subfolder,type}], right_images: [...] }.
 */
function updateFromResult(node: any, output: any): void {
  const st = stateMap.get(node);
  if (!st) return;
  const out = output || {};
  const left = Array.isArray(out.left_images)
    ? out.left_images.map(imageUrl)
    : [];
  const right = Array.isArray(out.right_images)
    ? out.right_images.map(imageUrl)
    : [];
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
    el,
    stage,
    leftImg,
    rightImg,
    handle,
    empty,
    navEl,
    leftUrls: [],
    rightUrls: [],
    leftIdx: 0,
    rightIdx: 0,
  };
  stateMap.set(node, st);

  // Mouse-driven wipe (mirrors the native ComfyUI ImageCompare behavior).
  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    if (r.width <= 0) return;
    const pos = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    setWipe(st, pos);
  });

  // The stage keeps a fixed 11:10 aspect ratio and scales with the node width.
  // Report the node's height (title + stage + nav row) as a function of the node
  // width so the renderer sizes the node to fit the stage; constrain the minimum
  // size so the preview never overflows the node. The 24px horizontal margin and
  // 20px title height match the renderer's layout at the default width.
  const MARGIN = 24;
  const widgetHeightFor = (w: number): number =>
    Math.round(Math.max(0, w - MARGIN) / 1.1 + 28 + 20);
  const nodeWidth = (): number => node.size?.[0] ?? node.width;
  // Size the node before registering the widget so the widget container adopts
  // the full width (legacy otherwise pins it to the node's pre-resize width).
  // The stage's own width is CSS `width: 100%` (of the widget container), so it
  // tracks the node width as the container grows.
  node.setSize?.([NODE_W, widgetHeightFor(NODE_W)]);
  if (typeof node.addDOMWidget === "function") {
    node.addDOMWidget("compare", "comfort_image_compare", el, {
      serialize: false,
      hideOnZoom: true,
      getMinHeight: () => widgetHeightFor(nodeWidth()),
      getMaxHeight: () => widgetHeightFor(nodeWidth()),
    });
  }
  node.minHeight = 300;
  // The renderer only consults the widget's max/min height during the initial
  // layout, so a manual resize keeps the stale height. Wrap setSize to keep the
  // node height in sync with the stage (which tracks the width) on every resize.
  const origSetSize = node.setSize?.bind(node);
  if (origSetSize) {
    node.setSize = (w: any, h: any) => {
      let nw: number | undefined;
      if (Array.isArray(w)) nw = w[0];
      else nw = w;
      if (typeof nw === "number" && isFinite(nw)) nw = Math.max(node.minWidth || 0, nw);
      return origSetSize([nw, widgetHeightFor(nw)]);
    };
  }
  node.setSize?.([NODE_W, widgetHeightFor(NODE_W)]);
  // Legacy sets the widget container to the pre-resize width at creation and
  // only grows it on a later resize. Re-apply the size once the node has
  // settled so the container (and the stage, which is 100% of it) adopts the
  // full width immediately.
  setTimeout(() => {
    if (node.graph && node.size) node.setSize([node.size[0], node.size[1]]);
  }, 500);
}

/**
 * Augment ComfyUI's auto-generated class for this node in place: wrap
 * `onExecuted` so the execution result (the temp-saved image URLs) updates the
 * wipe widget. Called from beforeRegisterNodeDef.
 */
export function augmentImageComparerClass(nodeType: any): void {
  if (!nodeType || nodeType.__comfortImageComparer) return;
  const base = nodeType.prototype.onExecuted;
  nodeType.prototype.onExecuted = function (output: any) {
    base?.call(this, output);
    updateFromResult(this, output);
  };
  nodeType.__comfortImageComparer = true;
}
