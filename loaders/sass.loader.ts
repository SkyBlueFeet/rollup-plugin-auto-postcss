import nodeSass, { SyncOptions } from "node-sass";
import { StyleNode } from "../core/transform";
import _ from "lodash";
import { CompilerResult } from "../core/runtime";
import { nodeToResult } from "../utils/format";

export default async function(
    node: StyleNode,
    sassOpts: SyncOptions
): Promise<CompilerResult> {
    const defaultOpts: SyncOptions = {
        sourceMap: node.id,
        sourceMapContents: true,
        outFile: node.id,
        sourceMapEmbed: false,
        omitSourceMapUrl: false,
        file: node.id,
        includePaths: node.options.includePaths,
        outputStyle: "expanded"
    };
    let $result: nodeSass.Result;

    /**
     * 编译结果
     */
    const fincalResult = nodeToResult(node);

    try {
        $result = nodeSass.renderSync(
            _.mergeWith(defaultOpts, sassOpts, (obj, src) => {
                if (_.isArray(obj)) return src;
            })
        );
        fincalResult.context.code = $result.css.toString("UTF-8");
        fincalResult.context.sourceMap = JSON.parse($result.map.toString());
        // console.log(JSON.parse($result.map.toString()));
        fincalResult.context.compileToCss = true;
    } catch (error) {
        console.log("\n" + error + "\n");
        fincalResult.status = "ERROR";
        fincalResult.message = error;
    }

    return fincalResult;
}
