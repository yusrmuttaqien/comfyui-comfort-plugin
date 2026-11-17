// Shared base for fan-in nodes: a pool of `*` inputs that grows/shrinks as nodes
// connect, with each connected input renamed to the node's title.
// Re-worked from rgthree-comfy's BaseAnyInputConnectedNode (MIT).

import { ComfortVirtualNode } from "./virtual-node.js";
import { getConnectedInputNodes } from "./mode-utils.js";
import { trackDep, untrackDep, watchProp } from "./prop-watch.js";

export abstract class ComfortFanInNode extends ComfortVirtualNode {
  constructor(title?: string) {
    super(title);
    this.addInput("", "*");
    trackDep(this);
  }


  protected onConnectedNodesChanged(_nodes: any[]): void {
    /* override */
  }

  onConnectionsChange(
    type: number,
    index: number,
    connected: boolean,
    linkInfo: any,
    ioSlot: any,
  ): void {
    super.onConnectionsChange?.(type, index, connected, linkInfo, ioSlot);
    this.stabilizeFanIn();
    this.onConnectedNodesChanged(getConnectedInputNodes(this));
  }


  /**
   * Rename connected inputs to their source node's current title. Also the
   * prop-watch refresh hook: fires when a connected node is renamed or its
   * mode changes, without re-running connection logic (no mode re-application).
   */
  refreshTitleRows(): void {
    if (!this.inputs) return;
    let changed = false;
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.link == null) continue;
      const node = getConnectedInputNodes(this, i)[0];
      if (!node) continue;
      watchProp(node, "title");
      watchProp(node, "mode");
      const name = node.title || "";
      if (input.name !== name) {
        input.name = name;
        changed = true;
      }
    }
    if (changed && typeof this.setDirtyCanvas === "function") {
      this.setDirtyCanvas(true, false);
    }
  }


  private stabilizeFanIn(): void {
    if (!this.inputs) return;
    this.refreshTitleRows();
    const last = this.inputs[this.inputs.length - 1];
    if (!last || last.link != null) this.addInput("", "*");
  }

  override onRemoved(): void {
    untrackDep(this);
    super.onRemoved();
  }
}
