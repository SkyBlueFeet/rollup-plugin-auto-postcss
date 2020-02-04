import getOptions, { PluginOptions } from "./lib/plugin.options";
import { Plugin, TransformResult, TransformHook, PluginContext } from "rollup";
import transformCode from "./lib/transform";
import pluginFilter from "./utils/plugin.filter";
import _ from "lodash";
import output from "./utils/output";

export default function(opts: PluginOptions = {}): Plugin {
    const options = getOptions(opts);
    const testExt = new RegExp(
        `.(${options.extensions
            .map(item => _.trimStart(item, "."))
            .join("|")})$`,
        "i"
    );

    const transform: TransformHook = async function(
        this: PluginContext,
        code: string,
        id: string
    ): Promise<TransformResult> {
        if (!pluginFilter(testExt, options.include, options.exclude)(id))
            return;
        code = "export default " + (await transformCode(code, id, options));
        return code;
    };
    return {
        name: "rollup-plugin-auto-postcss",
        transform
    };
}
