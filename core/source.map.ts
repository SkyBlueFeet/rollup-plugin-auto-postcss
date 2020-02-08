import { fromObject } from "convert-source-map";
import { ExistingRawSourceMap } from "rollup";
import concatMap from "concat-with-sourcemaps";
import { Result } from "../utils/output";

export const toBase64 = (map: string): string =>
    fromObject(JSON.parse(map)).toBase64();

export const parsedMap = (map: string): ExistingRawSourceMap =>
    fromObject(JSON.parse(map)).sourcemap;

function concatSourceMap(fileName: string, results: Result[]): concatMap {
    const newSourceMpa = new concatMap(true, fileName, "");
    results.forEach(item => {
        newSourceMpa.add(item.id, item.code, item.map);
    });
    return newSourceMpa;
}

export default concatSourceMap;
