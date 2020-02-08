import _ from 'lodash';
import rollupPluginutils from '@rollup/pluginutils';
import autoImport$1 from 'import-cwd';
import postcssrc from 'postcss-load-config';
import path, { dirname } from 'path';
import fs from 'fs';
import 'convert-source-map';
import concatMap from 'concat-with-sourcemaps';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const defaultExt = ["css", "scss", "sass", "less", "styl"];
const defaultConfig = {
    extensions: defaultExt,
    extract: "dist/index.css",
    include: [],
    exclude: [],
    includePaths: ["node_modules/", process.cwd()],
    sourceMap: "source-map",
    postcss: false,
    mapping: {
        sass: /\.(sa|sc)ss$/,
        css: /\.css$/,
        postcss: /\.(css|scss|sass|less|styl)$/,
        less: /\.less$/,
        stylus: /\.styl$/
    }
};
/**
 * 合并 loaders 选项
 * @param objValue 第一个对象
 * @param srcValue 第二个对象
 */
const costumier = function (objValue, srcValue) {
    if (_.isArray(objValue) && objValue.every(item => item.id)) {
        return srcValue.concat(objValue).reverse();
    }
    else if (_.isArray(objValue)) {
        return srcValue;
    }
    return;
};
function getOptions (opts) {
    opts = _.mergeWith(defaultConfig, opts, costumier);
    return opts;
}

function pluginFilter (pattern, include, exclude) {
    const testPath = rollupPluginutils.createFilter(include, exclude);
    return (id) => pattern.test(id) && testPath(id);
}

function pluginLoader (role, id) {
    const ruleFilter = pluginFilter(role.test, role.include, role.exclude);
    let transform;
    if (!ruleFilter(id))
        return;
    if (role.loader && typeof role.loader !== "function")
        return;
    if (role.loader && typeof role.loader === "function") {
        transform = role.loader;
    }
    return transform;
}

function formatNode(id, context, options) {
    return {
        id,
        fileName: id.replace(/(.*\/)*([^.]+).*/gi, "$2"),
        cwd: process.cwd(),
        context,
        options,
        dest: options.export,
        path: id.replace(/(.*\/)*([^.]+).*/gi, "$1")
    };
}
function nodeToResult(styleNode) {
    return {
        status: "OK",
        id: styleNode.id,
        fileName: styleNode.fileName,
        path: styleNode.path,
        content: styleNode.context,
        message: ""
    };
}
function formatContext(id, code) {
    const lang = id.replace(/.+\./, "").toLowerCase();
    return {
        source: id,
        code,
        sourceMap: null,
        lang,
        compileByPostcss: false,
        compileToCss: lang === "css"
    };
}
function formatSize(bytes) {
    return bytes < 10000
        ? bytes.toFixed(0) + " B"
        : bytes < 1024000
            ? (bytes / 1024).toPrecision(3) + " kB"
            : (bytes / 1024 / 1024).toPrecision(4) + " MB";
}
function formatCache(allIds, Cache) {
    const _result = {};
    allIds.forEach(i => {
        _result[i] = JSON.parse(Cache.get(i));
    });
    return _result;
}

function autoImport (mde) {
    let installed = true;
    try {
        require(mde);
    }
    catch (error) {
        installed = false;
    }
    return {
        installed,
        module: autoImport$1.silent(mde)
    };
}

function red(text) {
    return `\x1b[1m\x1b[31m${text}\x1b[0m`;
}
function green(text) {
    return `\x1b[1m\x1b[32m${text}\x1b[0m`;
}

function sassLoader (node, sassOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * 编译结果变量
         */
        const finalResult = nodeToResult(node);
        const installation = autoImport("node-sass");
        if (installation.installed) {
            const userSass = installation.module;
            const defaultOpts = {
                sourceMap: node.id + ".map",
                sourceMapContents: true,
                outFile: node.id,
                sourceMapEmbed: false,
                omitSourceMapUrl: false,
                file: node.id,
                includePaths: node.options.includePaths,
                outputStyle: "expanded",
                sourceMapRoot: node.id
            };
            try {
                const sassResult = userSass.renderSync(_.mergeWith(defaultOpts, sassOpts, (obj, src) => {
                    if (_.isArray(obj))
                        return src;
                }));
                finalResult.content.code = sassResult.css.toString("UTF-8");
                finalResult.content.sourceMap = JSON.parse(sassResult.map.toString("UTF-8"));
                finalResult.content.compileToCss = true;
            }
            catch (error) {
                console.log("\n" + red(error));
                finalResult.status = "ERROR";
                finalResult.message = error;
            }
        }
        return finalResult;
    });
}

var cssLoader = (node) => nodeToResult(node);

const defaultOpts = {
    postcssrc: true
};
function handlePluginZip(objVal, srcVal) {
    if (_.isArray(objVal))
        return srcVal;
}
function postcssLoader (node, postcssOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!node.context.compileToCss) {
            const $result = nodeToResult(node);
            $result.status = "ERROR";
            $result.message = `postcss can't compile ${$result.content.lang}`;
            return nodeToResult(node);
        }
        const installation = autoImport("postcss");
        const finalResult = nodeToResult(node);
        if (installation.installed) {
            const userPostcss = installation.module;
            const ctx = {
                map: {
                    inline: false,
                    annotation: false,
                    // prev: JSON.parse(node.context.sourceMap as any),
                    prev: typeof node.context.sourceMap === "string"
                        ? node.context.sourceMap
                        : null,
                    sourcesContent: true
                },
                from: node.id,
                to: node.id + ".map"
            };
            const postcssConf = () => __awaiter(this, void 0, void 0, function* () {
                return yield postcssrc(ctx, path.dirname(node.id));
            });
            postcssOpts = _.mergeWith(defaultOpts, postcssOpts, handlePluginZip);
            /**
             * Result of postcssrc is a Promise containing the filename plus the options
             *     and plugins that are ready to pass on to postcss.
             */
            let config;
            if (postcssOpts.postcssrc)
                config = yield postcssConf();
            else
                config = postcssOpts.options;
            /**
             *  * Provides the result of the PostCSS transformations.
             */
            let $result;
            try {
                $result = yield userPostcss(config.plugins).process(node.context.code, config.options);
                finalResult.content.code = $result.css;
                const $map = $result.map.toJSON();
                $map.sources = [node.id];
                finalResult.content.sourceMap = JSON.stringify($map);
                finalResult.content.compileByPostcss = true;
                if (node.context.lang === "less") {
                    finalResult.message = JSON.stringify($result.warnings());
                    $result.warnings().forEach(warn => console.log(warn));
                }
            }
            catch (err) {
                finalResult.status = "ERROR";
                finalResult.message = "\n" + err;
                console.log("\n" + red(err));
                console.log(red("\n当前错误节点:\n"), node);
            }
        }
        return finalResult;
    });
}

function lessLoader (node, opts = {
    filename: node.id,
    sourceMap: {
        outputSourceFiles: true,
        sourceMapFileInline: false
    }
}) {
    return __awaiter(this, void 0, void 0, function* () {
        const $result = nodeToResult(node);
        const installation = autoImport("less");
        if (installation.installed) {
            const userLess = installation.module;
            try {
                const lessResult = yield userLess.render(node.context.code, opts);
                $result.content.code = lessResult.css; //parsedMap(lessResult.map)
                $result.content.sourceMap = JSON.parse(lessResult.map);
                $result.content.compileToCss = true;
            }
            catch (error) {
                $result.status = "ERROR";
                $result.message = error;
                console.log("\n" + error + "\n");
            }
        }
        return $result;
    });
}

function stylusLoader (node, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalResult = nodeToResult(node);
        const installation = autoImport("stylus");
        if (installation.installed) {
            const userStylus = installation.module;
            const defaultOpts = {
                sourceMap: {
                    sourceRoot: node.id,
                    basePath: "."
                }
            };
            opts = Object.assign({}, defaultOpts, opts);
            try {
                const renderOpts = Object.assign({}, opts);
                delete renderOpts.sourceMap;
                const style = userStylus(node.context.code, renderOpts)
                    .set("filename", node.id)
                    .set("sourcemap", opts.sourceMap);
                style.render(function (err, css) {
                    if (err)
                        throw err;
                    finalResult.content.code = css;
                    finalResult.content.sourceMap = style.sourcemap;
                    finalResult.content.compileToCss = true;
                });
            }
            catch (error) {
                finalResult.status = "ERROR";
                console.log(error);
            }
        }
        return finalResult;
    });
}

const defaultRules = [
    {
        id: "stylus",
        loader: stylusLoader
    },
    {
        id: "less",
        loader: lessLoader
    },
    {
        id: "sass",
        loader: sassLoader
    },
    {
        id: "css",
        loader: cssLoader
    }
];
function pluginRules (opts) {
    const finalRules = defaultRules;
    if (opts.postcss) {
        finalRules.push({
            id: "postcss",
            loader: postcssLoader
        });
    }
    finalRules.map(i => {
        i.test = opts.mapping[i.id];
        return i;
    });
    return finalRules;
}

/**
 * @description reduce chain compilation style
 *
 * @param { Rule[] } collect All rules collection
 *
 * @param { CompileContent } CompileContext Compilation context
 *
 * @param { callback<Rule> } compiler Compile process callback
 */
function reduceCompileCode(collect, originCode, compiler) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0, len = collect.length; i < len; i++) {
            originCode = yield compiler(originCode, collect[i], i, collect);
        }
        return originCode;
    });
}
/**
 *
 * @param { CompileContent } context
 *
 * @param opts
 */
function transform(context, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = reduceCompileCode(pluginRules(opts), context, (prev, cur) => __awaiter(this, void 0, void 0, function* () {
            const id = context.source;
            let curText = yield prev;
            if (pluginLoader(cur, id)) {
                const $nodes = formatNode(id, curText, opts);
                curText = (yield pluginLoader(cur, id)($nodes, cur.options))
                    .content;
            }
            return curText;
        }));
        return res;
    });
}
/**
 *
 * @requires transform
 * @param id  File path or file name, for matching purposes only, no actual reading is performed，
 * Affects the SourceMap path
 * @param code Source code to be translated
 * @param options Translation options
 * @returns { Promise<CompileContent> }
 */
var transformCode = (id, code, options) => transform(formatContext(id, code), options);

function concatSourceMap(fileName, results) {
    const newSourceMpa = new concatMap(true, fileName, "");
    results.forEach(item => {
        newSourceMpa.add(item.id, item.code, item.map);
    });
    return newSourceMpa;
}

// type CallbackFn = (prev: Summary, cur: Val, index: number) => Summary;
// function reduce(results: Result[], value: Summary, fn: CallbackFn) {
//     const len = results.length;
//     const i = 1;
//     while (i < len) {
//         value = fn(value);
//     }
// }
function ensureParentDirs(dir) {
    return new Promise((res, rej) => {
        fs.exists(dir, exist => {
            if (exist)
                return res(true);
            else {
                fs.mkdir(dir, err => {
                    if (!err) {
                        res(true);
                    }
                    else if (err &&
                        (err.code === "ENOENT" || err.code === "EEXIST")) {
                        ensureParentDirs(dirname(dir));
                        ensureParentDirs(dir);
                        res(true);
                    }
                    else if (err) {
                        rej(err);
                    }
                });
            }
        });
    });
}
function writeFile(path, data) {
    return new Promise((res, rej) => {
        fs.writeFile(path, data, err => {
            if (err)
                rej(err);
            else
                res(path);
        });
    });
}
function extract(results, extract, overArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const _resultSet = _(results)
            .values()
            .map(item => {
            return {
                id: item.source,
                code: item.code,
                map: item.sourceMap
            };
        })
            .value();
        const mapUrl = path.resolve(extract + ".map");
        const cssUrl = path.resolve(extract);
        const newSourceMpa = concatSourceMap(mapUrl, _resultSet);
        const valveSummary = {
            resultSet: _resultSet,
            summary: {
                code: newSourceMpa.content.toString(),
                map: newSourceMpa.sourceMap.toString()
            }
        };
        if (typeof overArgs === "function") {
            yield overArgs(valveSummary);
        }
        else {
            try {
                yield ensureParentDirs(cssUrl.replace(/(.*\/)*([^.]+).*/gi, "$1"));
                yield writeFile(cssUrl, valveSummary.summary.code);
                yield writeFile(mapUrl, valveSummary.summary.map);
                console.log("\n", green(extract), green(formatSize(valveSummary.summary.code.length)));
            }
            catch (error) {
                console.log(red("\n" + error));
                console.log(red("\nCannot write..."));
            }
        }
        return;
    });
}

// import sourceMap from "./core/source.map";
function index (opts = {}) {
    opts = getOptions(opts);
    const testExt = new RegExp(`.(${opts.extensions.join("|")})$`, "i");
    return {
        name: "rollup-plugin-style-process",
        transform: function (code, id) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!pluginFilter(testExt, opts.include, opts.exclude)(id))
                    return;
                const $result = yield transformCode(id, code, opts);
                if (this.cache.has("results")) {
                    const $cache = JSON.parse(this.cache.get("results"));
                    $cache.push(id);
                    this.cache.set("results", JSON.stringify($cache));
                }
                else {
                    this.cache.set("results", JSON.stringify([id]));
                }
                this.cache.set(id, JSON.stringify($result));
                return {
                    // If the code is not processed into CSS, the source code will be returned
                    code: $result.compileToCss
                        ? `export default ${JSON.stringify($result.code)}`
                        : $result.code,
                    map: $result.sourceMap
                };
            });
        },
        buildEnd(options) {
            const $result = formatCache(JSON.parse(this.cache.get("results")), this.cache);
            return extract($result, "dist/index.css");
        },
        generateBundle(opts, bundle) {
            // console.log(bundle);
        }
    };
}

export default index;
