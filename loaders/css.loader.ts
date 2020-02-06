import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/runtime";
import { nodeToResult } from "../utils/format";

export default (node: StyleNode): CompilerResult => nodeToResult(node);
