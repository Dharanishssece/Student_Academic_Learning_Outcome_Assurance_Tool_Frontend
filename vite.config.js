import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:5000';
const port = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
