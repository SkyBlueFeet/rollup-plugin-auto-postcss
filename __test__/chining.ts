interface TestFunc {
    item1?: string;
    item2?: string;
    item3?: string;
    item4?: string[];
}

function test(opt: TestFunc): string[] {
    return opt.item4?.concat(["123", "456"]);
}

const t1: TestFunc = {
    item1: "skyblue"
};

test(t1);
console.log(test(t1));
