import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Add this to help with dependency resolution
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  define: {
    global: 'globalThis',
  },
  // Add this to ensure proper module resolution
  esbuild: {
    target: 'esnext',
  },
});