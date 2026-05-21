import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api/bcv': {
        target: 'https://api-bcv-pi.vercel.app/api/tasa/usd',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bcv/, '')
      }
    }
  }
})
