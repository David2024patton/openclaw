import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));

function normalizeBase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "/";
  }
  if (trimmed === "./") {
    return "./";
  }
  if (trimmed.endsWith("/")) {
    return trimmed;
  }
  return `${trimmed}/`;
}

export default defineConfig(() => {
  const envBase = process.env.OPENCLAW_CONTROL_UI_BASE_PATH?.trim();
  const base = envBase ? normalizeBase(envBase) : "./";

  const buildInfo = {
    builtAt: new Date().toISOString(),
    version: process.env.npm_package_version ?? "dev",
  };

  return {
    base,
    define: {
      __BUILD_INFO__: JSON.stringify(buildInfo),
    },
    publicDir: path.resolve(here, "public"),
    optimizeDeps: {
      include: ["lit/directives/repeat.js"],
    },
    build: {
      outDir: path.resolve(here, "../dist/control-ui"),
      emptyOutDir: true,
      sourcemap: true,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      proxy: {
        "/api": {
          target: "http://openclaw-gateway:18789",
          changeOrigin: true,
        },
        "/clob": {
          target: "http://openclaw-gateway:18789",
          changeOrigin: true,
        },
        // WebSocket proxy for gateway connection - specific path to avoid HMR conflict
        "^/(?!(node_modules|@vite|src|@fs|@id))": {
          target: "ws://openclaw-gateway:18789",
          ws: true,
          changeOrigin: true,
        },
      },
      // Configure HMR WebSocket explicitly
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 5173,
      },
    },
  };
});
