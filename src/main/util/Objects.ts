/**
 * Gets the specified key from given object recursively.
 * Returns `undefined` if not found (or the key is originally `undefined`).
 * @param src Source object.
 * @param keys Key fragment for indexing. If a single string is passed, it's split by dots.
 */
export function getObjectKey<T>(src: any, keys: string | string[]): T | undefined {
    if (typeof keys === 'string') {
        keys = keys.split('.');
    }
    let current = src;
    for (const key of keys) {
        if (!Object.hasOwn(current ?? {}, key)) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}
