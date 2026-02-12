import { defineConfig } from 'vite';
import path from 'path';

const API_TARGET = 'https://api.autobutik.se';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // If CORS blocks direct requests to api.autobutik.se, set VITE_BACKEND_URL= (empty) in .env.local
    // so the app uses relative /car and /tecdoc and this proxy forwards them.
    proxy: {
      '/car': { target: API_TARGET, changeOrigin: true, secure: true },
      '/tecdoc': { target: API_TARGET, changeOrigin: true, secure: true },
      '/shop-api': { target: API_TARGET, changeOrigin: true, secure: true },
    },
  },
});
