export function keys<T, K extends keyof T>(object: T): K[] {
    return Object.keys(object) as K[];
}

export function reverseMap<T, K extends keyof T>(object: T, key: K | K[]): T[K] | T[K][] {
    if (!Array.isArray(key)) {
        return object[key];
    }

    let result: T[K][] = [];
    for (let k of key) {
        result = result.concat(object[k]);
    }

    return result;
}
