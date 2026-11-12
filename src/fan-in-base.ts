// Shared base for fan-in nodes: a pool of `*` inputs that grows/shrinks as nodes
// connect, with each connected input renamed to the node's title. Follows through
// passthrough nodes (Reroute / Collector / Combiner) so the "connected node" is
// the real node, not an intermediate.
//
// Subclasses decide what to do with the resolved node list:
//   - ComfortAnyInputNode (Muter/Bypasser) renders a toggle row per node
//   - ComfortCollectorNode just exposes them through a single output
//   - ComfortModeRepeater propagates its mode to them
//
// Re-worked from rgthree-comfy's BaseAnyInputConnectedNode (MIT).

import { ComfortVirtualNode } from "./virtual-node.js";
import { getConnectedInputNodes } from "./mode-utils.js";

export abstract class ComfortFanInNode extends ComfortVirtualNode {
  constructor(title?: string) {
    super(title);
    this.addInput("", "*");
  }

  /**
   * The real nodes (passthroughs resolved) connected to this node's inputs.
   * Called on every connection change and after load.
   */
  protected abstract onConnectedNodesChanged(nodes: any[]): void;

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

  /** Keep a trailing free `*` input; rename connected inputs to node titles. */
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
