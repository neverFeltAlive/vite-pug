# Vite SVG Sprite Plugin

This is a custom Vite plugin that creates an SVG sprite file from multiple SVG icons. It uses the SVGO library to optimize the SVG content and generates a single sprite file which is then injected into your HTML file.

## Installation

To use this plugin, you need to install it as a development dependency:

```bash
npm install --save-dev vite-svg-sprite-plugin
```

## Usage

Import the plugin in your `vite.config.js` file and add it to the plugins array:

```javascript
import svgSpritePlugin from 'vite-svg-sprite-plugin';

export default {
  plugins: [
    svgSpritePlugin({
      baseDir: __dirname,
      publicDir: 'public',
      outputDir: 'dist',
      isDev: false
    })
  ]
}
'''

You can pass the following options to the plugin:
    baseDir (string, required): the base directory of your project.
    publicDir (string, required): the public directory of your project.
    outputDir (string, optional): the output directory where the sprite file will be saved. Defaults to 'dist'.
    isDev (boolean, optional): a flag indicating whether the plugin is being used in development mode or not. Defaults to false.
    
