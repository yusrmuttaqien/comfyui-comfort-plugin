// Mode + connection helpers for the mute/bypass family. Re-worked from rgthree-comfy (MIT).

export const MODE_ALWAYS = 0;
export const MODE_NEVER = 2; // mute
export const MODE_BYPASS = 4;

export type Mode = number;


export function changeModeOfNodes(nodeOrNodes: any, mode: Mode): void {
  if (Array.isArray(nodeOrNodes)) {
    for (const node of nodeOrNodes) changeModeOfNodes(node, mode);
    return;
  }
  if (!nodeOrNodes) return;
  try {
    nodeOrNodes.mode = mode;
  } catch {
    /* ignore */
  }
  // Subgraph proxy nodes carry their children in `subgraph.nodes`.
  const children = nodeOrNodes.subgraph?.nodes;
  if (Array.isArray(children)) {
    for (const child of children) changeModeOfNodes(child, mode);
  }
}


export function shouldPassThrough(node: any): boolean {
  const type: string = node?.type || node?.constructor?.type || "";
  return type.includes("Reroute") || type.includes("Node Collector") || type.includes("Node Combiner");
}


export function getConnectedNodes(
  startNode: any,
  dir: "INPUT" | "OUTPUT",
  slot?: number,
): any[] {
  const graph = startNode.graph;
  if (!graph) return [];

  const result: any[] = [];
  const seen = new Set<any>();

  const visit = (node: any) => {
    if (!node || seen.has(node)) return;
    seen.add(node);

    let linkIds: (number | null | undefined)[];
    if (dir === "OUTPUT") {
      linkIds = (node.outputs || []).flatMap((o: any) => o.links || []);
    } else {
      linkIds = (node.inputs || []).map((i: any) => i.link);
    }

    for (const linkId of linkIds) {
      if (linkId == null) continue;
      const link = graph.links[linkId];
      if (!link) continue;
      const connectedId = dir === "OUTPUT" ? link.target_id : link.origin_id;
      const connectedNode = graph.getNodeById(connectedId);
      if (!connectedNode || seen.has(connectedNode)) continue;
      if (shouldPassThrough(connectedNode)) {
        // Follow through the passthrough node to its other side.
        visit(connectedNode);
      } else {
        result.push(connectedNode);
      }
    }
  };

  if (slot != null) {
    // Seed from a specific slot only (used to rename a single input).
    const ids = dir === "OUTPUT" ? (startNode.outputs?.[slot]?.links || []) : [startNode.inputs?.[slot]?.link];
    for (const id of ids) {
      if (id == null) continue;
      const link = graph.links[id];
      if (!link) continue;
      const connectedId = dir === "OUTPUT" ? link.target_id : link.origin_id;
      const connectedNode = graph.getNodeById(connectedId);
      if (!connectedNode || seen.has(connectedNode)) continue;
      if (shouldPassThrough(connectedNode)) visit(connectedNode);
      else result.push(connectedNode);
    }
  } else {
    visit(startNode);
  }
  return result;
}

export function getConnectedInputNodes(node: any, slot?: number): any[] {
  return getConnectedNodes(node, "INPUT", slot);
}
export function getConnectedOutputNodes(node: any, slot?: number): any[] {
  return getConnectedNodes(node, "OUTPUT", slot);
}


export function getGroupNodes(group: any): any[] {
  // `_children` is derived spatially and is NOT populated on workflow load --
  // it's only filled when `recomputeInsideNodes` runs (selection, group ops,
  // node drags). Right after a reload it's empty, so a toggle would act on
  // nothing. Recompute so we always see the nodes actually inside the group.
  // The call is idempotent (it clears and rebuilds `_children`).
  if (group?.graph && typeof group.recomputeInsideNodes === "function") {
    try {
      group.recomputeInsideNodes();
    } catch {
      /* fall through to whatever `_children` currently holds */
    }
  }
  const children = group?._children;
  if (!children) return [];
  return Array.from(children).filter((c: any) => c && (c.isLGraphNode || c.constructor?.type));
}


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
