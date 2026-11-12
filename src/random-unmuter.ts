// Random Unmuter — a fan-in node that, each time a prompt is queued, temporarily
// unmutes one randomly-chosen connected node (that is currently muted) for the
// duration of the prompt build, then mutes it back. All connected nodes must be
// muted for it to act. Useful to randomly pick one of N muted branches per run.
//
// Re-worked from rgthree-comfy's RandomUnmuter (MIT). Virtual node.
//
// ComfyUI has no official queue/execute hook, so (as rgthree does) we wrap
// app.queuePrompt / app.graphToPrompt and dispatch to registered unmUTERS.

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

  /** No-op: this node only acts on queue, not on connection changes. */
  protected onConnectedNodesChanged(_nodes: any[]): void {
    /* no-op */
  }

  constructor() {
    super(RANDOM_UNMUTER);
    this.constructed();
    RandomUnmuterRegistry.register(this);
  }

  /**
   * Called when a prompt build begins (inside queuePrompt). If all connected
   * nodes are muted, pick one at random and unmute it for the build.
   */
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

  /** Called after the prompt build; mute the temporarily-enabled node back. */
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

// Registry of live Random Unmuter nodes.
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

/**
 * Wrap app.queuePrompt / app.graphToPrompt once. The queuePrompt wrapper sets a
 * flag; the graphToPrompt wrapper dispatches to each unmuter for the duration
 * of the prompt build (so each batch item can pick a different random node).
 */
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
