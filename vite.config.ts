import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
  preview: {
    port: 3000,
  },
  server: {
          host: true,
          port : 3000,
          proxy: {
              '/api': {
                  target: 'http://localhost:5000',
                  changeOrigin: true
              }
          }

      },
})
