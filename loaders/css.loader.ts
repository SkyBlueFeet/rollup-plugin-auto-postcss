import { StyleNode } from "../lib/transform";
import { CompilerResult } from "../lib/runtime";
import { nodeToResult } from "../utils/format";

export default function(node: StyleNode): CompilerResult {
    const finalResult = nodeToResult(node);
    finalResult.context = node.context;

    return finalResult;
}
