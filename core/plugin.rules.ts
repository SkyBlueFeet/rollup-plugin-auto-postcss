import sassLoader from "../loaders/sass.loader";
import cssLoader from "../loaders/css.loader";
import { PluginOptions } from "./plugin.options";
import postcssLoader from "../loaders/postcss.loader";
import { Rule } from "./plugin.loader";
import lessLoader from "../loaders/less.loader";
import stylusLoader from "../loaders/stylus.loader";

const defaultRules: Rule[] = [
    {
        id: "stylus",
        loader: stylusLoader
    },
    {
        id: "less",
        loader: lessLoader
    },
    {
        id: "sass",
        loader: sassLoader
    },
    {
        id: "css",
        loader: cssLoader
    }
];

export default function(opts: PluginOptions): Rule[] {
    const finalRules: Rule[] = defaultRules;
    if (opts.postcss) {
        finalRules.push({
            id: "postcss",
            loader: postcssLoader
        });
    }

    finalRules.map(i => {
        i.test = opts.mapping[i.id];
        return i;
    });

    return finalRules;
}
