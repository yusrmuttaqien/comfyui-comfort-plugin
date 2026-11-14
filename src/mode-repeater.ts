// Mute / Bypass Repeater: a fan-in "master switch". When this node mode
// (Always / Mute / Bypass) changes, it repeats that mode to every node
// connected to its inputs. If nothing is connected but the node sits inside a
// group, it applies to the whole group. Its optional output can feed a Fast
// Muter / Bypasser for a single toggle over all of them.
//
// Re-worked from rgthree-comfy's NodeModeRepeater (MIT). Virtual node.

import { ComfortFanInNode } from "./fan-in-base.js";
import {
  changeModeOfNodes,
  findGroupForNode,
  getConnectedInputNodes,
  getGroupNodes,
} from "./mode-utils.js";

export const MODE_REPEATER = "Mute / Bypass Repeater (comfort)";

class ModeRepeaterNode extends ComfortFanInNode {
  constructor() {
    super(MODE_REPEATER);
    this.addOutput("OPT", "*", { color_on: "#Fc0", color_off: "#a80" });
  }

  protected onConnectedNodesChanged(_nodes: any[]): void {
    // When a new node connects (and we're not loading), bring it in line with
    // our current mode, matching rgthree behaviour.
    if (this.configuring) return;
    const nodes = _nodes;
    for (const node of nodes) {
      if (node.mode !== this.mode) changeModeOfNodes(node, this.mode);
    }
  }

  /** Propagate our mode to every connected input node (or our group). */
  override onModeChange(_from: number | undefined, to: number): void {
    if (this.configuring) return;
    const nodes = getConnectedInputNodes(this);
    if (nodes.length) {
      for (const node of nodes) changeModeOfNodes(node, to);
      return;
    }
    // No direct connections: fall back to the enclosing group.
    const group = findGroupForNode(this);
    if (group) {
      for (const node of getGroupNodes(group)) {
        if (node !== this) changeModeOfNodes(node, to);
      }
    }
  }

  getHelp(): string {
    return `<p>When this node's mode (Always / Mute / Bypass) changes, it
repeats that mode to every node connected to its inputs. If nothing is
connected but it is inside a group, it applies to the whole group. Connect its
output to a Fast Muter for a single toggle over all of them.</p>`;
  }
}

export const ModeRepeater = ModeRepeaterNode;

/** True if the node is a comfort Repeater (the Relay's output target). */
export function isComfortRepeater(node: any): boolean {
  return node?.type === MODE_REPEATER;
}
