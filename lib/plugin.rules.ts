import sassLoader from "../loaders/sass.loader";
import cssLoader from "../loaders/css.loader";
import { PluginOptions } from "./plugin.options";
import postcssLoader from "../loaders/postcss.loader";
import { Rule } from "./plugin.loader";

const defaultRules: Rule[] = [
    {
        id: "sass",
        test: /\.(sa|sc)ss$/,
        loader: sassLoader
    },
    {
        id: "css",
        test: /\.css$/,
        loader: cssLoader
    }
];

export default function(opts: PluginOptions): Rule[] {
    const finalRules: Rule[] = defaultRules;
    if (opts.postcss) {
        finalRules.push({
            id: "postcss",
            test: /\.(sa|sc|c)ss$/,
            loader: postcssLoader
        });
    }

    return finalRules;
}
