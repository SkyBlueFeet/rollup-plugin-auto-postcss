import { fromObject } from "convert-source-map";
import { SourceMapInput, ExistingRawSourceMap } from "rollup";

export const toBase64 = (map: string): string =>
    fromObject(JSON.parse(map)).toBase64();

export const parsedMap = (map: string): ExistingRawSourceMap =>
    fromObject(JSON.parse(map)).sourcemap;
