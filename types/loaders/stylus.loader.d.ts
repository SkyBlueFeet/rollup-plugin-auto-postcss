import { StyleNode, CompilerResult } from "../core/transform";
export interface Dictionary<T> {
    [key: string]: T;
}
export interface StylusRenderOptions {
    globals?: Dictionary<any>;
    functions?: Dictionary<any>;
    imports?: string[];
    paths?: string[];
    filename?: string;
    sourceMap?: {
        basePath?: string;
        sourceRoot?: string;
        comment?: boolean;
        inline?: boolean;
    };
}
export declare type StylusOptions = Pick<StylusRenderOptions, Exclude<keyof StylusRenderOptions, "filename">>;
export default function (node: StyleNode, opts?: StylusOptions): Promise<CompilerResult>;
