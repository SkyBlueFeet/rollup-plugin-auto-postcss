async function asyncFunc(str: string): Promise<string> {
    return "export default " + str;
}

async function returnsAsyncFunc(str: string): Promise<string> {
    return asyncFunc(str);
}

returnsAsyncFunc("Hello World!").then(res => {
    console.log(res);
});
