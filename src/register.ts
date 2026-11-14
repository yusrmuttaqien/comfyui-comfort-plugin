// Register all comfort virtual node types with LiteGraph. This is the official
// custom-node registration API and works in both renderers.
import { ComfortAnyInputNode } from "./any-input-node.js";
import { FastMuter, FastBypasser, FAST_MUTER, FAST_BYPASSER } from "./fast-muter.js";
import { NodeCollector, NODE_COLLECTOR } from "./collector-node.js";
import { ModeRepeater, MODE_REPEATER } from "./mode-repeater.js";
import { ModeRelay, MODE_RELAY } from "./relay-node.js";
import { RandomUnmuter, RANDOM_UNMUTER } from "./random-unmuter.js";
import {
  FastGroupsMuterClass,
  FastGroupsBypasserClass,
  FAST_GROUPS_MUTER,
  FAST_GROUPS_BYPASSER,
} from "./fast-groups.js";

const registered = new Set<string>();

function registerType(type: string, cls: any): void {
  if (registered.has(type)) return;
  registered.add(type);
  // `category` controls where it appears in the Node Library.
  cls.category = "comfort";
  LiteGraph.registerNodeType(type, cls);
}

export function registerComfortNodes(): void {
  registerType(FAST_MUTER, FastMuter);
  registerType(FAST_BYPASSER, FastBypasser);
  registerType(NODE_COLLECTOR, NodeCollector);
  registerType(MODE_REPEATER, ModeRepeater);
  registerType(MODE_RELAY, ModeRelay);
  registerType(RANDOM_UNMUTER, RandomUnmuter);
  registerType(FAST_GROUPS_MUTER, FastGroupsMuterClass);
  registerType(FAST_GROUPS_BYPASSER, FastGroupsBypasserClass);
}

export function isComfortMuter(node: any): boolean {
  return node?.type === FAST_MUTER || node?.type === FAST_BYPASSER;
}

export function isComfortGroupsNode(node: any): boolean {
  return node?.type === FAST_GROUPS_MUTER || node?.type === FAST_GROUPS_BYPASSER;
}
