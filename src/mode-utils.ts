// Mode + connection helpers for the mute/bypass family.
//
// Re-worked from rgthree-comfy (MIT). Kept deliberately small: we only need
// "which nodes are connected to this node's inputs/outputs" and "set a node's
// mode", plus group node enumeration. No prototype patching.

export const MODE_ALWAYS = 0;
export const MODE_NEVER = 2; // mute
export const MODE_BYPASS = 4;

export type Mode = number;

/**
 * Set `mode` on a node (and, if it's a subgraph proxy, its children).
 * Setting `.mode` fires the node's own `onModeChange` if it has one, which is
 * how repeaters/relays propagate.
 */
export function changeModeOfNodes(node: any, mode: Mode): void {
  if (!node) return;
  try {
    node.mode = mode;
  } catch {
    /* ignore */
  }
  // Subgraph proxy nodes carry their children in `subgraph.nodes`.
  const children = node.subgraph?.nodes;
  if (Array.isArray(children)) {
    for (const child of children) changeModeOfNodes(child, mode);
  }
}

/** True for passthrough-style nodes we should follow when resolving a connection. */
export function shouldPassThrough(node: any): boolean {
  const type: string = node?.type || node?.constructor?.type || "";
  return type.includes("Reroute") || type.includes("Node Collector") || type.includes("Node Combiner");
}

/**
 * Resolve the nodes connected to `startNode`'s inputs (dir=INPUT) or outputs
 * (dir=OUTPUT), following passthrough nodes (reroutes / collectors). Returns
 * the resolved nodes (passthroughs themselves excluded from the result).
 */
export function getConnectedNodes(
  startNode: any,
  dir: "INPUT" | "OUTPUT",
  slot?: number,
): any[] {
  const graph = startNode.graph;
  if (!graph) return [];

  const result: any[] = [];
  const seen = new Set<any>();

  const visit = (node: any, fromSlot?: number) => {
    if (!node || seen.has(node)) return;
    seen.add(node);

    let linkIds: (number | null | undefined)[];
    if (dir === "OUTPUT") {
      // outputs[i].links is an array of link ids
      linkIds =
        fromSlot != null
          ? node.outputs?.[fromSlot]?.links || []
          : (node.outputs || []).flatMap((o: any) => o.links || []);
    } else {
      if (fromSlot != null) linkIds = [node.inputs?.[fromSlot]?.link];
      else linkIds = (node.inputs || []).map((i: any) => i.link);
    }

    for (const linkId of linkIds) {
      if (linkId == null) continue;
      const link = graph.links[linkId];
      if (!link) continue;
      const connectedId = dir === "OUTPUT" ? link.target_id : link.origin_id;
      const connectedNode = graph.getNodeById(connectedId);
      if (!connectedNode || seen.has(connectedNode)) continue;
      result.push(connectedNode);
      if (shouldPassThrough(connectedNode)) {
        // Follow through the passthrough node's other side.
        visit(connectedNode, dir === "OUTPUT" ? link.target_slot : link.origin_slot);
      }
    }
  };

  visit(startNode, slot);
  return result;
}

export function getConnectedInputNodes(node: any, slot?: number): any[] {
  return getConnectedNodes(node, "INPUT", slot);
}
export function getConnectedOutputNodes(node: any, slot?: number): any[] {
  return getConnectedNodes(node, "OUTPUT", slot);
}

/** The nodes inside a group (LiteGraph groups keep children in `_children`). */
export function getGroupNodes(group: any): any[] {
  const children = group?._children;
  if (!children) return [];
  return Array.from(children).filter((c: any) => c && (c.isLGraphNode || c.constructor?.type));
}

/** Find the group that contains `node` (overlapping, like LiteGraph does). */
export function findGroupForNode(node: any): any | null {
  const graph = node.graph;
  if (!graph) return null;
  const groups = graph._groups || graph.groups || [];
  const x = node.pos?.[0] ?? 0;
  const y = node.pos?.[1] ?? 0;
  const w = node.size?.[0] ?? 0;
  const h = node.size?.[1] ?? 0;
  for (const group of groups) {
    const gx = group.pos?.[0] ?? 0;
    const gy = group.pos?.[1] ?? 0;
    const gw = group.size?.[0] ?? 0;
    const gh = group.size?.[1] ?? 0;
    if (x >= gx && y >= gy && x + w <= gx + gw && y + h <= gy + gh) {
      return group;
    }
  }
  return null;
}
