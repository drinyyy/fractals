import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    glsl() // Handle shader files
  ],
  server: {
    open: false,
    // This ensures that the dev server responds with index.html for any path
    historyApiFallback: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  resolve: {
    alias: {
      // Add any aliases you might need here
      // '@': '/src',
    }
  }
});