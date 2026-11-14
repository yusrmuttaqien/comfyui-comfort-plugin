// Shared base for fan-in nodes: a pool of `*` inputs that grows/shrinks as nodes
// connect, with each connected input renamed to the node's title.
// Re-worked from rgthree-comfy's BaseAnyInputConnectedNode (MIT).

import { ComfortVirtualNode } from "./virtual-node.js";
import { getConnectedInputNodes } from "./mode-utils.js";

export abstract class ComfortFanInNode extends ComfortVirtualNode {
  constructor(title?: string) {
    super(title);
    this.addInput("", "*");
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


  private stabilizeFanIn(): void {
    if (!this.inputs) return;
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.link != null) {
        const node = getConnectedInputNodes(this, i)[0];
        const name = node?.title || "";
        if (input.name !== name) input.name = name;
      }
    }
    const last = this.inputs[this.inputs.length - 1];
    if (!last || last.link != null) this.addInput("", "*");
  }
}
