import postcss from "postcss";
import _ from "lodash";

import postcssrc, { Result, ConfigContext } from "postcss-load-config";
import { StyleNode } from "../lib/transform";
import { CompilerResult } from "../lib/runtime";
import { nodeToResult } from "../utils/format";

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

    const ctx: ConfigContext = {
        map: { inline: false, annotation: true, prev: node.context.sourceMap }
    };

    async function postcssConf(): Promise<Result> {
        // const { plugins, options } = await postcssrc(ctx);
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
        // if (node.context.sourceMap) console.log(node.context.sourceMap);
        finalResult.message = JSON.stringify($result.warnings());
        $result.warnings().forEach(warn => console.log(warn));
    } catch (err) {
        finalResult.status = "ERROR";
        finalResult.message = "\n" + err;
        console.log(err);
    }

    return finalResult;
}
