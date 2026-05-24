import { resolve } from "node:path";
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Optio",
      formats: ["iife"],
      fileName: () => "optio.js",
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
