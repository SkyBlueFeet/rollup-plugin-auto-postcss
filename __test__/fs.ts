import fs = require("fs");
import path = require("path");

function ensureParentDirsSync(dir: string): boolean {
    if (fs.existsSync(dir)) return true;

    try {
        fs.mkdirSync(dir);
    } catch (err) {
        if (err.code === "ENOENT") {
            ensureParentDirsSync(path.dirname(dir));
            ensureParentDirsSync(dir);
        }
    }
    return true;
}

ensureParentDirsSync(path.resolve(__dirname, "you"));
