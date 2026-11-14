// Node Collector: a fan-in node. Connect any number of nodes to its inputs.
// they are bundled into a single output that feeds a Fast Muter / Bypasser /
// Repeater. The Muter follows *through* the Collector (PassThroughFollowing.ALL)
// and shows the real nodes, so one Muter row can control many bundled nodes.
//
// Re-worked from rgthree-comfy's CollectorNode (MIT). Virtual node.

import { ComfortFanInNode } from "./fan-in-base.js";

export const NODE_COLLECTOR = "Node Collector (comfort)";

class CollectorNode extends ComfortFanInNode {
  constructor() {
    super(NODE_COLLECTOR);
    this.addOutput("Output", "*");
  }


  getHelp(): string {
    return `<p>Bundle any number of nodes into a single output. Connect this
output to a Fast Muter or Fast Bypasser and it will list every node connected
to this Collector, so one toggle can mute/bypass all of them at once.</p>`;
  }
}

export const NodeCollector = CollectorNode;
