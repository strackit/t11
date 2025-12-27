import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Exclude shops-query from optimization - it will be served as native ESM
    exclude: ['shops-query'],
    // Include cross-fetch so Vite pre-bundles it with proper ESM exports
    include: ['cross-fetch']
  },
  resolve: {
    // Ensure proper ESM resolution
    dedupe: ['@apollo/client']
  }
})

