/**
 * Simple object check.
 * @param value
 * @returns {boolean}
 */
export declare function isObject(value: unknown): boolean;
export declare function isUndefinedOrNull(value: unknown): boolean;
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export declare function mergeDeep(target: object, ...sources: object[]): object;
export declare function isArray(value: unknown): boolean;
export declare function values<T>(value: T): Array<T[keyof T]>;
