import _ from "lodash";
import { Rule } from "./plugin.loader";
import pluginRules from "./plugin.rules";

export type EngineSuppert = "sass" | "less" | "css" | "postcss";

export type Pattern = Array<string | RegExp>;

type Lang = "css" | "scss" | "sass" | "less" | "stylus" | "styl";

export type SourceMap = false | "inline" | "source-map";

export type ProcessMapping = {
    [k in EngineSuppert]?: RegExp;
};

export interface PluginOptions {
    /**
     * @description File extensions to be processed
     *
     * @default ["css", "scss", "sass", "less"]
     */
    extensions?: Lang[];

    /**
     * @description export dir
     */
    export?: string;

    /**
     * 输出文件名
     */
    filename?: string;

    /**
     * @default []
     * @type { Array<string|RegExp> }
     */
    include?: Pattern;

    /**
     * @default []
     * @type { Array<string|RegExp> }
     */
    exclude?: Pattern;

    /**
     *
     * @description Do you want to use postcss?
     * * This option will automatically use the postcss configuration file in the root directory.
     * @default true
     * @type { boolean }
     */
    postcss?: boolean;

    /**
     * @description This array indicates that this plugin needs to search
     *  and process stylesheets in those directories
     * * If you do not know what effect this option will have, please do not fill it
     * @default ["node_modules/", process.cwd()]
     */
    includePaths?: string[];

    overrides?: object;

    /**
     * @deprecated
     *
     * @default []
     */
    rules?: Rule[];

    /**
     *
     * @member false
     * @member inline
     * @member source-map
     *
     * @default source-map
     */
    sourceMap?: SourceMap;

    /**
     * @description Preprocessor mapping Will replace the original configuration
     * Plugins need to rely on a pre-processing engine to process various pre-processors.
     * The files that each pre-processing engine needs to process are determined by this configuration.
     * * When you are not sure what the configuration will affect, Please do not fill in this item.
     * By default, the plugin can be very good job
     * * If you configure this option, you should ensure that mapping can handle all files that need to be processed
     * (the file is determined by `extensions`, `include`, `exclude`)
     *
     * @example
     * [ sass: /\.(sa|sc)ss$/ ]
     *
     * @member sass
     *
     * @member postcss
     *
     * @member css
     */
    mapping?: ProcessMapping;
}

const defaultConfig: PluginOptions = {
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
const customizer = function(objValue: Rule[], srcValue: Rule[]): Rule[] {
    if (_.isArray(objValue) && objValue.every(item => item.id)) {
        return srcValue.concat(objValue).reverse();
    } else if (_.isArray(objValue)) {
        return srcValue;
    }
    return;
};

export default function(opts: PluginOptions): PluginOptions {
    opts = _.mergeWith(defaultConfig, opts, customizer);
    opts.rules = pluginRules(opts);

    return opts;
}
