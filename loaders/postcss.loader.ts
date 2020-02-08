import postcss, { ProcessOptions } from "postcss";
import { mergeDeep } from "../utils/replace.lodash";

import postcssrc from "postcss-load-config";
import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/transform";
import { nodeToResult } from "../utils/format";
import { red } from "../core/plugin.message";
import path from "path";
import autoImport from "../core/auto.import";

/**
 * @description In the ConfigContext, these three options can be instances of the
 * appropriate class, or strings. If they are strings, postcss-load-config will
 * require() them and pass the instances along.
 */

interface ProcessOptionsPreload {
    parser?: string | ProcessOptions["parser"];
    stringifier?: string | ProcessOptions["stringifier"];
    syntax?: string | ProcessOptions["syntax"];
}

/**
 * @description Additional context options that postcss-load-config understands.
 */

interface Context {
    cwd?: string;
    env?: string;
}

/**
 * @description The remaining ProcessOptions, sans the three above.
 */
type RemainingProcessOptions = Pick<
    ProcessOptions,
    Exclude<keyof ProcessOptions, keyof ProcessOptionsPreload>
>;

type ConfigContext = Context & ProcessOptionsPreload & RemainingProcessOptions;

interface Result {
    file: string;
    options: postcss.ProcessOptions;
    plugins: postcss.AcceptedPlugin[];
}

type PostcssLoaderOption = {
    postcssrc?: boolean;
    options?: Result;
};

const defaultOpts: PostcssLoaderOption = {
    postcssrc: true
};

export default async function(
    node: StyleNode,
    postcssOpts: PostcssLoaderOption
): Promise<CompilerResult> {
    if (!node.context.compileToCss) {
        const $result = nodeToResult(node);
        $result.status = "ERROR";
        $result.message = `postcss can't compile ${$result.content.lang}`;
        return nodeToResult(node);
    }
    const installation = autoImport("postcss");

    const finalResult = nodeToResult(node);

    if (installation.installed) {
        const userPostcss: typeof postcss = installation.module;

        const ctx: ConfigContext = {
            map: {
                inline: false,
                annotation: false,
                // prev: JSON.parse(node.context.sourceMap as any),
                prev:
                    typeof node.context.sourceMap === "string"
                        ? node.context.sourceMap
                        : null,
                sourcesContent: true
            },
            from: node.id,
            to: node.id + ".map"
        };

        const postcssConf = async (): Promise<Result> => {
            return await postcssrc(ctx, path.dirname(node.id));
        };

        postcssOpts = mergeDeep(defaultOpts, postcssOpts);

        /**
         * Result of postcssrc is a Promise containing the filename plus the options
         *     and plugins that are ready to pass on to postcss.
         */
        let config: Result;

        if (postcssOpts.postcssrc) config = await postcssConf();
        else config = postcssOpts.options;

        /**
         *  * Provides the result of the PostCSS transformations.
         */
        let $result: postcss.Result;

        try {
            $result = await userPostcss(config.plugins).process(
                node.context.code,
                config.options
            );
            finalResult.content.code = $result.css;
            const $map = $result.map.toJSON();
            $map.sources = [node.id];
            finalResult.content.sourceMap = JSON.stringify($map);
            finalResult.content.compileByPostcss = true;

            if (node.context.lang === "less") {
                finalResult.message = JSON.stringify($result.warnings());
                $result.warnings().forEach(warn => console.log(warn));
            }
        } catch (err) {
            finalResult.status = "ERROR";
            finalResult.message = "\n" + err;
            console.log("\n" + red(err));
            console.log(red("\n当前错误节点:\n"), node);
        }
    }

    return finalResult;
}
