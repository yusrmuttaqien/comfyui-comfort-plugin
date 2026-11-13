import { app } from "/scripts/app.js";
import {
  NODE_NAME,
  isComfortLoraNode,
  setupPowerLoraLoader,
  getLoraNodeState,
  renderLoraNode,
} from "./power-lora-loader.js";
import { registerComfortNodes, isComfortMuter, isComfortGroupsNode } from "./register.js";
import { installAutoNest } from "./auto-nest.js";
import { setupGroupToggles } from "./group-toggles.js";
import { setupNInferFocusButton } from "./ninfer-gate.js";
import {
  ANY_ROUTER,
  isComfortAnyRouter,
  setupAnyRouterNode,
  augmentAnyRouterClass,
} from "./any-router.js";
import {
  IMAGE_COMPARER,
  isComfortImageComparer,
  setupImageComparerNode,
  augmentImageComparerClass,
} from "./image-comparer.js";
import styles from "./styles.css?inline";

// The Nodes 2.0 frontend no longer auto-loads extension .css files; inject
// ours from the bundle so it works in both renderers.
const styleEl = document.createElement("style");
styleEl.setAttribute("data-comfort-plugin", "true");
styleEl.textContent = styles;
document.head.appendChild(styleEl);

registerComfortNodes();
installAutoNest();

app.registerExtension({
  name: "comfort.PowerLoraLoader",

  // Canvas-dependent setup (group header toggles). Done in init() so
  // app.canvas exists — ComfyUI's own selectionBorder extension does the same.
  async init() {
    setupGroupToggles();
    setupNInferFocusButton();
  },

  // ComfyUI auto-creates a class for every server-backed node def. For the Any
  // Router we replace its behavior in place (it has no fixed connection inputs
  // in the def; we add the dynamic `any_*` inputs and manage them).
  beforeRegisterNodeDef(nodeType: any, nodeData: any) {
    if (nodeData && nodeData.name === ANY_ROUTER) {
      augmentAnyRouterClass(nodeType);
    }
    if (nodeData && nodeData.name === IMAGE_COMPARER) {
      augmentImageComparerClass(nodeType);
    }
  },

  nodeCreated(node: any) {
    if (isComfortLoraNode(node)) {
      setupPowerLoraLoader(node);
      return;
    }
    if (isComfortAnyRouter(node)) {
      setupAnyRouterNode(node);
      return;
    }
    if (isComfortImageComparer(node)) {
      setupImageComparerNode(node);
    }
  },

  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(node: any) {
    if (isComfortLoraNode(node)) {
      const state = getLoraNodeState(node);
      if (state) {
        const setMode = (showSeparate: boolean) => {
          state.showSeparate = showSeparate;
          renderLoraNode(node);
        };
        return [
          null,
          {
            content: "Show Strengths",
            has_submenu: true,
            submenu: {
              options: [
                {
                  content: "Single Strength",
                  checked: () => !state.showSeparate,
                  callback: () => setMode(false),
                },
                {
                  content: "Separate Model & Clip",
                  checked: () => state.showSeparate,
                  callback: () => setMode(true),
                },
              ],
            },
          },
        ];
      }
    }

    // Fast Muter / Fast Bypasser: bulk actions.
    if (isComfortMuter(node)) {
      const setAll = (on: boolean | null) =>
        (node as any).setAllRows?.(on);
      return [
        null,
        { content: "Enable all", callback: () => setAll(true) },
        { content: "Disable all", callback: () => setAll(false) },
        { content: "Toggle all", callback: () => setAll(null) },
      ];
    }

    // Fast Groups Muter / Bypasser: bulk actions over all listed groups.
    if (isComfortGroupsNode(node)) {
      const setAll = (on: boolean | null) =>
        (node as any).setAllGroups?.(on);
      return [
        null,
        { content: "Enable all", callback: () => setAll(true) },
        { content: "Disable all", callback: () => setAll(false) },
        { content: "Toggle all", callback: () => setAll(null) },
      ];
    }

    return [];
  },
});

export { NODE_NAME };
