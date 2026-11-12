// Minimal ambient types for the ComfyUI runtime environment.

// LiteGraph globals, present in both the legacy renderer and Nodes 2.0.
declare const LiteGraph: any;
declare const LGraphNode: any;
declare const LGraphCanvas: any;

// Vite CSS-as-string imports.
declare module "*.css?inline" {
  const css: string;
  export default css;
}
