import _ from "lodash";

const def = [
    {
        id: "sass",
        flag: "1"
    },
    {
        id: "css",
        flag: "2"
    },
    {
        id: "postcss",
        flag: "3"
    }
];

const input = [
    {
        id: "postcss",
        flag: "4"
    },
    {
        id: "css",
        flag: "5"
    },
    {
        id: "sass",
        flag: "6"
    }
];

const rs = _.uniqBy(input.concat(def), "id");

rs.forEach(i => console.log(i));

const fd = {
    postcss: "123",
    css: "852",
    yncnc: "752"
};

const hf = {
    css: "123",
    yncnc: undefined
};

console.log(_.merge(fd, hf));
