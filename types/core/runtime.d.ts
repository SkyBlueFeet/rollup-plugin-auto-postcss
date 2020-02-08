import { StyleNode, CompileContent } from "./transform";
export interface CompilerResult {
    status: "OK" | "ERROR" | "WARNING";
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    content: CompileContent;
    message?: string;
}
export declare const Compilation: {
    /**
     *将当前节点信息添加到全局状态
     * @param node
     * @returns 返回传入节点信息
     */
    set: (node: StyleNode) => StyleNode;
    /**
     * @returns 当前编译节点
     */
    getCurtNode: () => StyleNode;
    /**
     * @returns 目前已被编译和正在编译的所有节点
     */
    getAllNodes: () => Record<string, StyleNode>;
};
export declare const compilerResults: {
    /**
     *将当前节点的编译结果添加到全局状态
     * @param result
     * @returns 返回传入的编译结果
     */
    set: (result: CompilerResult) => CompilerResult;
    /**
     * @returns 当前编译结果
     */
    getCurResult: () => CompilerResult;
    /**
     * @returns 当前所有编译结果
     */
    getAllResults: () => Record<string, CompilerResult>;
};
