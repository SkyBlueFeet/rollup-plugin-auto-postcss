import { StyleNode } from "../lib/transform";
import { TransformResult } from "rollup";

export default async function(this: StyleNode): Promise<TransformResult> {
    return this.code;
}
