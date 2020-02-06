import postcss, { ProcessOptions } from "postcss";
import _ from "lodash";

import postcssrc from "postcss-load-config";
import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/runtime";
import { nodeToResult } from "../utils/format";
// import { parsedMap } from "../core/source.map";
// import { fromObject } from "convert-source-map";
// import Concat from "concat-with-sourcemaps";

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

function handlePluginZip(objVal: unknown, srcVal: unknown): unknown {
    if (_.isArray(objVal)) return srcVal;
}

export default async function(
    node: StyleNode,
    postcssOpts: PostcssLoaderOption
): Promise<CompilerResult> {
    if (!node.context.compileToCss) {
        const $result = nodeToResult(node);
        $result.status = "ERROR";
        $result.message = `postcss can't compile ${$result.context.lang}`;
        return nodeToResult(node);
    }
    // console.log(node.id);
    // if (node.context.lang === "scss") console.log(node.context.sourceMap);

    const ctx: ConfigContext = {
        map: {
            inline: false,
            annotation: false,
            prev: node.context.sourceMap,
            sourcesContent: true
        }
    };

    async function postcssConf(): Promise<Result> {
        return await postcssrc(ctx);
    }

    postcssOpts = _.mergeWith(defaultOpts, postcssOpts, handlePluginZip);

    /**
     * Result of postcssrc is a Promise containing the filename plus the options
     *     and plugins that are ready to pass on to postcss.
     */
    let config: Result;

    if (postcssOpts.postcssrc) config = await postcssConf();
    else config = postcssOpts.options;

    config.options.from = node.id;
    config.options.to = node.id;

    /**
     *  * Provides the result of the PostCSS transformations.
     */
    let $result: postcss.Result;

    const finalResult = nodeToResult(node);

    try {
        $result = await postcss(config.plugins).process(
            node.context.code,
            config.options
        );
        finalResult.context.code = $result.css;
        finalResult.context.sourceMap = JSON.stringify($result.map.toJSON());
        finalResult.context.compileByPostcss = true;

        // if (node.context.lang === "scss") console.log($result.map.toJSON());
        if (node.context.lang === "less")
            finalResult.message = JSON.stringify($result.warnings());
        $result.warnings().forEach(warn => console.log(warn));
    } catch (err) {
        finalResult.status = "ERROR";
        finalResult.message = "\n" + err;
        console.log(err);
    }

    // (function(flag): void {
    //     if (node.context.lang === flag) {
    //         const concat = new Concat(true, node.id, "\n");
    //         // concat.add(null, "// (c) John Doe");
    //         concat.add(
    //             `file1.${flag}`,
    //             node.context.code,
    //             node.context.sourceMap.toString()
    //         );
    //         concat.add(`file2.${flag}`, $result.css, $result.map.toJSON());

    //         console.log(concat.sourceMap);
    //         console.log(finalResult.context.sourceMap);
    //     }
    // })();

    return finalResult;
}
