import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Vite's server configuration for local development
  server: {
    proxy: {
      // Proxying API requests during development to avoid CORS issues
      '/api': {
        target: 'http://localhost:3000', // Backend API URL
        changeOrigin: true,              // Modify the Origin header to the target URL
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewriting the path, if needed
      },
    },
  },

  // Custom CSS configuration to integrate with Tailwind and PostCSS (if needed)
  css: {
    postcss: './postcss.config.js', // Ensure PostCSS is configured with Tailwind
  },

  // Build settings for optimization and performance
  build: {
    sourcemap: true, // Enable source maps for easier debugging in production
    outDir: 'dist',  // Directory for the production build output
    rollupOptions: {
      output: {
        // Customize build outputs if necessary
      },
    },
  },
});
