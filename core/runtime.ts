import { StyleNode, CompileContent } from "./transform";

export interface CompilerResult {
    status: "OK" | "ERROR" | "WARNING";
    readonly id: string;
    readonly fileName: string;
    readonly path: string;
    context: CompileContent;
    message?: string;
}

/**
 * 当前已被编译的所有StyleNode
 */
const allReturns: Record<string, StyleNode> = {};

/**
 * 当前正在被处理的StyleNode
 */
let curNode: StyleNode;

/**
 * 已被StyleNode被编译后的结果集合
 */
const allResults: CompilerResult[] = [];

/**
 * 当前StyleNode的编译结果
 */
let curResult: CompilerResult;

export const Compilation = {
    /**
     *将当前节点信息添加到全局状态
     * @param node
     * @returns 返回传入节点信息
     */
    set: function(node: StyleNode): StyleNode {
        curNode = node;
        allReturns[node.id] = node;
        return node;
    },

    /**
     * @returns 当前编译节点
     */
    getCurtNode: (): StyleNode => curNode,

    /**
     * @returns 目前已被编译和正在编译的所有节点
     */
    getAllNodes: (): Record<string, StyleNode> => allReturns
};

export const compilerResults = {
    /**
     *将当前节点的编译结果添加到全局状态
     * @param result
     * @returns 返回传入的编译结果
     */
    set: function(result: CompilerResult): CompilerResult {
        curResult = result;
        allResults.push(result);
        return result;
    },

    /**
     * @returns 当前编译结果
     */
    getCurResult: (): CompilerResult => curResult,

    /**
     * @returns 当前所有编译结果
     */
    getAllResults: (): CompilerResult[] => allResults
};
