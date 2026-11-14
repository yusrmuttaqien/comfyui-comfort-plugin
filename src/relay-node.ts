// Mode Relay: watches input node modes and drives a connected Repeater.
// Re-worked from rgthree-comfy (MIT). Virtual node.

import { ComfortFanInNode } from "./fan-in-base.js";
import {
  MODE_ALWAYS,
  MODE_NEVER,
  MODE_BYPASS,
  changeModeOfNodes,
  getConnectedInputNodes,
  getConnectedOutputNodes,
} from "./mode-utils.js";
import { isComfortRepeater } from "./mode-repeater.js";
import { scheduler } from "./scheduler.js";

export const MODE_RELAY = "Mode Relay (comfort)";

const OPTION_TO_MODE: Record<string, number> = {
  ACTIVE: MODE_ALWAYS,
  MUTE: MODE_NEVER,
  BYPASS: MODE_BYPASS,
  NOTHING: -99,
};
const MODE_TO_PROPERTY: Record<number, string> = {
  [MODE_NEVER]: "on_muted_inputs",
  [MODE_BYPASS]: "on_bypassed_inputs",
  [MODE_ALWAYS]: "on_any_active_inputs",
};

class ModeRelayNode extends ComfortFanInNode {
  constructor() {
    super(MODE_RELAY);
    this.properties["on_muted_inputs"] = "MUTE";
    this.properties["on_bypassed_inputs"] = "BYPASS";
    this.properties["on_any_active_inputs"] = "ACTIVE";
    this.addOutput("REPEATER", "_NODE_REPEATER_", {
      color_on: "#Fc0",
      color_off: "#a80",
      shape: 5,
    });
    RelayRegistry.register(this);
  }

  protected onConnectedNodesChanged(_nodes: any[]): void {
    this.evaluate();
  }


  override onModeChange(_from: number | undefined, to: number): void {
    super.onModeChange(_from, to);
    if (this.configuring) return;
    const inputs = getConnectedInputNodes(this);
    if (inputs.length) return;
    const repeaters = getConnectedOutputNodes(this).filter(isComfortRepeater);
    for (const rep of repeaters) {
      if (rep.mode !== to) changeModeOfNodes(rep, to);
    }
  }


  onConnectOutput(
    _slot: number,
    _type: string | number,
    _inputSlot: any,
    inputNode: any,
    _inputIndex: number,
  ): boolean {
    return inputNode ? isComfortRepeater(inputNode) : true;
  }


  private evaluate(): void {
    if (this.configuring) return;
    const inputs = getConnectedInputNodes(this);
    let mode: number | undefined;
    for (const node of inputs) {
      const m = node.mode;
      if (mode === undefined) mode = m;
      else if (mode === m && (m === MODE_NEVER || m === MODE_BYPASS)) continue;
      else if (m === MODE_ALWAYS || mode === MODE_ALWAYS) mode = MODE_ALWAYS;
      else mode = undefined;
    }

    if (mode === undefined) return;


    const propKey = MODE_TO_PROPERTY[mode];
    const mapped = propKey ? OPTION_TO_MODE[String(this.properties?.[propKey])] : mode;
    const finalMode = mapped !== undefined ? mapped : mode;
    if (finalMode === -99) return; // NOTHING

    const repeaters = getConnectedOutputNodes(this).filter(isComfortRepeater);
    for (const rep of repeaters) {
      if (rep.mode !== finalMode) changeModeOfNodes(rep, finalMode);
    }
  }

  getHelp(): string {
    return `<p>Watches the mode of the nodes connected to its inputs and drives
a connected <b>Repeater</b> with the result: all inputs muted → MUTE, all
bypassed → BYPASS, any active → ACTIVE. Set the <code>on_muted_inputs</code>,
<code>on_bypassed_inputs</code> and <code>on_any_active_inputs</code>
properties to remap or suppress (NOTHING) each signal.</p>`;
  }

  onRemoved(): void {
    RelayRegistry.unregister(this);
    super.onRemoved?.();
  }
}


const registry = new Set<any>();
const relayJob = () => {
  for (const n of registry) {
    try {
      n.evaluate();
    } catch {
      /* ignore */
    }
  }
};
const RelayRegistry = {
  register(node: any) {
    registry.add(node);
    scheduler.schedule(relayJob, 1); // every tick (500ms)
  },
  unregister(node: any) {
    registry.delete(node);
    if (!registry.size) scheduler.unschedule(relayJob);
  },
};

export const ModeRelay = ModeRelayNode;
