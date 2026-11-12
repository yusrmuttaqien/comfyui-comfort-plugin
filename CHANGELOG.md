# Changelog

Dual-renderer rework of select rgthree-comfy features for ComfyUI Nodes 2.0 (Vue renderer) with legacy LiteGraph support.
All dates UTC. Status: 🚧 in progress / ✅ done / ⏸️ blocked.

## Unreleased

### M1 — Power Lora Loader (🚧)
- [ ] Repo scaffold: Vite+TS build, pyproject.toml, `__init__.py`, README
- [ ] Python backend (`py/power_lora_loader.py`) adapted from rgthree-comfy (MIT, credited)
- [ ] Frontend: lora rows as DOM widgets (dual renderer; no canvas-drawn widgets)
- [ ] Right-click row menu: move up/down, toggle, delete
- [ ] "Add Lora" button + header, strengths (combined / model+clip)
- [ ] Fix muted/bypassed node mode serialization (rgthree #797)
- [ ] Fix promoted-widget visibility in subgraphs (rgthree #714)
- [ ] Build to `web/`, commit built output
- [ ] Deploy to test box, browser-verify both renderers (widgets, save/load, tab switch, subgraph nav)

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
| Widgets render | ☐ | ☐ |
| Widget interactions (click/drag/value) | ☐ | ☐ |
| Context menus | ☐ | ☐ |
| Save/load round-trip | ☐ | ☐ |
| Tab switch survives | ☐ | ☐ |
| Subgraph nav survives | ☐ | ☐ |
| Live updates during execution | ☐ | ☐ |
