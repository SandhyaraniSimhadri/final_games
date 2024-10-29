export function inverseLerp(x, y, val) {
    if (x === y)
        return 0;
    return (val - x) / (y - x);
}
export function lerp(x, y, val) {
    const v = val > 1 ? 1 : val < 0 ? 0 : val;
    return x + (y - x) * v;
}
export function lerpArray(first, second, n) {
    if (first.length !== second.length)
        throw Error();
    return first.map((item, i) => lerp(item, second[i], n));
}
export function clamp(val, min, max) {
    return val < min ? min : (val > max ? max : val);
}
export function max(val1, val2) {
    return val1 > val2 ? val1 : val2;
}
export function rand(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}
export function randFloat(start, end) {
    return Math.random() * (end - start) + start;
}
export function getRandomFromList(list, count = 1) {
    const targetList = [];
    for (let i = 0; i < count; i++) {
        const index = rand(0, list.length);
        targetList.push(list[index]);
        list.splice(index, 1);
    }
    return targetList;
}
export function aggregateFirst(array, aggregate, until, initial) {
    let value = initial;
    let index = 0;
    for (const item of array) {
        value = aggregate(value, item);
        if (until(value)) {
            return index;
        }
        index++;
    }
    return -1;
}
