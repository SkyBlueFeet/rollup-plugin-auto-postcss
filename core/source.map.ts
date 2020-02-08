import concatMap from "concat-with-sourcemaps";
import { Result } from "./output";

export default function(fileName: string, results: Result[]): concatMap {
    const newSourceMpa = new concatMap(true, fileName, "");
    results.forEach(item => {
        newSourceMpa.add(item.id, item.code, item.map);
    });
    return newSourceMpa;
}
