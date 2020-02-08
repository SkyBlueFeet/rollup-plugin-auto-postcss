import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/transform";
import { nodeToResult } from "../utils/format";

export default (node: StyleNode): CompilerResult => nodeToResult(node);
