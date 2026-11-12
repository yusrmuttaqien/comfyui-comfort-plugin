# Changelog

Dual-renderer rework of select rgthree-comfy features for ComfyUI Nodes 2.0 (Vue renderer) with legacy LiteGraph support.
All dates UTC. Status: 🚧 in progress / ✅ done / ⏸️ blocked.

## Unreleased

### M1 — Power Lora Loader (✅ core, verified on Nodes 2.0)
- [x] Repo scaffold: Vite+TS build, pyproject.toml, `__init__.py`, README
- [x] Python backend (`py/power_lora_loader.py`) adapted from rgthree-comfy (MIT, credited)
- [x] Frontend: lora rows as DOM widgets (dual renderer; no canvas-drawn widgets)
- [x] Right-click row menu: move up/down, toggle, remove
- [x] "Add Lora" button + header, strengths (combined / model+clip)
- [x] Build to `web/`, commit built output
- [x] Browser-verified on Nodes 2.0 (2026-12-13): node creation, lora chooser (real `/api/models/loras` data), add multiple loras, per-row toggle + dimming, strength inc/dec, row right-click menu (toggle/move/remove), node menu "Show Strengths" → Single / Separate Model & Clip (re-renders with model+clip columns), save/reload persistence of rows + strengths + node size
- [x] Tab switch survival: node instances recreated, widget re-mounts with full state (2026-12-13)
- [x] Subgraph survival (rgthree #714 scenario): convert node to subgraph → enter → widget renders with full state inside → exit → unpack → node restored at root (2026-12-13)
- [x] Muted/bypassed mode serialization (rgthree #797): node bypassed (mode 4) survives save + reload with rows intact (2026-12-13)
- [x] Legacy LiteGraph renderer verification (2026-12-13): widget renders, toggle + strength inc/dec work, row context menu works (emoji render), node menu "Show Strengths" present, submenu (Single / Separate) works, mode toggle re-renders + resizes node, save/reload round-trip preserves rows + strengths + toggle + mode

#### Legacy LiteGraph verification notes (2026-12-13)
- The current frontend keeps a **legacy menu compat layer**: `LGraphCanvas.prototype.getNodeMenuOptions` is wrapped so that items returned by the `getNodeMenuItems` extension hook are appended to legacy node menus. Our "Show Strengths" item therefore appears in legacy mode with no extra code.
- Legacy submenus are **native LiteGraph static submenus** (`has_submenu` + `submenu.options`), opened on click/`pointerenter`. No `show_submenu`/`hide_submenu` callbacks needed (those were only for the Vue `reka-ui` `DropdownMenuSub`).
- The canvas suppresses the native `contextmenu` event (`_doNothing`) and drives menus from pointer events, so programmatic triggers must call `canvas.getNodeMenuOptions(node)` + `new LiteGraph.ContextMenu(items, {event})` rather than dispatch a synthetic `contextmenu`.

#### Fixes found during browser verification (2026-12-13)
1. **Extension module silently rejected**: the Nodes 2.0 frontend loads extension modules via dynamic `import(url)` without an import map, so the bare specifier `scripts/app.js` failed. Use absolute `/scripts/app.js` (and mark it external in Vite).
2. **Extension CSS not auto-loaded**: the new frontend no longer auto-injects extension `web/*.css`. Styles are inlined via Vite `?inline` and injected as a `<style>` element at startup (with a `comfort-styles` id guard against double injection).
3. **`app.api.getList("loras")` gone** in the new frontend; loras are fetched from `/api/models/loras` directly, handling both array and `{name: [...]}` response shapes.
4. **Node context menu submenus**: Vue's `contextMenuConverter` only maps items with `has_submenu: true` + `submenu.options` (LiteGraph static-submenu shape). A bare `submenu` array produces a dead item in Nodes 2.0. The same shape works in legacy LiteGraph.

### M2 — Mute/Bypass family (✅ verified on both renderers)
- [x] `ComfortVirtualNode` base — dual-renderer `node.mode` interceptor (`Object.defineProperty` delegating to `_state.mode` in Nodes 2.0 / private field in legacy) firing `onModeChange`; `configuring` flag matches rgthree (false default, sync during `configure()`)
- [x] `ComfortFanInNode` base — dynamic `*` inputs, trailing free slot, input renamed to node title, follows through Reroute / Collector / Combiner passthroughs (`getConnectedNodes`)
- [x] Fast Muter / Fast Bypasser — DOM toggle row per connected node; right-click Enable/Disable/Toggle all
- [x] Node Collector — passthrough fan-in behind a single `*` output
- [x] Mute / Bypass Repeater — propagates its mode to connected inputs (or enclosing group); brings newly-connected nodes in line
- [x] Mode Relay — votes on input modes, drives a connected Repeater (all-muted→MUTE, all-bypassed→BYPASS, any-active→ACTIVE); per-mode property remapping; plain forwarder with no inputs
- [x] Random Unmuter — on queue, temporarily unmutes one random muted connected node for the prompt build, then re-mutes (wraps `app.queuePrompt` / `app.graphToPrompt`; ComfyUI has no official queue hook)
- [x] Fast Groups Muter / Bypasser — lists workflow groups as toggle rows; clicking mutes/bypasses all nodes in the group; toggle tracks live group state; right-click bulk actions; `matchTitle` filter
- [x] `changeModeOfNodes` accepts single node or array
- [x] Browser-verified on Nodes 2.0 (2026-12-14): Fast Muter/Bypasser toggle + bulk menu + save/reload; Collector→Muter passthrough; Repeater propagation (0/2/4) + group fallback; Relay chain (monitored node → Relay → Repeater → target, both directions); Random Unmuter (random pick + re-mute + queue guard); Fast Groups (list, toggle both ways, bulk)
- [x] Legacy LiteGraph spot-check (2026-12-14): Repeater mode propagation works via the interceptor's legacy path (0↔2)

#### M2 design notes
- Virtual nodes registered via `LiteGraph.registerNodeType` at module load (works in both renderers); `category = "comfort"`.
- Class hierarchy: `ComfortVirtualNode` → `ComfortFanInNode` → { `ComfortAnyInputNode` (Muter/Bypasser), `ModeRepeater`, `ModeRelay`, `RandomUnmuter`, `NodeCollector` }; `ComfortVirtualNode` → `FastGroupsMuterNode` (Muter/Bypasser).
- Repeater / Relay / Fast Groups poll on a shared `setInterval` (per-node state is cheap to recompute; the timer is cleared when the last instance is removed). The Random Unmuter reacts to queue events instead.

### M3 — Features (✅ verified on both renderers)
- [x] Progress bar — queue position + execution progress (nodes done, current node, step/max), red error state with node + message. Wraps `api.queuePrompt` and listens to `status` / `executing` / `progress` / `execution_start` / `execution_error`. Verified rendering of node %, multi-pass, error, idle and queued states.
- [x] Auto-nest subdirectories — wraps `LiteGraph.ContextMenu` and splits flat combo lists (>10 items) that contain subdirectory paths into folder submenus (📁 prefix). Verified: top-level shows folders + root files; clicking a folder opens the sub-path list; clicking a leaf passes the full path.
- [x] Group header quick toggles — M / B buttons in a group's header on hover/selection; M mutes/unmutes, B bypasses/un-bypasses all nodes in the group. Implemented as a DOM overlay (positioned every frame from the canvas transform) so it stays on top of both the canvas and the DOM nodes of Nodes 2.0. Verified show/hide + both toggles on Nodes 2.0 and legacy LiteGraph.

#### M3 design notes
- Progress bar event shapes (confirmed live): `executing` → raw node-id string or null; `progress` → `{prompt_id, value, max}`; `status` → `detail.exec_info.queue_remaining`; `execution_error` → `{exception_type, exception_message, node_id, node_type, ...}`.
- Auto-nest and group toggles both hook `LiteGraph.ContextMenu` / `canvas.onDrawForeground` (the official foreground callback, called in both renderers). Setup runs in the extension `init()` because `app.canvas` is not available at module-load time.
- Group toggle buttons are `position: fixed` DOM elements, one pair per active group, removed when the group is deleted.

## Known upstream issues being addressed
- rgthree/rgthree-comfy#632 — Nodes 2.0: properties won't open, fields stack (Power Lora Loader, Fast Groups Bypasser)
- rgthree/rgthree-comfy#797 — muted/bypassed rgthree server nodes saved with mode 0, come back enabled after reload
- rgthree/rgthree-comfy#714 — Power Lora Loader promoted lora widgets not visible in subgraphs
- rgthree/rgthree-comfy#745 — setGroups crash in LGraph.ts (Node Library panel empty)

## Test matrix (per milestone)
| Check | Legacy LiteGraph | Nodes 2.0 (Vue) |
|---|---|---|
| Widgets render | ✅ | ✅ |
| Widget interactions (click/drag/value) | ✅ | ✅ |
| Context menus (row + node + submenu) | ✅ | ✅ |
| Save/load round-trip | ✅ | ✅ |
| Tab switch survives | ✅ | ✅ |
| Subgraph nav survives | ✅ | ✅ |
| Live updates during execution | n/a (M1 has none) | n/a (M1 has none) |
