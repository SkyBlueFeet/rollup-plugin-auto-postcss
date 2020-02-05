export function red(text: string): string {
    return `\x1b[1m\x1b[31m${text}\x1b[0m`;
}

export function green(text: string): string {
    return `\x1b[1m\x1b[32m${text}\x1b[0m`;
}
