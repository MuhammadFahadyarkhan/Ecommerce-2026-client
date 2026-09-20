import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    minify: false, // Disables minification so LightningCSS never parses your CSS
  },
  preview: {
    allowedHosts: ["ecommerce-2026-client-production.up.railway.app"],
  },
  server: {
    allowedHosts: ["ecommerce-2026-client-production.up.railway.app"],
  },
});