import { defineConfig } from "vite";

// ComfyUI loads web/comfort.js as an ES module (dynamic import, no import
// map). Absolute /scripts/*.js imports resolve against the server root in
// both the legacy and Nodes 2.0 frontends.
export default defineConfig({
  build: {
    outDir: "web",
    emptyOutDir: false,
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "comfort.js",
    },
    rollupOptions: {
      external: (id) => id.startsWith("/scripts/"),
    },
  },
});
