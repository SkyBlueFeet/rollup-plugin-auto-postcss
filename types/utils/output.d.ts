/// <reference types="node" />
import { CompilerResult } from "../core/runtime";
export declare type OutputFn = (result: ValueSummary) => Promise<boolean> | boolean;
export declare type Summary = Pick<Result, Exclude<keyof Result, "id">>;
export declare type Result = {
    id?: string;
    code: string;
    map: string;
};
export interface ValueSummary {
    resultSet?: Result[];
    summary?: Summary;
}
declare function extract(results: Record<string, CompilerResult>, extract: string, outputFn?: OutputFn): Promise<void>;
declare function extract(results: Record<string, CompilerResult>, extract: string): Promise<void>;
/**
 * @deprecated
 * 检测文件或文件夹是否存在
 * @param  {String} filePath 文件路径
 * @param  {String} data 数据
 */
export declare function output(filePath: string, data: string | Buffer): string;
export default extract;
