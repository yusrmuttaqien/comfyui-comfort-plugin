// Fast Muter / Fast Bypasser: connect nodes to them and toggle each one
// mute/bypass on and off with a single click.
//
// Re-worked from rgthree-comfy (MIT). Virtual nodes (no backend).

import { ComfortAnyInputNode } from "./any-input-node.js";
import { MODE_ALWAYS, MODE_NEVER, MODE_BYPASS } from "./mode-utils.js";

export const FAST_MUTER = "Fast Muter (comfort)";
export const FAST_BYPASSER = "Fast Bypasser (comfort)";

class FastMuterNode extends ComfortAnyInputNode {
  protected override readonly modeOn = MODE_ALWAYS;
  protected override readonly modeOff = MODE_NEVER;

  constructor() {
    super(FAST_MUTER);
  }

  getHelp(): string {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to mute or unmute that node without leaving the canvas.</p>`;
  }
}

class FastBypasserNode extends ComfortAnyInputNode {
  protected override readonly modeOn = MODE_ALWAYS;
  protected override readonly modeOff = MODE_BYPASS;

  constructor() {
    super(FAST_BYPASSER);
  }

  getHelp(): string {
    return `<p>Connect any nodes to this node. Each connected node gets a row;
toggle it to bypass or un-bypass that node without leaving the canvas.</p>`;
  }
}

export const FastMuter = FastMuterNode;
export const FastBypasser = FastBypasserNode;
