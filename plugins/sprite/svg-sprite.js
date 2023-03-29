import glob from 'fast-glob';
import { readFile, promises as fsPromises } from 'fs';
import { join } from 'path';
import { optimize } from 'svgo';

import { logSuccess, logTitle, logWarning } from '../logger/index.js';

/**
 * Optimises svg
 * @param content - string of svg
 * @return {string}
 */
function optimizeSvg(content) {
  const result = optimize(content);
  return result.data;
}

/**
 * Processes svg from icons folder and injects a link to a sprite file into html
 * @param baseDir - base directory of a project
 * @param publicDir - directory for static assets
 * @param outputDir - output directory where sprite file is saved
 * @param isDev - is project running in development
 * @return {unknown|{transformIndexHtml(*): Promise<unknown>, name: string}}
 */
export default function svgSpritePlugin({
  baseDir,
  publicDir,
  outputDir = 'dist',
  isDev = false,
}) {
  return {
    name: 'svg-sprite',
    async transformIndexHtml(html) {
      // Get all SVG files in the directory and its subdirectories
      const svgFiles = await glob(
        join(baseDir, 'assets/icons/**/*.svg').replace(/\\/g, '/')
      );

      // Generate the SVG sprite
      const svgPromises = svgFiles.map((svgFile) => {
        return new Promise((resolve, reject) => {
          readFile(svgFile, 'utf8', (error, data) => {
            if (error) {
              reject(error);
            } else {
              const optimizedSvg = optimizeSvg(data);
              const svgName = svgFile.split('/').pop().split('.').shift();
              resolve(
                `<symbol id='${svgName}' viewBox='0 0 24 24'>${optimizedSvg}</symbol>`
              );
            }
          });
        });
      });

      //region Logs
      console.log();
      logTitle('SVG Configuration');
      //endregion

      try {
        const icons = await Promise.all(svgPromises);

        // Write sprite to a file
        const svgSprite = `<svg xmlns='http://www.w3.org/2000/svg' style='display: none;'>${icons.join(
          ''
        )}</svg>`;
        const svgFilePath = isDev
          ? join(publicDir, 'sprite.svg')
          : join(outputDir, 'assets/sprite.svg');
        await fsPromises.writeFile(svgFilePath, svgSprite);

        // Inject link into html
        const svgSpriteRef = `<link rel='preload' href='${
          isDev ? '/sprite.svg' : '/assets/sprite.svg'
        }' as='image' />\n`;

        //region Logs
        logSuccess('Successfully processed all svg files');
        console.log();
        //endregion

        return html.replace('<head>', `<head>\n${svgSpriteRef}`);
      } catch (error) {
        //region Logs
        logWarning('Failed to process SVG filed');
        console.error(error);
        console.log();
        //endregion
      }
    },
  };
}
