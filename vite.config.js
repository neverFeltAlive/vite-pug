import { defineConfig } from 'vite';

import { join, resolve } from 'path';
import { getRollupInput } from 'vite-mpa';
import svgSpritePlugin from 'vite-sprite-svg';

import pug from './plugins/pug/vite-plugin-pug.js';

const rootDir = resolve(__dirname, 'src');
const pagesDir = resolve(rootDir, 'pages');
const publicDir = resolve(__dirname, 'public');
const root = './src';
const port = 3000;

export default defineConfig(({ command }) => {
  return {
    plugins: [
      pug(),
      svgSpritePlugin({
        baseDir: rootDir,
        publicDir,
        isDev: command !== 'build',
      }),
    ],
    publicDir: publicDir,
    root: root,
    build: {
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: getRollupInput({ root, rootDir, port, pagesDir }, command !== 'build'),
      },
      emptyOutDir: true,
    },
    server: {
      port: port,
      open: '/pages/',
    },
    resolve: {
      alias: {
        '@components': join(rootDir, 'components'),
        '@plugins': resolve(__dirname, 'plugins'),
        '@pages': join(rootDir, 'pages'),
        '@utils': join(rootDir, 'utils'),
        '@styles': join(rootDir, 'styles'),
        '@assets': join(rootDir, 'assets'),
      },
    },
  };
});
