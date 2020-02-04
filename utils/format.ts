import { StyleNode } from "../lib/transform";
import { PluginOptions } from "../lib/plugin.options";

export function formatNode(
    id: string,
    code: string,
    options: PluginOptions
): StyleNode {
    return {
        id,
        name: id.replace(/(.*\/)*([^.]+).*/gi, "$2"),
        cwd: process.cwd(),
        extension: "." + id.replace(/.+\./, "").toLowerCase(),
        code,
        options,
        dest: options.export,
        path: id.replace(/(.*\/)*([^.]+).*/gi, "$1")
    };
}
