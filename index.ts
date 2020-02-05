import getOptions, { PluginOptions } from "./lib/plugin.options";
import { Plugin, TransformResult, TransformHook, PluginContext } from "rollup";
import transformCode from "./lib/transform";
import pluginFilter from "./utils/plugin.filter";
import { formatContext } from "./utils/format";

export default function(opts: PluginOptions = {}): Plugin {
    const options = getOptions(opts);
    const testExt = new RegExp(`.(${options.extensions.join("|")})$`, "i");

    const transform: TransformHook = async function(
        this: PluginContext,
        code: string,
        id: string
    ): Promise<TransformResult> {
        if (!pluginFilter(testExt, options.include, options.exclude)(id))
            return;

        const $result = await transformCode(formatContext(id, code), options);
        return {
            code: `export default ${JSON.stringify($result.code)}`,
            map: $result.sourceMap
        };
    };
    return {
        name: "rollup-plugin-auto-postcss",
        transform
    };
}
