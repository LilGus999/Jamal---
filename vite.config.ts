
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optional: Configure server proxy if needed during development
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5000', // Your backend server URL
  //       changeOrigin: true,
  //       // rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix if backend doesn't expect it
  //     }
  //   }
  // }
})

