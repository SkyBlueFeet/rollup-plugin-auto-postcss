import { StyleNode } from "./transform";

type CompileLog = StyleNode;

const logs: CompileLog[] = [];

export default {
    push: (log: CompileLog): number => logs.push(log),
    get: (): CompileLog[] => logs
};
