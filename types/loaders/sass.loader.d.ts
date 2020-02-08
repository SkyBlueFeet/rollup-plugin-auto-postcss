import { SyncOptions } from "node-sass";
import { StyleNode, CompilerResult } from "../core/transform";
export default function (node: StyleNode, sassOpts: SyncOptions): Promise<CompilerResult>;
