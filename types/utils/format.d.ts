import { StyleNode, CompileContent } from "../core/transform";
import { PluginOptions } from "../core/plugin.options";
import { CompilerResult } from "../core/runtime";
export declare function formatNode(id: string, context: CompileContent, options: PluginOptions): StyleNode;
export declare function nodeToResult(styleNode: StyleNode): CompilerResult;
export declare function formatContext(id: string, code: string): CompileContent;
export declare function formatSize(bytes: number): string;
