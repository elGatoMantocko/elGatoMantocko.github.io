import { devtools } from '@tanstack/devtools-vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import contentCollections from '@content-collections/vite';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': resolve(__dirname, './src'),
      'content-collections': resolve(
        __dirname,
        './.content-collections/generated',
      ),
    },
  },
  plugins: [
    devtools(),
    contentCollections(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
