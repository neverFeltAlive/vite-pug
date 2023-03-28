import { resolve } from 'path';
import { defineConfig } from 'vite';
import pug from './plugins/pug/vite-plugin-pug.js';
import { getRollupInput } from './plugins/pages/index.js';
import svgSpritePlugin from './plugins/sprite/svg-sprite.js';

const rootDir = resolve(__dirname, 'src');
const pagesDir = resolve(rootDir, 'pages');
const publicDir = resolve(__dirname, 'public');
const root = './src/pages';
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
        input: getRollupInput(
          { root, rootDir, port, pagesDir },
          command !== 'build'
        ),
      },
    },
    server: {
      port: port,
    },
  };
});

