import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base: "/ticketing",
  plugins: [react(),tailwindcss(),],
  server: {
    allowedHosts: [
      '28f380311e31.ngrok-free.app',
      'localhost',
      '127.0.0.1'
    ]
  }
})
