import _ from 'lodash';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import nodeSass from 'node-sass';
import rollupPluginutils from '@rollup/pluginutils';
import fs from 'fs';
import { dirname } from 'path';

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

const ctx = { map: { inline: true, annotation: false } };
function postcssConf() {
    return __awaiter(this, void 0, void 0, function* () {
        // const { plugins, options } = await postcssrc(ctx);
        return yield postcssrc(ctx);
    });
}
const defaultOptions = {
    postcssrc: true
};
function handlePluginZip(objVal, srcVal) {
    if (_.isArray(objVal))
        return srcVal;
}
function postcssLoader (postcssOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        postcssOpts = _.mergeWith(defaultOptions, postcssOpts, handlePluginZip);
        /**
         * Result of postcssrc is a Promise containing the filename plus the options
         *     and plugins that are ready to pass on to postcss.
         */
        let config;
        if (postcssOpts.postcssrc)
            config = yield postcssConf();
        else
            config = postcssOpts.options;
        config.options.from = this.id;
        /**
         *  * Provides the result of the PostCSS transformations.
         */
        let obj;
        try {
            obj = yield postcss(config.plugins).process(this.code, config.options);
        }
        catch (err) {
            console.log(err);
        }
        return obj && obj.css;
    });
}

function sassLoader (sassOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultOptions = {
            sourceMap: true,
            file: this.id,
            includePaths: this.options.includePaths
        };
        const style = nodeSass.renderSync(_.mergeWith(defaultOptions, sassOpts, (obj, src) => {
            if (_.isArray(obj))
                return src;
        }));
        return style && style.css.toString("UTF-8");
    });
}

function cssLoader () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.code;
    });
}

const defaultConfig = {
    extensions: [".css", ".scss", ".sass", ".less"],
    include: [],
    exclude: [],
    includePaths: ["node_modules/", process.cwd()],
    sourceMap: true,
    postcss: true,
    loaders: [
        {
            id: "css",
            test: /\.css$/,
            loader: cssLoader
        },
        {
            id: "sass",
            test: /\.(sa|sc)ss$/,
            loader: sassLoader
        }
    ]
};
const uniqLoader = function (loaders) {
    loaders = loaders.filter(item => item.id).reverse();
    return _.uniqBy(loaders, "id");
};
/**
 * 合并 loaders 选项
 * @param objValue 第一个对象
 * @param srcValue 第二个对象
 */
const customizer = function (objValue, srcValue) {
    if (_.isArray(objValue) && objValue.every(item => item.id)) {
        return objValue.concat(srcValue.reverse());
    }
    else if (_.isArray(objValue)) {
        return srcValue;
    }
    return;
};
function getOptions (opts) {
    opts = _.mergeWith(defaultConfig, opts, customizer);
    if (opts.loaders)
        opts.loaders = uniqLoader(opts.loaders);
    if (opts.postcss)
        opts.loaders.unshift({
            id: "postcss",
            test: /\.(sa|sc|c)ss$/,
            loader: postcssLoader
        });
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

function formatNode(id, code, options) {
    return {
        id,
        name: id.replace(/(.*\/)*([^.]+).*/gi, "$2"),
        cwd: process.cwd(),
        extension: "." + id.replace(/.+\./, "").toLowerCase(),
        code,
        options,
        dest: options.export,
        path: id.replace(/(.*\/)*([^.]+).*/gi, "$1")
    };
}

const logs = [];
var runtime = {
    push: (log) => logs.push(log),
    get: () => logs
};

function ensureParentDirsSync(dir) {
    if (fs.existsSync(dir))
        return true;
    try {
        fs.mkdirSync(dir);
    }
    catch (err) {
        if (err.code === "ENOENT") {
            ensureParentDirsSync(dirname(dir));
            ensureParentDirsSync(dir);
        }
    }
    return true;
}
/**
 * 检测文件或文件夹是否存在
 * @param  {String} filePath 文件路径
 * @param  {String} data 数据
 */
function output (filePath, data) {
    // const fileName = filePath.match(/[^\\/]+\.[^\\/]+$/)[0];
    const path = filePath.replace(/(.*\/)*([^.]+).*/gi, "$1");
    ensureParentDirsSync(path);
    fs.writeFileSync(filePath, data, { flag: "w+" });
    return filePath;
}
// function output(pluginOpts) {
//     return;
// }

/**
 * 自实现reduce
 * @param this
 * @param callbackfn
 */
function reduce(collect, callbackfn) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        for (let i = 1, len = collect.length; i < len; i++) {
            if (i === 1)
                result = collect[0];
            result = callbackfn(result, collect[i], i, collect);
        }
        return result;
    });
}
function transformCode (code, id, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        // console.log(opts.loaders);
        if (opts.loaders) {
            // opts.loaders.forEach(async loader => {
            //     if (pluginLoader(loader, id)) {
            //         runtime.push(styleNode);
            //         res = await pluginLoader(loader, id).call(
            //             styleNode,
            //             loader.option
            //         );
            //         return res;
            //     }
            // });
            // console.log(opts.loaders.reverse());
            res = reduce(opts.loaders.reverse(), (prev, cur, i, collect) => __awaiter(this, void 0, void 0, function* () {
                // console.log(cur);
                let curCode;
                i === 1 ? (curCode = code) : (curCode = yield prev);
                const styleNode = formatNode(id, curCode, opts);
                if (i === 1 && pluginLoader(collect[0], id)) {
                    runtime.push(styleNode);
                    return yield pluginLoader(collect[0], id).call(styleNode, collect[0].option);
                }
                if (pluginLoader(cur, id)) {
                    runtime.push(styleNode);
                    return yield pluginLoader(cur, id).call(styleNode, cur.option);
                }
            }));
        }
        output(opts.export + "/" + id.replace(/(.*\/)*([^.]+).*/gi, "$2") + ".css", yield res);
        return JSON.stringify(yield res);
    });
}

function index (opts = {}) {
    const options = getOptions(opts);
    const testExt = new RegExp(`.(${options.extensions
        .map(item => _.trimStart(item, "."))
        .join("|")})$`, "i");
    const transform = function (code, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!pluginFilter(testExt, options.include, options.exclude)(id))
                return;
            code = "export default " + (yield transformCode(code, id, options));
            return code;
        });
    };
    return {
        name: "rollup-plugin-auto-postcss",
        transform
    };
}

export default index;
