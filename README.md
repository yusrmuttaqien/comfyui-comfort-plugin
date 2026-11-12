# ComfyUI Comfort Plugin

Dual-renderer rework of select [rgthree-comfy](https://github.com/rgthree/rgthree-comfy)
features for **ComfyUI Nodes 2.0** (Vue renderer) with **legacy LiteGraph** support.

rgthree-comfy's custom canvas-drawn widgets break under Nodes 2.0 (fields stack,
properties won't open, dynamic widgets freeze — see rgthree-comfy issues #632, #714,
#797). This plugin reimplements those features using DOM widgets and official
extension hooks, which render natively in both renderers.

## Nodes

### Power Lora Loader (comfort)
Condensed multi-LoRA loader:
- Add unlimited lora rows (`➕ Add Lora`), each with on/off toggle, lora chooser,
  and strength control (`−` / value / `+` or type directly).
- Node right-click menu → **Show Strengths** → Single or Separate Model & Clip.
- Right-click a row: toggle, move up/down, remove.
- Header **ALL ON / ALL OFF** toggle.
- Muted/bypassed state persists across save/load (fixes rgthree #797).

## Install

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/yusrmuttaqien/comfyui-comfort-plugin.git
# restart ComfyUI
```

No build step needed — built JS is committed in `web/`.

## Development

```bash
npm install
npm run build   # outputs web/comfort.js + web/comfort.css
```

Built output is committed; users clone-and-go.

## Design notes (dual renderer)

- All custom widgets are **DOM widgets** (`node.addDOMWidget`): legacy LiteGraph
  positions them directly; Nodes 2.0 mounts the same element via `WidgetDOM`.
- No `LGraphNode`/`LGraphCanvas` prototype patching; only official extension
  hooks (`nodeCreated`, `getNodeMenuItems`).
- Per-node state lives in a `WeakMap` keyed by node instance (node instances are
  destroyed/recreated on tab switch and subgraph navigation).
- Node sizing via explicit `setSize` (works in both renderers; `setDirtyCanvas`
  is a no-op in Vue mode, so it is not relied upon).

## Roadmap

See [CHANGELOG.md](./CHANGELOG.md).

- M1: Power Lora Loader ✅(in progress)
- M2: Fast Muter/Bypasser, Fast Groups Muter/Bypasser, Repeater/Relay, Random
  Unmuter, Node Collector
- M3: Progress bar, auto-nest subdirectories, group-header quick toggles
