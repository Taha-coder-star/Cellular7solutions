import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (command === 'build' && mode === 'production') {
    let apiUrl;
    try { apiUrl = new URL(env.VITE_API_URL); } catch { /* handled below */ }
    if (!apiUrl || apiUrl.protocol !== 'https:' || !apiUrl.hostname || apiUrl.hostname === 'localhost' || apiUrl.hostname === '127.0.0.1' || apiUrl.username || apiUrl.password || apiUrl.search || apiUrl.hash || apiUrl.pathname.replace(/\/$/, '') !== '/api') {
      throw new Error('Production VITE_API_URL must be an HTTPS backend URL ending in /api.');
    }
  }
  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  };
});
