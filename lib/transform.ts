import { PluginOptions } from "./plugin.options";
import pluginLoader, { Rule } from "./plugin.loader";
import { formatNode } from "../utils/format";
import { Compilation, compilerResults } from "./runtime";
import output from "../utils/output";

export interface StyleNode {
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    options: PluginOptions;
    readonly cwd: string;
    dest: string;
    context: CompileContext;
}

export interface CompileContext {
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
    prev: CompileContext,
    current: T,
    index: number,
    collect: T[]
) => CompileContext | Promise<CompileContext>;

/**
 * @description reduce chain compilation style
 *
 * @param { Rule[] } collect All rules collection
 *
 * @param { CompileContext } CompileContext Compilation context
 *
 * @param { callback<Rule> } compiler Compile process callback
 */
async function reduceCompileCode<Rule>(
    collect: Rule[],
    originCode: CompileContext,
    compiler: callback<Rule>
): Promise<CompileContext> {
    for (let i = 0, len = collect.length; i < len; i++) {
        originCode = await compiler(originCode, collect[i], i, collect);
    }
    return originCode;
}

export default async function(
    context: CompileContext,
    opts: PluginOptions
): Promise<CompileContext> {
    const res: Promise<CompileContext> = reduceCompileCode(
        opts.rules,
        context,
        async (prev: CompileContext | Promise<CompileContext>, cur: Rule) => {
            const id = context.source;

            let curText: CompileContext = await prev;

            if (pluginLoader(cur, id)) {
                const $nodes = Compilation.set(formatNode(id, curText, opts));

                curText = compilerResults.set(
                    await pluginLoader(cur, id)($nodes, cur.options)
                ).context;
            }

            return curText;
        }
    );

    return res;
}
