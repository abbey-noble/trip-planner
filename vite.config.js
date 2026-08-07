import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative paths so the built site works from any host or subpath.
  base: './',
  plugins: [react()],
  server: {
    host: true, // reachable from the phone on the same network
  },
})
