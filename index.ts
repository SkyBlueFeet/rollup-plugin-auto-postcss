import getOptions, { PluginOptions } from "./core/plugin.options";
import { Plugin, TransformResult, PluginContext } from "rollup";
import transformCode from "./core/transform";
import pluginFilter from "./utils/plugin.filter";
// import sourceMap from "./core/source.map";

export default function(opts: PluginOptions = {}): Plugin {
    const options = getOptions(opts);
    const testExt = new RegExp(`.(${options.extensions.join("|")})$`, "i");

    return {
        name: "rollup-plugin-style-process",
        transform: async function(
            this: PluginContext,
            code: string,
            id: string
        ): Promise<TransformResult> {
            if (!pluginFilter(testExt, options.include, options.exclude)(id))
                return;

            const $result = await transformCode(id, code, options);

            return {
                // If the code is not processed into CSS, the source code will be returned
                code: $result.compileToCss
                    ? `export default ${JSON.stringify($result.code)}`
                    : $result.code,

                map: $result.sourceMap
            };
        }
    };
}
