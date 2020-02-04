const file = "/home/skybehe/fffff/fileName.edd";
const t = ["css", "scss", "js"];
console.log(new RegExp(`.(${t.join("|")})$`, "i").test(file));

console.log(file.replace(/.+\./, "").toLowerCase());
// https://blog.csdn.net/AAA3A12/article/details/48689647

// 获取文件名，不带后缀
const fileName = file.replace(/(.*\/)*([^.]+).*/gi, "$2");

console.log(fileName);

// 获取文件后缀
let fileExt = file.replace(/.+\./, "");

console.log(fileExt);

const fileExtension = file.substring(file.lastIndexOf(".") + 1);

console.log(fileExtension);

// 截取文件后缀
const reg = /\.\w+$/;
fileExt = file.replace(reg, "");
console.log(fileExt);

// 测试lodash merge函数
import _ from "lodash";

// function customizer(objValue, srcValue): any[] {}

function concatLoader(objValue: unknown, srcValue: unknown): unknown {
    if (_.isArray(objValue) && objValue.every(item => item.id)) {
        return objValue.concat(srcValue);
    }
    return;
}

const ts = {
    loaders: ["123", "456", "755"],
    obj: [
        {
            id: "sky",
            test: 123
        }
    ]
};

const s = {
    loaders: ["789", "7895"],
    obj: [
        {
            id: "blue",
            test: 456
        },
        {
            id: "sky",
            test: 789
        }
    ]
};
const obj = _.mergeWith(ts, s, concatLoader).obj;

console.log(obj);

console.log(
    _(obj)
        .reverse()
        .uniqBy("id")
        .value()
);

const nums = [1, 2, 3];
const sets = [10, 9, 8, 7, 6, 5, 4];

console.log(nums.concat(sets.reverse()));
