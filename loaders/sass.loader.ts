import nodeSass, { SyncOptions } from "node-sass";
import { TransformResult } from "rollup";
import { StyleNode } from "../lib/transform";
import _ from "lodash";

export default async function(
    this: StyleNode,
    sassOpts: SyncOptions
): Promise<TransformResult> {
    const defaultOptions: SyncOptions = {
        sourceMap: true,
        file: this.id,
        includePaths: this.options.includePaths
    };
    const style = nodeSass.renderSync(
        _.mergeWith(defaultOptions, sassOpts, (obj, src) => {
            if (_.isArray(obj)) return src;
        })
    );

    return style && style.css.toString("UTF-8");
}
