import typescript from "rollup-plugin-typescript";

const conf = {
    input: "index.ts",
    output: [
        {
            file: "dist/index.esm.js",
            format: "esm"
        },
        {
            file: "dist/index.cjs.js",
            format: "cjs"
        }
    ],
    plugins: [
        typescript({
            tsconfig: "tsconfig.es6.json"
        })
    ]
};

conf.output.globals = {
    "@rollup/pluginutils": "@rollup/pluginutils",
    less: "less",
    lodash: "lodash",
    "node-sass": "node-sass",
    postcss: "postcss",
    "postcss-load-config": "postcss",
    path: "path",
    fs: "fs"
};

conf.external = Object.keys(conf.output.globals);

export default conf;
