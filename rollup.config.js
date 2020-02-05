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

conf.external = [
    "@rollup/pluginutils",
    "less",
    "lodash",
    "node-sass",
    "postcss",
    "postcss-load-config",
    "path",
    "fs",
    "convert-source-map"
];

const globals = {};

for (const i of conf.external) {
    globals[i] = i;
}

conf.output.globals = globals;

conf.external = Object.keys(conf.output.globals);

export default conf;
