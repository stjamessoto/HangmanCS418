import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 5173,
    watch: {
       usePolling: true, 
    },
    // NEW: Proxy settings to talk to the Node.js backend
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // This removes the '/api' prefix before sending it to the backend
        // So fetch('/api/player/Santiago') becomes GET http://localhost:3000/player/Santiago
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})