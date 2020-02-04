console.log(
    /\.css$/.test(
        "/home/skyblue/Desktop/sky/site/packages/lib/components/list-item/test1.scss"
    )
);

console.log(
    /\.(sa|sc)ss$/.test(
        "/home/skyblue/Desktop/sky/site/packages/lib/components/list-item/test1.scss"
    )
);

// www.bilibili.com/read/cv521016/

const url = "/skyblue/hpme/ychjc/xyhbcn/cn/yellowbooks.pdf";

const fileName = url.match(/[^\\/]+\.[^\\/]+$/)[0]; //"yellowbooks.pdf"
const _fileName = fileName.replace(/\.(\w+)$/, ""); //"yellowbooks"
const fileEx = fileName.replace(/.+\./, ""); //"pdf"
const fileAdd = url.replace(fileName, ""); //"http://www.bilibili.com/"

console.log(url.replace(/(.*\/)*([^.]+).*/gi, "$1"));
console.log(url.replace(/(.*\/)*([^.]+).*/gi, "$2"));

console.log(fileName, _fileName, fileEx, fileAdd);
