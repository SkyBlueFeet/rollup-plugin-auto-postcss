import fs from "fs";
import { dirname } from "path";

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
export default function(filePath: string, data: string | Buffer): string {
    // const fileName = filePath.match(/[^\\/]+\.[^\\/]+$/)[0];
    const path = filePath.replace(/(.*\/)*([^.]+).*/gi, "$1");
    ensureParentDirsSync(path);
    fs.writeFileSync(filePath, data, { flag: "w+" });
    return filePath;
}
