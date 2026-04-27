import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove all console.* in production build
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — loaded on every page, cached indefinitely
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core'
          }
          // React Router — needed on every page but separate chunk
          if (id.includes('node_modules/react-router')) {
            return 'react-router'
          }
          // React Query — separate chunk so it can update independently
          if (id.includes('node_modules/@tanstack')) {
            return 'react-query'
          }
          // Icons — large library, rarely changes
          if (id.includes('node_modules/react-icons')) {
            return 'react-icons'
          }
          // Animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
          // All other node_modules → vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})
