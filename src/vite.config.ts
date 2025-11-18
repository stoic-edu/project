import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'emulator-instructions',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          setTimeout(() => {
            console.log('\n  📱 Android Emulator URL:');
            console.log('  \x1b[36m➜\x1b[0m  Emulator: \x1b[1mhttp://10.0.2.2:5174\x1b[0m');
            console.log('  \x1b[2m   (Use this URL in your Android Studio emulator)\x1b[0m\n');
          }, 100);
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    host: '0.0.0.0', // Allow access from network (for mobile testing)
    port: 5174,
    open: true,
    strictPort: false, // Try next port if taken
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
  },
});
