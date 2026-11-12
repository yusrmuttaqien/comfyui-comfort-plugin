import { app } from "scripts/app.js";
import {
  NODE_NAME,
  isComfortLoraNode,
  setupPowerLoraLoader,
  getLoraNodeState,
  renderLoraNode,
  type LoraNodeState,
} from "./power-lora-loader.js";
import "./styles.css";

app.registerExtension({
  name: "comfort.PowerLoraLoader",

  nodeCreated(node: any) {
    if (!isComfortLoraNode(node)) return;
    setupPowerLoraLoader(node);
  },

  // Node right-click menu: Show Strengths mode.
  getNodeMenuItems(node: any) {
    if (!isComfortLoraNode(node)) return [];
    const state = getLoraNodeState(node);
    if (!state) return [];
    const setMode = (showSeparate: boolean) => {
      state.showSeparate = showSeparate;
      renderLoraNode(node);
    };
    return [
      null,
      {
        content: "Show Strengths",
        submenu: [
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
    ];
  },
});

export { NODE_NAME };
