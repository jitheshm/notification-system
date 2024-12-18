import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Bind Vite to all network interfaces
    port: 5173,        // Port for the Vite dev server
    strictPort: true,  // Ensure Vite uses the specified port
  },
})
