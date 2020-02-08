import fs from "fs";
import { dirname } from "path";
import _ from "lodash";
import { red, green } from "../core/plugin.message";
import concatSourceMap from "../core/source.map";
import path from "path";
import { CompileContent } from "../core/transform";
import { formatSize } from "./format";

export type OutputFn = (result: ValueSummary) => Promise<boolean> | boolean;

export type Summary = Pick<Result, Exclude<keyof Result, "id">>;

export type Result = {
    id?: string;
    code: string;
    map: string;
};

export interface ValueSummary {
    resultSet?: Result[];
    summary?: Summary;
}
// type CallbackFn = (prev: Summary, cur: Val, index: number) => Summary;

// function reduce(results: Result[], value: Summary, fn: CallbackFn) {
//     const len = results.length;
//     const i = 1;
//     while (i < len) {
//         value = fn(value);
//     }
// }

function ensureParentDirs(dir: string): Promise<boolean> {
    return new Promise((res, rej) => {
        fs.exists(dir, exist => {
            if (exist) return res(true);
            else {
                fs.mkdir(dir, err => {
                    if (!err) {
                        res(true);
                    } else if (
                        err &&
                        (err.code === "ENOENT" || err.code === "EEXIST")
                    ) {
                        ensureParentDirs(dirname(dir));
                        ensureParentDirs(dir);
                        res(true);
                    } else if (err) {
                        rej(err);
                    }
                });
            }
        });
    });
}

function writeFile(path: string, data: string | Buffer): Promise<string> {
    return new Promise((res, rej) => {
        fs.writeFile(path, data, err => {
            if (err) rej(err);
            else res(path);
        });
    });
}

async function extract(
    results: Record<string, CompileContent>,
    extract: string,
    outputFn?: OutputFn
): Promise<void>;
async function extract(
    results: Record<string, CompileContent>,
    extract: string
): Promise<void>;
async function extract(
    results: Record<string, CompileContent>,
    extract: string,
    overArgs?: OutputFn
): Promise<void> {
    const _resultSet = _(results)
        .values()
        .map(item => {
            return {
                id: item.source,
                code: item.code,
                map: item.sourceMap
            };
        })
        .value();
    const mapUrl = path.resolve(extract + ".map");
    const cssUrl = path.resolve(extract);

    const newSourceMpa = concatSourceMap(mapUrl, _resultSet);
    const valveSummary: ValueSummary = {
        resultSet: _resultSet,
        summary: {
            code: newSourceMpa.content.toString(),
            map: newSourceMpa.sourceMap.toString()
        }
    };

    if (typeof overArgs === "function") {
        await overArgs(valveSummary);
    } else {
        try {
            await ensureParentDirs(cssUrl.replace(/(.*\/)*([^.]+).*/gi, "$1"));
            await writeFile(cssUrl, valveSummary.summary.code);
            await writeFile(mapUrl, valveSummary.summary.map);
            console.log(
                "\n",
                green(extract),
                green(formatSize(valveSummary.summary.code.length))
            );
        } catch (error) {
            console.log(red("\n" + error));
            console.log(red("\nCannot write..."));
        }
    }
    return;
}

/**
 * @deprecated
 * 检测文件或文件夹是否存在
 * @param  {String} filePath 文件路径
 * @param  {String} data 数据
 */
export function output(filePath: string, data: string | Buffer): string {
    // const fileName = filePath.match(/[^\\/]+\.[^\\/]+$/)[0];
    const path = filePath.replace(/(.*\/)*([^.]+).*/gi, "$1");
    ensureParentDirs(path);
    fs.writeFileSync(filePath, data, { flag: "w+" });
    return filePath;
}

export default extract;
