import { StyleNode, CompileContent, CompilerResult } from "../core/transform";
import { PluginOptions } from "../core/plugin.options";
import { PluginCache } from "rollup";
export declare function formatNode(id: string, context: CompileContent, options: PluginOptions): StyleNode;
export declare function nodeToResult(styleNode: StyleNode): CompilerResult;
export declare function formatContext(id: string, code: string): CompileContent;
export declare function formatSize(bytes: number): string;
export declare function formatCache(allIds: string[], Cache: PluginCache): Record<string, CompileContent>;
