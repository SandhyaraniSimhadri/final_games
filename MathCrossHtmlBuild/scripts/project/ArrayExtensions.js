import { clamp, rand, randFloat } from "./Utils.js";
export {};
Array.prototype.min = function (selector) {
    return this.reduce((a, b) => selector(a) < selector(b) ? selector(a) : selector(b));
};
Array.prototype.max = function (selector) {
    return this.reduce((a, b) => selector(a) > selector(b) ? selector(a) : selector(b));
};
Array.prototype.minItem = function (selector) {
    return this.reduce((a, b) => selector(a) < selector(b) ? a : b);
};
Array.prototype.maxItem = function (selector) {
    return this.reduce((a, b) => selector(a) > selector(b) ? a : b);
};
Array.prototype.distinct = function () {
    return [...new Set(this)];
};
Array.prototype.distinctBy = function (selector) {
    const set = new Set();
    return this.filter(x => {
        const key = selector(x);
        if (set.has(key))
            return false;
        set.add(key);
        return true;
    });
};
Array.prototype.skipAllWhile = function (predicate) {
    const result = [];
    let i = 0;
    for (let i = 0; i < this.length; i++) {
        if (!predicate(this[i], i))
            result.push(this[i]);
    }
    return result;
};
Array.prototype.toMap = function (keySelector, valueSelector = null) {
    const map = new Map();
    this.forEach((item) => {
        const key = keySelector(item);
        const value = valueSelector ? valueSelector(item) : item;
        map.set(key, value);
    });
    return map;
};
Array.prototype.indexes = function (...list) {
    return list.map(x => this[x]);
};
Array.prototype.except = function (array) {
    return this.filter(x => !array.includes(x));
};
Array.prototype.groupBy = function (keySelector) {
    const map = new Map();
    this.forEach((item) => {
        const key = keySelector(item);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(item);
    });
    return map;
};
function toArray() {
    return Array.from(this);
}
Array.prototype.clear = function () {
    this.splice(0, this.length);
};
Array.prototype.cast = function () {
    return this.map(x => x);
};
Array.prototype.skip = function (count) {
    return this.slice(count);
};
Array.prototype.getRandoms = function (count = 1) {
    const targetList = [];
    const list = [...this];
    for (let i = 0; i < count; i++) {
        const index = rand(0, list.length);
        targetList.push(list[index]);
        list.splice(index, 1);
    }
    return targetList;
};
Array.prototype.getRandom = function () {
    return this.getRandoms(1)[0];
};
Array.prototype.orderBy = function (selector, desc = false) {
    return [...this].sort((a, b) => {
        a = selector(a);
        b = selector(b);
        if (a == b)
            return 0;
        return (desc ? a > b : a < b) ? -1 : 1;
    });
};
Array.prototype.sequenceEquals = function (array) {
    return JSON.stringify(this) === JSON.stringify(array);
};
Array.prototype.first = function () {
    return this[0];
};
Array.prototype.firstOrDefault = function () {
    return this.length > 0 ? this[0] : undefined;
};
Array.prototype.last = function () {
    return this.slice(-1)[0];
};
Array.prototype.remove = function (item) {
    const index = this.indexOf(item);
    if (index > -1) {
        return !!this.splice(index, 1);
    }
    return false;
};
Array.prototype.removeAll = function (predicate) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            this.splice(i--, 1);
        }
    }
};
Array.prototype.take = function (count) {
    return this.slice(0, count);
};
Array.prototype.count = function (predicate) {
    return this.filter(predicate).length;
};
Array.prototype.findBaseIndex = function (value, valueSelector) {
    let baseIndex = -1;
    for (let i = 0; i < this.length; i++) {
        if (valueSelector(this[i]) <= value)
            baseIndex = i;
    }
    return baseIndex;
};
Array.prototype.randomWithProbability = function (probabilitySelector) {
    return this.randomsWithProbability(1, probabilitySelector)[0];
};
Array.prototype.randomsWithProbability = function (count, probabilitySelector) {
    const items = [...this];
    const probabilities = this.map(probabilitySelector);
    const results = [];
    for (let i = 0; i < count; i++) {
        const item = selectRandom(probabilities, items);
        const index = items.indexOf(item);
        items.splice(index, 1);
        probabilities.splice(index, 1);
        results.push(item);
    }
    return results;
};
function selectRandom(probabilities, items) {
    const total = probabilities.reduce((a, b) => a + b);
    let randValue = randFloat(0, total);
    let elapsed = 0;
    let item = items[0];
    for (let i = 0; i < items.length; i++) {
        const p = probabilities[i];
        elapsed += p;
        if (elapsed >= randValue) {
            item = items[i];
            break;
        }
    }
    return item;
}
