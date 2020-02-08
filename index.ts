import getOptions, { PluginOptions } from "./core/plugin.options";
import { Plugin, TransformResult, PluginContext } from "rollup";
import transformCode from "./core/transform";
import pluginFilter from "./utils/plugin.filter";
import output from "./core/output";
import { formatCache } from "./utils/format";
// import sourceMap from "./core/source.map";

export default function(opts: PluginOptions = {}): Plugin {
    opts = getOptions(opts);
    const testExt = new RegExp(`.(${opts.extensions.join("|")})$`, "i");

    return {
        name: "rollup-plugin-style-process",
        transform: async function(
            this: PluginContext,
            code: string,
            id: string
        ): Promise<TransformResult> {
            if (!pluginFilter(testExt, opts.include, opts.exclude)(id)) return;

            const $result = await transformCode(id, code, opts);

            if (this.cache.has("results")) {
                const $cache = JSON.parse(
                    this.cache.get("results")
                ) as string[];
                $cache.push(id);
                this.cache.set("results", JSON.stringify($cache));
            } else {
                this.cache.set("results", JSON.stringify([id]));
            }

            this.cache.set(id, JSON.stringify($result));

            return {
                // If the code is not processed into CSS, the source code will be returned
                code: $result.compileToCss
                    ? `export default ${JSON.stringify($result.code)}`
                    : $result.code,

                map: $result.sourceMap
            };
        },
        buildEnd(): Promise<void> {
            const $result = formatCache(
                JSON.parse(this.cache.get("results")) as string[],
                this.cache
            );
            return output($result, "dist/index.css", opts.overrides?.extractFn);
        }
    };
}
