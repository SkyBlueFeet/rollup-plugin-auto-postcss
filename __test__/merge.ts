/**
 * Simple object check.
 * @param value
 * @returns {boolean}
 */
export function isObject(value: unknown): boolean {
    return value && typeof value === "object" && !Array.isArray(value);
}

export function isUndefinedOrNull(value: unknown): boolean {
    return value === undefined || value === null;
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: object, ...sources: object[]): object {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else if (!isUndefinedOrNull(source[key])) {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export function isArray(value: unknown): boolean {
    return typeof value === "object" && Array.isArray(value);
}
