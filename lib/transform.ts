import { TransformResult } from "rollup";
import { PluginOptions } from "./plugin.options";
import pluginLoader, { Loader } from "./plugin.loader";
import { formatNode } from "../utils/format";
import runtime from "./runtime";
import output from "../utils/output";

export interface StyleNode {
    id: string;
    name: string;
    extension: string;
    path: string;
    code: string;
    options: PluginOptions;
    cwd: string;
    dest: string;
}

type callback<T> = (
    prev: any,
    current: T,
    index: number,
    collect: T[]
) => any | Promise<any>;

/**
 * 自实现reduce
 * @param this
 * @param callbackfn
 */
async function reduce<Rule>(
    collect: Array<Rule>,
    callbackfn: callback<Rule>
): Promise<string> {
    let result: string;
    for (let i = 1, len = collect.length; i < len; i++) {
        if (i === 1) result = collect[0] as any;
        result = callbackfn(result, collect[i], i, collect);
    }
    return result;
}

export default async function(
    code: string,
    id: string,
    opts: PluginOptions
): Promise<TransformResult> {
    let res: Promise<string>;

    if (opts.loaders) {
        res = reduce(opts.loaders.reverse(), async (prev, cur, i, collect) => {
            // console.log(cur);
            let curCode: string;
            i === 1 ? (curCode = code) : (curCode = await prev);
            const styleNode: StyleNode = formatNode(id, curCode, opts);
            if (i === 1 && pluginLoader(collect[0], id)) {
                runtime.push(styleNode);
                return await pluginLoader(collect[0], id).call(
                    styleNode,
                    collect[0].option
                );
            }
            if (pluginLoader(cur, id)) {
                runtime.push(styleNode);
                return await pluginLoader(cur, id).call(styleNode, cur.option);
            }
        });
    }
    output(
        opts.export + "/" + id.replace(/(.*\/)*([^.]+).*/gi, "$2") + ".css",
        await res
    );

    return JSON.stringify(await res);
}
