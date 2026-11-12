// Register all comfort virtual node types with LiteGraph. This is the official
// custom-node registration API and works in both renderers.
import { ComfortAnyInputNode } from "./any-input-node.js";
import { FastMuter, FastBypasser, FAST_MUTER, FAST_BYPASSER } from "./fast-muter.js";

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
}

export function isComfortMuter(node: any): boolean {
  return node?.type === FAST_MUTER || node?.type === FAST_BYPASSER;
}
