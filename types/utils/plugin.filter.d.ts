import { Pattern } from "../core/plugin.options";
export default function (pattern: RegExp, include: Pattern, exclude: Pattern): (id: string) => boolean;
