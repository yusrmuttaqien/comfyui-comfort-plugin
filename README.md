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

### Fast Muter (comfort) / Fast Bypasser (comfort)
Connect any nodes to its inputs; each connected node appears as a toggle row.
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
Repeater with the result (all muted → MUTE, all bypassed → BYPASS, any active →
ACTIVE). The mapping is configurable per mode via properties; with no inputs it
acts as a plain mode forwarder.

### Random Unmuter (comfort)
Each time a prompt is queued, temporarily unmutes one randomly-chosen connected
node (which must be muted) for the duration of the prompt, then mutes it back.
All connected nodes must be muted for it to act.

### Fast Groups Muter (comfort) / Fast Groups Bypasser (comfort)
Lists every group in the workflow as a toggle row; clicking one mutes (or
bypasses) all nodes inside that group. The toggle reflects whether the group has
any active nodes. Right-click for **Enable all** / **Disable all** / **Toggle
all**. Set the `matchTitle` property to filter which groups appear.

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
  hooks (`nodeCreated`, `getNodeMenuItems`). The one exception is the Random
  Unmuter, which wraps `app.queuePrompt` / `app.graphToPrompt` because ComfyUI
  exposes no official queue/execute hook.
- Per-node state lives in a `WeakMap` keyed by node instance (node instances are
  destroyed/recreated on tab switch and subgraph navigation).
- Node sizing via explicit `setSize` (works in both renderers; `setDirtyCanvas`
  is a no-op in Vue mode, so it is not relied upon).
- `node.mode` is intercepted per-instance (`Object.defineProperty`) so
  `onModeChange` fires: it delegates to the `_state.mode` accessor in Nodes 2.0
  and to a private field in legacy LiteGraph.

## Roadmap

See [CHANGELOG.md](./CHANGELOG.md).

- M1: Power Lora Loader ✅
- M2: Fast Muter/Bypasser, Fast Groups Muter/Bypasser, Repeater/Relay, Random
  Unmuter, Node Collector ✅
- M3: Progress bar, auto-nest subdirectories, group-header quick toggles
