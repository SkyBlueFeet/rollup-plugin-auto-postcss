import { StyleNode, CompilerResult } from "./transform";
export declare type Loader = (node: StyleNode, opts?: object) => CompilerResult | Promise<CompilerResult>;
export interface Rule {
    id: string;
    test?: RegExp;
    include?: Array<RegExp | string>;
    exclude?: Array<RegExp | string>;
    loader?: Loader | Promise<Loader>;
    options?: Record<string, unknown>;
}
export default function (role: Rule, id: string): Loader;
