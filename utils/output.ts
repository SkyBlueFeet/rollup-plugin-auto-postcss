import fs from "fs";
import { dirname } from "path";

function red(text: string): string {
    return `\x1b[1m\x1b[31m${text}\x1b[0m`;
}

function green(text): string {
    return `\x1b[1m\x1b[32m${text}\x1b[0m`;
}

function getSize(bytes: number): string {
    return bytes < 10000
        ? bytes.toFixed(0) + " B"
        : bytes < 1024000
        ? (bytes / 1024).toPrecision(3) + " kB"
        : (bytes / 1024 / 1024).toPrecision(4) + " MB";
}

function ensureParentDirsSync(dir: string): boolean {
    if (fs.existsSync(dir)) return true;

    try {
        fs.mkdirSync(dir);
    } catch (err) {
        if (err.code === "ENOENT") {
            ensureParentDirsSync(dirname(dir));
            ensureParentDirsSync(dir);
        }
    }
    return true;
}

/**
 * 检测文件或文件夹是否存在
 * @param  {String} filePath 文件路径
 * @param  {String} data 数据
 */
export default function(filePath: string, data: string): string {
    // const fileName = filePath.match(/[^\\/]+\.[^\\/]+$/)[0];
    const path = filePath.replace(/(.*\/)*([^.]+).*/gi, "$1");
    ensureParentDirsSync(path);
    fs.writeFileSync(filePath, data, { flag: "w+" });
    return filePath;
}

// function output(pluginOpts) {
//     return;
// }
