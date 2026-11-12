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

### M2 — Mute/Bypass family (⏸️)
- [ ] Fast Muter / Fast Bypasser — DOM widget buttons
- [ ] Fast Groups Muter / Fast Groups Bypasser — group scan + DOM list, filters/sort/restrictions
- [ ] Mute/Bypass Repeater & Relay — mode propagation + serialization fix
- [ ] Random Unmuter — queue-time random unmute
- [ ] Node Collector — passthrough/cleanup node

### M3 — Features (⏸️)
- [ ] Progress bar (queue size, execution + multi-step progress) with live updates in Vue mode
- [ ] Auto-nest subdirectories in long combo menus (official menu hook)
- [ ] Quick mute/bypass toggles in group headers (DOM overlay, re-inject on subgraph nav)

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
