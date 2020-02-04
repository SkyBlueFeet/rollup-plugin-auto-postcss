import rollupPluginutils from "@rollup/pluginutils";
import { Pattern } from "../lib/plugin.options";

export default function(
    pattern: RegExp,
    include: Pattern,
    exclude: Pattern
): (id: string) => boolean {
    const testPath = rollupPluginutils.createFilter(include, exclude);
    return (id: string): boolean => pattern.test(id) && testPath(id);
}
