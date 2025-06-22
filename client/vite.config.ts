import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";

// Vite doesn't allow top-level await in config, so this must be handled as a function export
export default defineConfig(async () => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
  ];

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

// ✅ Add the PWA plugin
plugins.push(
  VitePWA({
    registerType: "autoUpdate",
    includeAssets: [
      "favicon.ico",
      "robots.txt",
      "logo.png",
      "icon-144x144.png",
      "icon-512x512.png"
    ],
    manifest: {
      name: "MedScript",
      short_name: "MedScript",
      description: "Offline prescription generator app",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        }
      ],
    },
  })
);


  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
