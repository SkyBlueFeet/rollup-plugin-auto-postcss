import { ExistingRawSourceMap } from "rollup";
import concatMap from "concat-with-sourcemaps";
import { Result } from "../utils/output";
export declare const toBase64: (map: string) => string;
export declare const parsedMap: (map: string) => ExistingRawSourceMap;
declare function concatSourceMap(fileName: string, results: Result[]): concatMap;
export default concatSourceMap;
