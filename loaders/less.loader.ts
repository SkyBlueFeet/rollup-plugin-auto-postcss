import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/runtime";
import { nodeToResult } from "../utils/format";
import less from "less";

export default async function(
    node: StyleNode,
    opts: Less.Options = {
        filename: node.id,
        sourceMap: {
            outputSourceFiles: true,
            sourceMapFileInline: true
        }
    }
): Promise<CompilerResult> {
    const $result = nodeToResult(node);
    try {
        const lessResult = await less.render(node.context.code, opts);
        $result.context.code = lessResult.css; //parsedMap(lessResult.map)
        $result.context.sourceMap = lessResult.map;
        $result.context.compileToCss = true;
    } catch (error) {
        $result.status = "ERROR";
        console.log("\n" + error + "\n");
    }
    return $result;
}
