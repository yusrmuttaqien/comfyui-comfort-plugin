# ComfyUI Comfort Plugin

Dual-renderer rework of select [rgthree-comfy](https://github.com/rgthree/rgthree-comfy)
features for **ComfyUI Nodes 2.0** (Vue renderer) with **legacy LiteGraph** support.

rgthree-comfy's custom canvas-drawn widgets break under Nodes 2.0 (fields stack,
properties won't open, dynamic widgets freeze. See rgthree-comfy issues #632, #714,
#797). This plugin reimplements those features using DOM widgets and official
extension hooks, which render natively in both renderers.

## Nodes

### Power Lora Loader (comfort)

Condensed multi-LoRA loader:
- Add unlimited lora rows (`Add Lora`), each with on/off toggle, lora chooser,
  and strength control (`-` / value / `+` or type directly).
- Node right-click menu: **Show Strengths** > Single or Separate Model & Clip.
- Right-click a row: toggle, move up/down, remove.
- Header **ALL ON / ALL OFF** toggle.
- Muted/bypassed state persists across save/load (fixes rgthree #797).

### Fast Muter (comfort) / Fast Bypasser (comfort)

Connect any nodes to its inputs. Each connected node appears as a toggle row.
Click a row to mute (or bypass) that node. Right-click the node for **Enable all**
/ **Disable all** / **Toggle all**. Rows rebuild automatically as connections
change, and follow through Reroute / Collector / Combiner passthrough nodes.

### Node Collector (comfort)

A passthrough fan-in: bundle many nodes behind a single `*` output. Downstream
nodes (e.g. a Fast Muter) see the collected nodes as their real connections.

### Mute / Bypass Repeater (comfort)

A master switch: when its own mode (Always / Mute / Bypass) changes, it repeats
that mode to every node connected to its inputs. If nothing is connected but it
sits inside a group, it applies to the whole group.

### Mode Relay (comfort)

Watches the mode of the nodes connected to its inputs and drives a connected
Repeater with the result (all muted: MUTE, all bypassed: BYPASS, any active:
ACTIVE). The mapping is configurable per mode via properties. With no inputs it
acts as a plain mode forwarder.

### Random Unmuter (comfort)

Each time a prompt is queued, temporarily unmutes one randomly-chosen connected
node (which must be muted) for the duration of the prompt, then mutes it back.
All connected nodes must be muted for it to act.

### Fast Groups Muter (comfort) / Fast Groups Bypasser (comfort)

Lists every group in the workflow as a toggle row. Clicking one mutes (or
bypasses) all nodes inside that group. The toggle reflects whether the group has
any active nodes. Right-click for **Enable all** / **Disable all** / **Toggle
all**. Set the `matchTitle` property to filter which groups appear.

### Any Router (comfort)

Routes one of several any-type inputs to a single any output. Inputs are dynamic
(`any_01`, `any_02`, ... grow on connect, trimmed when unused) and are retyped
to the connected type. The **selection** combo picks the routing rule:
- **Non-empty** (default): the backend returns the first input that is not
  empty.
- **Active source**: at build time only the first input whose source node is
  active (not muted / not bypassed) is kept, so that one is routed.

Mute or bypass a source to switch which input wins in *active source* mode.

### Image Comparer (comfort)

Compares two images with a wipe slider. Connect `image_left` and `image_right`.
On execution both sides are saved and displayed side-by-side with a draggable
divider. The left image shows fully by default. Hover over the stage to reveal
the handle and slide to compare. Multi-image batches get prev/next navigation.
The right image passes through as the `IMAGE` output.

## Features (no node required)

These are always-on behaviors, not nodes:

- **Auto-nest combo menus**: model/VAE/clip combo dropdowns that list files
  with subdirectory paths are split into folder submenus (folders show a folder
  prefix), so long flat lists become navigable trees. Files without a path are
  listed as-is.
- **Group header quick toggles**: hovering or selecting a group shows **M**
  and **B** buttons in its header. Clicking **M** mutes / unmutes every node in
  the group. **B** bypasses / un-bypasses them. The buttons are a DOM overlay so
  they stay on top in both renderers, and they track pan/zoom/group drags.

## Install

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/yusrmuttaqien/comfyui-comfort-plugin.git
# restart ComfyUI
```

No build step needed. Built JS is committed in `web/`.

## Development

```bash
npm install
npm run build   # outputs web/comfort.js + web/comfort.css
```

Built output is committed. Users clone-and-go.

## Design notes (dual renderer)

- All custom widgets are **DOM widgets** (`node.addDOMWidget`): legacy LiteGraph
  positions them directly. Nodes 2.0 mounts the same element via `WidgetDOM`.
- No `LGraphNode`/`LGraphCanvas` prototype patching. Only official extension
  hooks (`nodeCreated`, `getNodeMenuItems`). The exception is queue-time
  behavior: the Random Unmuter wraps `app.queuePrompt` / `app.graphToPrompt`
  (ComfyUI exposes no official queue/execute hook).
- Per-node state lives in a `WeakMap` keyed by node instance (node instances are
  destroyed/recreated on tab switch and subgraph navigation).
- Node sizing: new nodes get a fixed initial size via `setSize`. No auto-resize
  on content changes. User controls size by dragging. Content scrolls via
  `overflow-y: auto` if the node is too small.
- `node.mode` is intercepted per-instance (`Object.defineProperty`) so
  `onModeChange` fires: it delegates to the `_state.mode` accessor in Nodes 2.0
  and to a private field in legacy LiteGraph.

## Roadmap

See [CHANGELOG.md](./CHANGELOG.md).

- M1: Power Lora Loader
- M2: Fast Muter/Bypasser, Fast Groups Muter/Bypasser, Repeater/Relay, Random
  Unmuter, Node Collector
- M3: auto-nest subdirectories, group-header quick toggles
- Any Router (server-backed any-input router, non-empty / active-source)
- Image Comparer (wipe-slider image comparison)
- NInfer Suspend Gate: moved to [comfyui-vram-purge-plugin](https://github.com/yusrmuttaqien/comfyui-vram_purge-plugin)
