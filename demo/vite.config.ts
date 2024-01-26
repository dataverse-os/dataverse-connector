import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      // buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6", // add buffer
    }
  },
  build: {
    target: "es2020",
    sourcemap: true
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    fs: {
      strict: false
    }
  },
  define: {
    process: {
      env: {}
    }
  }
});
