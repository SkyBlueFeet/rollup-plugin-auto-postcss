import { SyncOptions } from "node-sass";
import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/runtime";
export default function (node: StyleNode, sassOpts: SyncOptions): Promise<CompilerResult>;
