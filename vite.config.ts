import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // If you deploy under a subpath (e.g. /ticketing/), set VITE_APP_BASE=/ticketing/
  const base = env.VITE_APP_BASE || "/";

  return {
    base,
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts: ["28f380311e31.ngrok-free.app", "localhost", "127.0.0.1"],
    },
  };
});
