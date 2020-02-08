import postcss from "postcss";
import { StyleNode } from "../core/transform";
import { CompilerResult } from "../core/runtime";
interface Result {
    file: string;
    options: postcss.ProcessOptions;
    plugins: postcss.AcceptedPlugin[];
}
declare type PostcssLoaderOption = {
    postcssrc?: boolean;
    options?: Result;
};
export default function (node: StyleNode, postcssOpts: PostcssLoaderOption): Promise<CompilerResult>;
export {};
