import { CompileContent } from "./transform";
export declare type ExtractFn = (result: ValueSummary) => Promise<boolean> | boolean;
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
declare function extract(results: Record<string, CompileContent>, extract: string, outputFn?: ExtractFn): Promise<void>;
declare function extract(results: Record<string, CompileContent>, extract: string): Promise<void>;
export default extract;
