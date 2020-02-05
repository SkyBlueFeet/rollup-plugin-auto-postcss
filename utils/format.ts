import { StyleNode, CompileContext } from "../lib/transform";
import { PluginOptions } from "../lib/plugin.options";
import { CompilerResult } from "../lib/runtime";

export function formatNode(
    id: string,
    context: CompileContext,
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
        context: styleNode.context,
        message: ""
    };
}

export function formatContext(id: string, code: string): CompileContext {
    const lang = id.replace(/.+\./, "").toLowerCase();
    return {
        source: id,
        code,
        sourceMap: "{}",
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
