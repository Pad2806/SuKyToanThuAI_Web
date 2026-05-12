import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~components': path.resolve(__dirname, './src/components'),
      '~data': path.resolve(__dirname, './src/data'),
      '~lib': path.resolve(__dirname, './src/lib'),
      '~routes': path.resolve(__dirname, './src/routes'),
      '~styles': path.resolve(__dirname, './src/styles'),
      '~types': path.resolve(__dirname, './src/data/types'),
    },
  },
  test: {
    environment: 'node',
    globals: false,
  },
});
