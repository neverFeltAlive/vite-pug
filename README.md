# Vite PUG configuration for native JS projects 

This is a configuration for Vite for simple projects which require no frameworks.
It includes:
- [custom pug plugin](https://github.com/yend724/vite-pug-boilerplate)
- [custom plugin for SVG sprites](#vite-svg-sprite-plugin)
- [custom utility to dynamically detect all necessary pages](#working-with-pages)

## Installation

You can simply clone this repository and install neccessary dependensies with:
```bash
npm i
```

Or use an npm package for automated setup:
```bash
npx create-vite-native-app
```

## Working with pages

To make work easier and project structure much more pleasant I created a simple utility which detects pages automatically and configures Vite accordingly.
> As a bonus it generates index page which contains links to all existing pages

To use it you simply need to follow this project structure:

```bash
└───src
    ├───assets
    ├───components
    ├───pages
    │   │   index.js
    │   │   index.pug
    │   │   pages.json
    │   ├───main
    │   │       index.pug
    │   └───test
    │           index.pug
    ├───styles
    └───utils
```

Simply create a ***pages*** folder inside your root directory (in my case it is 'src'). To create a new page create a new directory inside of the ***pages*** folder with an ***index.pug*** inside. This will create a new entry point for VIte.

>There are some autogenerated files:
> - index.js
> - index.pug
> - index.json
>
> directly in the ***pages*** directory. They are used to create an Index page which contains all the links to the existing pages on the project. This files are not  going to be included in your production build.

## Vite SVG Sprite Plugin

This is a custom Vite plugin that creates an SVG sprite file from multiple SVG icons. It uses the SVGO library to optimize the SVG content and generates a single sprite file which is then served from public folder. 

> In order to use this sprite I created a simple pug mixin which references it:
```pug
mixin svg(name)
    svg(class='icon ' + name)
        use(xlink:href='/sprite.svg#' + name)

```

### Usage

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
```

 #### You can pass the following options to the plugin:
 - ***baseDir*** (string, required): the base directory of your project.
 - ***publicDir*** (string, required): the public directory of your project.
 - ***outputDir*** (string, optional): the output directory where the sprite file will be saved. Defaults to 'dist'.
 - ***isDev*** (boolean, optional): a flag indicating whether the plugin is being used in development mode or not. Defaults to false.
