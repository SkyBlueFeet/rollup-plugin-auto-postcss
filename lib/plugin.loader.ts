import { StyleNode } from "./transform";
import pluginFilter from "../utils/plugin.filter";
import { CompilerResult } from "./runtime";

export type Loader = (
    node: StyleNode,
    opts: object
) => CompilerResult | Promise<CompilerResult>;

export interface Rule {
    id: string;
    test?: RegExp;
    include?: Array<RegExp | string>;
    exclude?: Array<RegExp | string>;
    loader?: Loader | Promise<Loader>;
    options?: Record<string, unknown>;
}

export default function(role: Rule, id: string): Loader {
    const ruleFilter = pluginFilter(role.test, role.include, role.exclude);

    let transform: Loader;

    if (!ruleFilter(id)) return;

    if (role.loader && typeof role.loader !== "function") return;

    if (role.loader && typeof role.loader === "function") {
        transform = role.loader;
    }

    return transform;
}
