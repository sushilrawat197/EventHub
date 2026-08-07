import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Normalize so `/mytag`, `mytag`, `/mytag/` all become `/mytag/`; empty → `/`. */
function normalizeBasePath(raw?: string): string {
  const value = (raw ?? "").trim();
  if (!value || value === "/") return "/";
  const withLeading = value.startsWith("/") ? value : `/${value}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Serve under a subpath when set (e.g. VITE_APP_BASE=/mytag). Omit or leave empty for `/`.
  const base = normalizeBasePath(env.VITE_APP_BASE || env.VITE_BASE_PATH);

  return {
    base,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts: ["28f380311e31.ngrok-free.app", "localhost", "127.0.0.1"],
    },
  };
});
