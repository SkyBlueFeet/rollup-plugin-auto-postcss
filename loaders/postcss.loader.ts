import postcss from "postcss";
import _ from "lodash";

import postcssrc, { Result, ConfigContext } from "postcss-load-config";
import { StyleNode } from "../lib/transform";
import { TransformResult } from "rollup";

const ctx: ConfigContext = { map: { inline: true, annotation: false } };

async function postcssConf(): Promise<Result> {
    // const { plugins, options } = await postcssrc(ctx);
    return await postcssrc(ctx);
}

type PostcssLoaderOption = {
    postcssrc?: boolean;
    options: Result;
};

const defaultOptions = {
    postcssrc: true
};

function handlePluginZip(objVal: unknown, srcVal: unknown): unknown {
    if (_.isArray(objVal)) return srcVal;
}

export default async function(
    this: StyleNode,
    postcssOpts: PostcssLoaderOption
): Promise<TransformResult> {
    postcssOpts = _.mergeWith(defaultOptions, postcssOpts, handlePluginZip);

    /**
     * Result of postcssrc is a Promise containing the filename plus the options
     *     and plugins that are ready to pass on to postcss.
     */
    let config: Result;

    if (postcssOpts.postcssrc) config = await postcssConf();
    else config = postcssOpts.options;

    config.options.from = this.id;

    /**
     *  * Provides the result of the PostCSS transformations.
     */
    let obj: postcss.Result;

    try {
        obj = await postcss(config.plugins).process(this.code, config.options);
    } catch (err) {
        console.log(err);
    }

    return obj && obj.css;
}
