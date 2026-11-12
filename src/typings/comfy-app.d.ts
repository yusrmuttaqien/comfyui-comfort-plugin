// Types for the ComfyUI runtime shim at /scripts/app.js (served by the
// server; the same singleton as window.app in both renderers).
export const app: {
  api: {
    getList(kind: string): Promise<Record<string, string[]>>;
  };
  canvas: any;
  graph: any;
  registerExtension(ext: any): void;
  extensionManager?: any;
};
