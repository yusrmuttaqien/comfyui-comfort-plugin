import { defineConfig } from "vite";

// ComfyUI loads every .js/.css file in web/ — .js as ES modules, .css as
// stylesheets. We build one ES module bundle + one stylesheet.
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
      // Provided by ComfyUI at runtime via its import map.
      external: ["scripts/app.js"],
    },
  },
});
