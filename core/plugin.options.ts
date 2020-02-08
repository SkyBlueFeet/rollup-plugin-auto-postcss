import { mergeDeep } from "../utils/replace.lodash";
import { ExtractFn } from "./output";

export type EngineSupport = "sass" | "less" | "css" | "postcss" | "stylus";

export type Pattern = Array<string | RegExp>;

type Lang = "css" | "scss" | "sass" | "less" | "stylus" | "styl";

export type SourceMap = false | "inline" | "source-map";

export type ProcessMapping = {
    [k in EngineSupport]?: RegExp;
};

export interface Overrides {
    extractFn?: ExtractFn;
}

export interface PluginOptions {
    /**
     * @description
     * Required processing engine,This option determines the engine that will be loaded at runtime.
     * When you use this option, you should consider the engine you need,
     * and it is recommended to use the conventional suffix name.
     * Specific need to deal with extensions need to be explicitly specified in the `extensions` option
     * @default
     * @member css
     *
     * @support
     * @description If you need to use the following processing engines,
     * please install stylus, postcss, sass, less
     * @member postcss
     * @member sass
     * @member postcss
     * @member stylus
     */
    use?: EngineSupport[];

    /**
     * @description File extensions to be processed
     *
     * @default ["css"]
     */
    extensions?: Lang[];

    /**
     *@default index.css
     */
    extract?: string | boolean;

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
     * @default false
     * @type { boolean }
     */
    postcss?: boolean;

    /**
     * @description This array indicates that this plugin needs to search
     *  and process stylesheets in those directories
     * * If you do not know what effect this option will have, please do not fill it
     * @default [process.cwd()，"node_modules/"]
     */
    includePaths?: string[];

    overrides?: Overrides;

    /**
     *
     * @member false
     * @description not generate sourceMap, which will greatly speed up compilation
     * @member inline
     * @description sourceMap will be written in the output file in the format base64
     * @member source-map
     * @description sourceMap outreach in .map file
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
     * { sass: /\.(sa|sc)ss$/ }
     *
     * @member sass
     *
     * @member postcss
     *
     * @member less
     *
     * @member stylus
     *
     * @member css
     */
    mapping?: ProcessMapping;
}

const defaultExt: Lang[] = ["css", "scss", "sass", "less", "styl"];

const defaultConfig: PluginOptions = {
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

export default function(opts: PluginOptions): PluginOptions {
    opts = mergeDeep(defaultConfig, opts);
    return opts;
}
