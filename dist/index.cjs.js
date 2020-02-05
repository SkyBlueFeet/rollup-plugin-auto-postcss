'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
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

const defaultConfig = {
    extensions: ["css", "scss", "sass", "less"],
    include: [],
    exclude: [],
    includePaths: ["node_modules/", process.cwd()],
    sourceMap: "source-map",
    postcss: true,
    rules: []
};
const uniqLoader = function (loaders) {
    loaders = loaders.filter(item => item.id);
    return _.uniqBy(loaders, "id");
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
    if (opts.rules)
        opts.rules = uniqLoader(opts.rules);
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
function formatContext(id, code) {
    const lang = id.replace(/.+\./, "").toLowerCase();
    return {
        source: id,
        code,
        sourceMap: "{}",
        lang,
        compileByPostcss: false,
        compileToCss: lang === "css"
    };
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
const allResults = {};
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
        allResults[result.id] = result;
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
 * @param { CompileContext } CompileContext Compilation context
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
function transformCode (context, opts) {
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

function index (opts = {}) {
    const options = getOptions(opts);
    const testExt = new RegExp(`.(${options.extensions.join("|")})$`, "i");
    const transform = function (code, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!pluginFilter(testExt, options.include, options.exclude)(id))
                return;
            const $result = yield transformCode(formatContext(id, code), options);
            return {
                code: `export default ${JSON.stringify($result.code)}`,
                map: $result.sourceMap
            };
        });
    };
    return {
        name: "rollup-plugin-auto-postcss",
        transform
    };
}

module.exports = index;
