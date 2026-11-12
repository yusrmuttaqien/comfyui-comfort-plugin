// Minimal ambient types for the ComfyUI runtime environment.
// ComfyUI serves `scripts/app.js` via an import map; we keep it external.

declare module "scripts/app.js" {
  // Deliberately loose: we only use a small, stable surface.
  export const app: {
    api: {
      getList(kind: string): Promise<Record<string, string[]>>;
    };
    canvas: any;
    graph: any;
    registerExtension(ext: any): void;
    extensionManager?: any;
  };
}

// LiteGraph globals, present in both the legacy renderer and Nodes 2.0.
declare const LiteGraph: any;
declare const LGraphNode: any;
declare const LGraphCanvas: any;
