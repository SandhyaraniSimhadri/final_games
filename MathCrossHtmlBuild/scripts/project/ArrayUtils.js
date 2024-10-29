// noinspection JSUnusedGlobalSymbols
export function createTwoDimensionalArray(x, y, defaultValue) {
    return [...new Array(x).keys()].map(_ => Array(y).fill(defaultValue));
}
export function cloneTwoDimensionalArray(array) {
    return array.map(a => [...a]);
}
