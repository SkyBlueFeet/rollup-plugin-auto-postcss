import { PluginOptions } from "./plugin.options";
export interface CompilerResult {
    status: "OK" | "ERROR" | "WARNING";
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    content: CompileContent;
    message?: string;
}
export interface StyleNode {
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    options: PluginOptions;
    readonly cwd: string;
    context: CompileContent;
}
export interface CompileContent {
    /**
     * @description Current code
     */
    code: string;
    /**
     * @description Map mapping
     */
    sourceMap?: string;
    /**
     * @description Source code path
     */
    readonly source: string;
    /**
     * @description Source code language
     */
    readonly lang: string;
    /**
     *
     *  @description Is it compiled into CSS
     */
    compileToCss: boolean;
    /**
     * @description Whether it has been compiled by Postcss
     */
    compileByPostcss: boolean;
}
declare const _default: (id: string, code: string, options: PluginOptions) => Promise<CompileContent>;
/**
 *
 * @requires transform
 * @param id  File path or file name, for matching purposes only, no actual reading is performed，
 * Affects the SourceMap path
 * @param code Source code to be translated
 * @param options Translation options
 * @returns { Promise<CompileContent> }
 */
export default _default;
