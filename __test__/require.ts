/* eslint-disable @typescript-eslint/no-var-requires */
import autoImport from "import-cwd";
const aus = require("import-cwd");

console.log(aus);
console.log(autoImport);

// async function test(autoImport: typeof import("import-cwd")): Promise<void> {
//     const imports = await autoImport;
//     console.log(imports);
// }

console.log((autoImport("less") as LessStatic).render(""));
