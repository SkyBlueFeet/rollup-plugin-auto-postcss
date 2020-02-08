import { StyleNode, CompilerResult } from "../core/transform";
import { nodeToResult } from "../utils/format";
import stylus from "stylus";
import autoImport from "../core/auto.import";

export interface Dictionary<T> {
    [key: string]: T;
}

export interface StylusRenderOptions {
    globals?: Dictionary<any>;
    functions?: Dictionary<any>;
    imports?: string[];
    paths?: string[];
    filename?: string;
    sourceMap?: {
        basePath?: string;
        sourceRoot?: string;
        comment?: boolean;
        inline?: boolean;
    };
}

export type StylusOptions = Pick<
    StylusRenderOptions,
    Exclude<keyof StylusRenderOptions, "filename">
>;

export default async function(
    node: StyleNode,
    opts: StylusOptions = {}
): Promise<CompilerResult> {
    const finalResult = nodeToResult(node);

    const installation = autoImport("stylus");

    if (installation.installed) {
        const userStylus = installation.module as typeof stylus;
        const defaultOpts: StylusOptions = {
            sourceMap: {
                sourceRoot: node.id,
                basePath: "."
            }
        };

        opts = Object.assign({}, defaultOpts, opts);

        try {
            const renderOpts = { ...opts };
            delete renderOpts.sourceMap;
            const style = userStylus(node.context.code, renderOpts)
                .set("filename", node.id)
                .set("sourcemap", opts.sourceMap);
            style.render(function(err, css) {
                if (err) throw err;
                finalResult.content.code = css;
                finalResult.content.sourceMap = (style as any).sourcemap;
                finalResult.content.compileToCss = true;
            });
        } catch (error) {
            finalResult.status = "ERROR";
            console.log(error);
        }
    }

    return finalResult;
}
