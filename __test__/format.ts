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

import concat from "concat-with-sourcemaps";

const map1 = {
    version: 3,
    sources: ["<input css 5>"],
    names: [],
    mappings:
        "AAAA;EACE,SAAS;AACX;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,cAAc;EACd,qBAAqB;EACrB,gCAAgC;AAClC;;AAEA;EACE,0BAA0B;AAC5B;;AAEA,6DAA6D;AAlB7D;EACE,SAAS;AACX;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,cAAc;EACd,qBAAqB;EACrB,gCAAgC;AAClC;;AAEA;EACE,0BAA0B;AAC5B;;AAEA,6DAA6D",
    file:
        "/home/skyblue/Desktop/sky/site/packages/lib/components/list-item/test3.styl",
    sourcesContent: [
        "ul {\n  margin: 0;\n}\n\nli {\n  list-style: none;\n}\n\nli a {\n  display: block;\n  text-decoration: none;\n  padding: 0.333333rem 0.666667rem;\n}\n\nli a:hover {\n  text-decoration: underline;\n}\n\n/*# sourceMappingURL=lib/components/list-item/test3.css.map */"
    ]
};
const map2 = {
    version: 3,
    sources: ["<input css 5>"],
    names: [],
    mappings:
        "AAAA;EACE,SAAS;AACX;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,cAAc;EACd,qBAAqB;EACrB,gCAAgC;AAClC;;AAEA;EACE,0BAA0B;AAC5B;;AAEA,6DAA6D",
    file: "test3.styl",
    sourcesContent: [
        "ul {\n  margin: 0;\n}\n\nli {\n  list-style: none;\n}\n\nli a {\n  display: block;\n  text-decoration: none;\n  padding: 0.333333rem 0.666667rem;\n}\n\nli a:hover {\n  text-decoration: underline;\n}\n\n/*# sourceMappingURL=lib/components/list-item/test3.css.map */"
    ]
};

const test = new concat(true, "index.css.map", "");

test.add(
    "/skyblue/file1.css",
    "ul {\n  margin: 0;\n}\n\nli {\n  list-style: none;\n}\n\nli a {\n  display: block;\n  text-decoration: none;\n  padding: 0.333333rem 0.666667rem;\n}\n\nli a:hover {\n  text-decoration: underline;\n}\n\n",
    JSON.stringify(map1)
);

test.add(
    "/skyblue/file2.css",
    "ul {\n  margin: 0;\n}\n\nli {\n  list-style: none;\n}\n\nli a {\n  display: block;\n  text-decoration: none;\n  padding: 0.333333rem 0.666667rem;\n}\n\nli a:hover {\n  text-decoration: underline;\n}\n\n",
    JSON.stringify(map2)
);

console.log(test.content.toString());
