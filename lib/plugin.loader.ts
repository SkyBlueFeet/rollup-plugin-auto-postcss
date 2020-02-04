import { StyleNode } from "./transform";
import { TransformResult } from "rollup";
import pluginFilter from "../utils/plugin.filter";

export type Loader = (
    this: StyleNode,
    opts: object
) => TransformResult | Promise<TransformResult>;

export interface Rule {
    id: string;
    test: RegExp;
    include?: Array<RegExp | string>;
    exclude?: Array<RegExp | string>;
    loader?: Loader | Promise<Loader>;
    option?: Record<string, unknown>;
}

interface LoaderContext {
    id: string;
    cwd: string;
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
