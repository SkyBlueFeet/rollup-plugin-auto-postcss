import fs from "fs";
import { dirname } from "path";
import { values } from "../utils/replace.lodash";
import { red, green } from "./plugin.message";
import concatSourceMap from "./source.map";
import path from "path";
import { CompileContent } from "./transform";
import { formatSize } from "../utils/format";

export type ExtractFn = (result: ValueSummary) => Promise<boolean> | boolean;

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

async function output(cssUrl: string, summary: ValueSummary): Promise<void> {
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

    try {
        await ensureParentDirs(cssUrl.replace(/(.*\/)*([^.]+).*/gi, "$1"));
        await writeFile(cssUrl, summary.summary.code);
        await writeFile(cssUrl + ".map", summary.summary.map);
        console.log(
            "\n",
            green(cssUrl),
            green(formatSize(summary.summary.code.length))
        );
    } catch (error) {
        console.log(red("\n" + error));
        console.log(red("\nCannot write..."));
    }
}

async function extract(
    results: Record<string, CompileContent>,
    extract: string,
    outputFn?: ExtractFn
): Promise<void>;
async function extract(
    results: Record<string, CompileContent>,
    extract: string
): Promise<void>;
async function extract(
    results: Record<string, CompileContent>,
    extract: string,
    overArgs?: ExtractFn
): Promise<void> {
    const _resultSet = values(results).map(item => {
        return {
            id: item.source,
            code: item.code,
            map: item.sourceMap
        };
    });
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
        output(cssUrl, valveSummary);
    }
    return;
}

export default extract;
