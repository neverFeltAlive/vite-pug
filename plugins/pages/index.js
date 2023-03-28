import {readdirSync, writeFile} from "fs";
import {join, resolve} from "path";
import {logError, logSuccess, logTitle} from "../logger/index.js";

let pluginConfig = {};

/**
 * Gets all pages based on project structure.
 * Each folder in src/pages corresponds to a single page.
 * Such folder must contain pug index file to serve as an entry point.
 * @return {*[]}
 */
const getPages = function () {
    let pages = [];
    return () => {
        if (pages.length) return pages;

        readdirSync(pluginConfig.pagesDir, {withFileTypes: true})
            .filter((dir) => dir.isDirectory())
            .forEach((dir) => {
                const indexFile = getPageIndex(dir.name)
                indexFile && pages.push({
                    name: dir.name,
                    src: `/${dir.name}/`,
                    path: resolve(pluginConfig.pagesDir, dir.name, indexFile)
                })
            })
        return pages
    }
}();

/**
 * Gets all pages for the project
 */
export function getRollupInput(config, isDev = false) {
    pluginConfig = config;
    const pages = getPages().map((page) => page.path);
    generatePagesJSON();
    !isDev && pages.push(join(pluginConfig.pagesDir, 'index.pug'))
    return pages
}

/**
 * Gets pug index file from a page folder.
 * Returns false if no entry point was found.
 * @param dirName - name of the folder
 * @return {false|string}
 */
function getPageIndex(dirName) {
    const indexFile = readdirSync(join(pluginConfig.pagesDir, dirName))
        .find((file) => file === 'index.pug');
    return !!indexFile && join(pluginConfig.pagesDir, dirName, indexFile)
}

/**
 * Saves pages configuration to a json file
 */
function generatePagesJSON() {
    const json = {
        links: []
    };

    getPages().forEach((page) => {
        json.links.push(page);
    })

    writeFile(`${pluginConfig.root}/pages.json`, JSON.stringify(json), 'utf8', (errors) => {
        console.log()
        logTitle('Pages Configuration')
        if (!errors) {
            logSuccess('Successfully configured pages.json')
        } else {
            logError('Failed to configure pages.json')
            console.error(errors)
        }
        console.log()
    });
}