'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var nodeSass = _interopDefault(require('node-sass'));
var postcss = _interopDefault(require('postcss'));
var postcssrc = _interopDefault(require('postcss-load-config'));
var Concat = _interopDefault(require('concat-with-sourcemaps'));
var less = _interopDefault(require('less'));
var rollupPluginutils = _interopDefault(require('@rollup/pluginutils'));

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
        context: styleNode.context,
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

function sassLoader (node, sassOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultOpts = {
            sourceMap: node.id,
            sourceMapContents: true,
            outFile: node.id,
            sourceMapEmbed: false,
            omitSourceMapUrl: false,
            file: node.id,
            includePaths: node.options.includePaths,
            outputStyle: "expanded"
        };
        let $result;
        /**
         * 编译结果
         */
        const fincalResult = nodeToResult(node);
        try {
            $result = nodeSass.renderSync(_.mergeWith(defaultOpts, sassOpts, (obj, src) => {
                if (_.isArray(obj))
                    return src;
            }));
            fincalResult.context.code = $result.css.toString("UTF-8");
            fincalResult.context.sourceMap = JSON.parse($result.map.toString());
            // console.log(JSON.parse($result.map.toString()));
            fincalResult.context.compileToCss = true;
        }
        catch (error) {
            console.log("\n" + error + "\n");
            fincalResult.status = "ERROR";
            fincalResult.message = error;
        }
        return fincalResult;
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
            $result.message = `postcss can't compile ${$result.context.lang}`;
            return nodeToResult(node);
        }
        // console.log(node.id);
        // if (node.context.lang === "scss") console.log(node.context.sourceMap);
        const ctx = {
            map: {
                inline: false,
                annotation: false,
                prev: node.context.sourceMap,
                sourcesContent: true
            }
        };
        function postcssConf() {
            return __awaiter(this, void 0, void 0, function* () {
                // const { plugins, options } = await postcssrc(ctx);
                return yield postcssrc(ctx);
            });
        }
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
        config.options.from = node.id;
        config.options.to = node.id;
        /**
         *  * Provides the result of the PostCSS transformations.
         */
        let $result;
        const finalResult = nodeToResult(node);
        try {
            $result = yield postcss(config.plugins).process(node.context.code, config.options);
            finalResult.context.code = $result.css;
            finalResult.context.sourceMap = JSON.stringify($result.map.toJSON());
            finalResult.context.compileByPostcss = true;
            // if (node.context.lang === "scss") console.log($result.map.toJSON());
            if (node.context.lang === "less")
                finalResult.message = JSON.stringify($result.warnings());
            $result.warnings().forEach(warn => console.log(warn));
        }
        catch (err) {
            finalResult.status = "ERROR";
            finalResult.message = "\n" + err;
            console.log(err);
        }
        (function (flag) {
            if (node.context.lang === flag) {
                const concat = new Concat(true, node.id, "\n");
                // concat.add(null, "// (c) John Doe");
                concat.add(`file1.${flag}`, node.context.code, node.context.sourceMap.toString());
                concat.add(`file2.${flag}`, $result.css, $result.map.toJSON());
                console.log(concat.sourceMap);
                console.log(finalResult.context.sourceMap);
            }
        })();
        return finalResult;
    });
}

function lessLoader (node, opts = {
    filename: node.id,
    sourceMap: {
        outputSourceFiles: true,
        sourceMapFileInline: true
    }
}) {
    return __awaiter(this, void 0, void 0, function* () {
        const $result = nodeToResult(node);
        try {
            const lessResult = yield less.render(node.context.code, opts);
            $result.context.code = lessResult.css; //parsedMap(lessResult.map)
            $result.context.sourceMap = lessResult.map;
            $result.context.compileToCss = true;
        }
        catch (error) {
            $result.status = "ERROR";
            console.log("\n" + error + "\n");
        }
        return $result;
    });
}

const defaultRules = [
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

const defaultConfig = {
    extensions: ["css", "scss", "sass", "less"],
    include: [],
    exclude: [],
    includePaths: ["node_modules/", process.cwd()],
    sourceMap: "source-map",
    postcss: true,
    rules: [],
    mapping: {
        sass: /\.(sa|sc)ss$/,
        css: /\.css$/,
        postcss: /\.(sa|sc|c|le)ss$/,
        less: /\.less$/
    }
};
/**
 * 合并 loaders 选项
 * @param objValue 第一个对象
 * @param srcValue 第二个对象
 */
const customizer = function (objValue, srcValue) {
    if (_.isArray(objValue) && objValue.every(item => item.id)) {
        return srcValue.concat(objValue).reverse();
    }
    else if (_.isArray(objValue)) {
        return srcValue;
    }
    return;
};
function getOptions (opts) {
    opts = _.mergeWith(defaultConfig, opts, customizer);
    opts.rules = pluginRules(opts);
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

/**
 * 当前已被编译的所有StyleNode
 */
const allReturns = {};
/**
 * 当前正在被处理的StyleNode
 */
let curNode;
/**
 * 已被StyleNode被编译后的结果集合
 */
const allResults = [];
/**
 * 当前StyleNode的编译结果
 */
let curResult;
const Compilation = {
    /**
     *将当前节点信息添加到全局状态
     * @param node
     * @returns 返回传入节点信息
     */
    set: function (node) {
        curNode = node;
        allReturns[node.id] = node;
        return node;
    },
    /**
     * @returns 当前编译节点
     */
    getCurtNode: () => curNode,
    /**
     * @returns 目前已被编译和正在编译的所有节点
     */
    getAllNodes: () => allReturns
};
const compilerResults = {
    /**
     *将当前节点的编译结果添加到全局状态
     * @param result
     * @returns 返回传入的编译结果
     */
    set: function (result) {
        curResult = result;
        allResults.push(result);
        return result;
    },
    /**
     * @returns 当前编译结果
     */
    getCurResult: () => curResult,
    /**
     * @returns 当前所有编译结果
     */
    getAllResults: () => allResults
};

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
function transform(context, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = reduceCompileCode(opts.rules, context, (prev, cur) => __awaiter(this, void 0, void 0, function* () {
            const id = context.source;
            let curText = yield prev;
            if (pluginLoader(cur, id)) {
                const $nodes = Compilation.set(formatNode(id, curText, opts));
                curText = compilerResults.set(yield pluginLoader(cur, id)($nodes, cur.options)).context;
            }
            return curText;
        }));
        return res;
    });
}
/**
 *
 * @param id File path or file name, for matching purposes only, no actual reading is performed，
 * Affects the SourceMap path
 * @param code Source code to be translated
 * @param options Translation options
 * @returns { Promise<CompileContent> } dd
 */
function transformCode (id, code, options) {
    return transform(formatContext(id, code), options);
}

// import sourceMap from "./core/source.map";
function index (opts = {}) {
    const options = getOptions(opts);
    const testExt = new RegExp(`.(${options.extensions.join("|")})$`, "i");
    return {
        name: "rollup-plugin-style-process",
        transform: function (code, id) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!pluginFilter(testExt, options.include, options.exclude)(id))
                    return;
                const $result = yield transformCode(id, code, options);
                return {
                    // If the code is not processed into CSS, the source code will be returned
                    code: $result.compileToCss
                        ? `export default ${JSON.stringify($result.code)}`
                        : $result.code,
                    map: $result.sourceMap
                };
            });
        }
    };
}

module.exports = index;
