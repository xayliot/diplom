import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend'],
          'diagnostics': [
            './src/pages/diagnostics/Diagnostics.tsx',
            './src/pages/diagnostics/steps/Step1_Mouse.tsx',
            './src/pages/diagnostics/steps/Step2_Keyboard.tsx',
            './src/pages/diagnostics/steps/Step3_GUI.tsx',
            './src/pages/diagnostics/steps/Step4_Result.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600,
    cssMinify: true,
    sourcemap: false
  },
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: false
    }
  },
})