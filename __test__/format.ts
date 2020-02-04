import _ from "lodash";

const loaders = [
    {
        id: "names",
        test: "sss"
    },
    {
        id: "names",
        test: "nnn"
    },
    {
        id: "names",
        test: "ujcmc"
    },
    {
        id: "names",
        test: "xunnc"
    }
];

console.log(_.uniqBy(loaders.reverse(), "id"));
