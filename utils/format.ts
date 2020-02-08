import { StyleNode, CompileContent, CompilerResult } from "../core/transform";
import { PluginOptions } from "../core/plugin.options";
import { PluginCache } from "rollup";

export function formatNode(
    id: string,
    context: CompileContent,
    options: PluginOptions
): StyleNode {
    return {
        id,
        fileName: id.replace(/(.*\/)*([^.]+).*/gi, "$2"),
        cwd: process.cwd(),
        context,
        options,
        dest: options.export,
        path: id.replace(/(.*\/)*([^.]+).*/gi, "$1")
    };
}

export function nodeToResult(styleNode: StyleNode): CompilerResult {
    return {
        status: "OK",
        id: styleNode.id,
        fileName: styleNode.fileName,
        path: styleNode.path,
        content: styleNode.context,
        message: ""
    };
}

export function formatContext(id: string, code: string): CompileContent {
    const lang = id.replace(/.+\./, "").toLowerCase();
    return {
        source: id,
        code,
        sourceMap: null,
        lang,
        compileByPostcss: false,
        compileToCss: lang === "css"
    };
}

export function formatSize(bytes: number): string {
    return bytes < 10000
        ? bytes.toFixed(0) + " B"
        : bytes < 1024000
        ? (bytes / 1024).toPrecision(3) + " kB"
        : (bytes / 1024 / 1024).toPrecision(4) + " MB";
}

export function formatCache(
    allIds: string[],
    Cache: PluginCache
): Record<string, CompileContent> {
    const _result: Record<string, CompileContent> = {};
    allIds.forEach(i => {
        _result[i] = JSON.parse(Cache.get(i)) as CompileContent;
    });
    return _result;
}
