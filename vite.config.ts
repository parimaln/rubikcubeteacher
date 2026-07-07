import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative base so the static build works from any path (e.g. GitHub Pages
  // serves this app at /rubikcubeteacher/). Routing is hash-based, so no
  // server rewrites are needed.
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
