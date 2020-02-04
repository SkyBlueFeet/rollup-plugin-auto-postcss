import _ from "lodash";
import { Rule } from "./plugin.loader";
import postcssLoader from "../loaders/postcss.loader";
import sassLoader from "../loaders/sass.loader";
import cssLoader from "../loaders/css.loader";

export type Pattern = Array<string | RegExp>;

export type PluginOptions = {
    /**
     * 需要处理的文件拓展名
     * @default [".css", ".scss", ".sass", "less"]
     */
    extensions?: string[];

    /**
     * 输出目录
     */
    export?: string;

    /**
     * 输出文件名
     */
    filename?: string;

    /**
     * @default []
     * @type Array<string|RegExp>
     */
    include?: Pattern;

    /**
     * @default []
     * @type Array<string|RegExp>
     */
    exclude?: Pattern;

    /**
     * 是否使用postcss?
     * 将会自动使用根目录的postcss配置文件
     * @default true
     * @type boolean
     */
    postcss?: boolean;

    /**
     * @default ["node_modules/", process.cwd()]
     */
    includePaths?: string[];

    /**
     * 自定义loader,plugin将会优先使用loader作为处理程序,
     * 写法与webpack loader相差不多
     * @default []
     */
    loaders?: Rule[];

    /**
     * 如果为true
     * @default true
     */
    sourceMap?: boolean;
};

const defaultConfig: PluginOptions = {
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

const uniqLoader = function(loaders: Rule[]): Rule[] {
    loaders = loaders.filter(item => item.id).reverse();
    return _.uniqBy(loaders, "id");
};

/**
 * 合并 loaders 选项
 * @param objValue 第一个对象
 * @param srcValue 第二个对象
 */
const customizer = function(objValue: Rule[], srcValue: Rule[]): Rule[] {
    if (_.isArray(objValue) && objValue.every(item => item.id)) {
        return objValue.concat(srcValue.reverse());
    } else if (_.isArray(objValue)) {
        return srcValue;
    }
    return;
};

export default function(opts: PluginOptions): PluginOptions {
    opts = _.mergeWith(defaultConfig, opts, customizer);
    if (opts.loaders) opts.loaders = uniqLoader(opts.loaders);

    if (opts.postcss)
        opts.loaders.unshift({
            id: "postcss",
            test: /\.(sa|sc|c)ss$/,
            loader: postcssLoader
        });

    return opts;
}
