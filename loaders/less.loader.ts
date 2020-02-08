import { StyleNode, CompilerResult } from "../core/transform";
import { nodeToResult } from "../utils/format";
import less from "less";
import autoImport from "../core/auto.import";

export default async function(
    node: StyleNode,
    opts: Less.Options = {
        filename: node.id,
        sourceMap: {
            outputSourceFiles: true,
            sourceMapFileInline: false
        }
    }
): Promise<CompilerResult> {
    const $result = nodeToResult(node);
    const installation = autoImport("less");
    if (installation.installed) {
        const userLess = installation.module as typeof less;
        try {
            const lessResult = await userLess.render(node.context.code, opts);
            $result.content.code = lessResult.css; //parsedMap(lessResult.map)
            $result.content.sourceMap = JSON.parse(lessResult.map);
            $result.content.compileToCss = true;
        } catch (error) {
            $result.status = "ERROR";
            $result.message = error;
            console.log("\n" + error + "\n");
        }
    }

    return $result;
}
