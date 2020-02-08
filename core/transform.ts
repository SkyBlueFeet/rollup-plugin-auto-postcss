import { PluginOptions } from "./plugin.options";
import pluginLoader, { Rule } from "./plugin.loader";
import { formatNode, formatContext } from "../utils/format";
import pluginRules from "./plugin.rules";

// import output from "../utils/output";

export interface CompilerResult {
    status: "OK" | "ERROR" | "WARNING";
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    content: CompileContent;
    message?: string;
}

export interface StyleNode {
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    options: PluginOptions;
    readonly cwd: string;
    context: CompileContent;
}

export interface CompileContent {
    /**
     * @description Current code
     */
    code: string;

    /**
     * @description Map mapping
     */
    sourceMap?: string;

    /**
     * @description Source code path
     */
    readonly source: string;

    /**
     * @description Source code language
     */
    readonly lang: string;

    /**
     *
     *  @description Is it compiled into CSS
     */
    compileToCss: boolean;

    /**
     * @description Whether it has been compiled by Postcss
     */
    compileByPostcss: boolean;
}

type callback<T> = (
    prev: CompileContent,
    current: T,
    index: number,
    collect: T[]
) => CompileContent | Promise<CompileContent>;

/**
 * @description reduce chain compilation style
 *
 * @param { Rule[] } collect All rules collection
 *
 * @param { CompileContent } CompileContext Compilation context
 *
 * @param { callback<Rule> } compiler Compile process callback
 */
async function reduceCompileCode<Rule>(
    collect: Rule[],
    originCode: CompileContent,
    compiler: callback<Rule>
): Promise<CompileContent> {
    for (let i = 0, len = collect.length; i < len; i++) {
        originCode = await compiler(originCode, collect[i], i, collect);
    }
    return originCode;
}

/**
 *
 * @param { CompileContent } context
 *
 * @param opts
 */
async function transform(
    context: CompileContent,
    opts: PluginOptions
): Promise<CompileContent> {
    const res: Promise<CompileContent> = reduceCompileCode(
        pluginRules(opts),
        context,
        async (prev: CompileContent | Promise<CompileContent>, cur: Rule) => {
            const id = context.source;

            let curText: CompileContent = await prev;
            if (pluginLoader(cur, id)) {
                const $nodes = formatNode(id, curText, opts);

                curText = (await pluginLoader(cur, id)($nodes, cur.options))
                    .content;
            }

            return curText;
        }
    );

    return res;
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
export default (
    id: string,
    code: string,
    options: PluginOptions
): Promise<CompileContent> => transform(formatContext(id, code), options);
