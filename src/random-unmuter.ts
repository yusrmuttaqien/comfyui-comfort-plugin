// Random Unmuter: unmutes one random connected node per prompt build.
// Re-worked from rgthree-comfy (MIT). Virtual node.

import { ComfortFanInNode } from "./fan-in-base.js";
import {
  MODE_ALWAYS,
  MODE_NEVER,
  changeModeOfNodes,
  getConnectedInputNodes,
} from "./mode-utils.js";
import { app } from "/scripts/app.js";

export const RANDOM_UNMUTER = "Random Unmuter (comfort)";

class RandomUnmuterNode extends ComfortFanInNode {
  private tempEnabled: any = null;


  constructor() {
    super(RANDOM_UNMUTER);
    RandomUnmuterRegistry.register(this);
  }


  onPromptStart(): void {
    if (this.configuring) return;
    this.tempEnabled = null;
    const nodes = getConnectedInputNodes(this);
    if (!nodes.length) return;
    const allMuted = nodes.every((n) => n.mode === MODE_NEVER);
    if (!allMuted) return;
    const pick = nodes[Math.floor(Math.random() * nodes.length)];
    if (pick) {
      changeModeOfNodes(pick, MODE_ALWAYS);
      this.tempEnabled = pick;
    }
  }


  onPromptEnd(): void {
    if (this.tempEnabled) {
      changeModeOfNodes(this.tempEnabled, MODE_NEVER);
      this.tempEnabled = null;
    }
  }

  getHelp(): string {
    return `<p>Each time a prompt is queued, this node temporarily unmutes one
randomly-chosen connected node (which must be muted) for the duration of the
prompt, then mutes it back. All connected nodes must be muted for it to act.
Tip: connect a Repeater's output to this node's input to randomly unmute a whole
group.</p>`;
  }

  onRemoved(): void {
    RandomUnmuterRegistry.unregister(this);
    super.onRemoved?.();
  }
}


const registry = new Set<any>();
const RandomUnmuterRegistry = {
  register(node: any) {
    registry.add(node);
    installQueueHooks();
  },
  unregister(node: any) {
    registry.delete(node);
  },
};


let installed = false;
function installQueueHooks(): void {
  if (installed) return;
  installed = true;
  const appAny = app as any;

  const origQueuePrompt = appAny.queuePrompt;
  let queueing = false;
  appAny.queuePrompt = async function (...args: any[]) {
    queueing = true;
    try {
      return await origQueuePrompt.apply(appAny, args);
    } finally {
      queueing = false;
    }
  };

  const origGraphToPrompt = appAny.graphToPrompt;
  appAny.graphToPrompt = function (...args: any[]) {
    if (queueing) {
      for (const u of registry) {
        try {
          u.onPromptStart();
        } catch {
          /* ignore */
        }
      }
    }
    const result = origGraphToPrompt.apply(appAny, args);
    const cleanup = () => {
      for (const u of registry) {
        try {
          u.onPromptEnd();
        } catch {
          /* ignore */
        }
      }
    };
    if (result && typeof result.then === "function") {
      return result.then((v: any) => {
        cleanup();
        return v;
      }, (e: any) => {
        cleanup();
        throw e;
      });
    }
    cleanup();
    return result;
  };
}

export const RandomUnmuter = RandomUnmuterNode;
