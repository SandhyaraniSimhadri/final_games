import { lerp } from "./Utils.js";
export default class Vector {
    x;
    y;
    static zero = new Vector(0, 0);
    static one = new Vector(1, 1);
    static up = new Vector(0, 1);
    static down = new Vector(0, -1);
    static left = new Vector(-1, 0);
    static right = new Vector(1, 0);
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static lerp(vec1, vec2, n) {
        // noinspection JSSuspiciousNameCombination
        return new Vector(lerp(vec1.x, vec2.x, n), lerp(vec1.y, vec2.y, n));
    }
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    sub(item) {
        return new Vector(this.x - item.x, this.y - item.y);
    }
    add(item) {
        return new Vector(this.x + item.x, this.y + item.y);
    }
    mul(item) {
        return new Vector(this.x * item, this.y * item);
    }
    normalized() {
        return this.mul(1 / this.mag());
    }
    equals(vec) {
        return vec.x === this.x && vec.y === this.y;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    getRotateVector(angle) {
        return new Vector(Math.cos(angle) * this.x - Math.sin(angle) * this.y, Math.sin(angle) * this.x + Math.cos(angle) * this.y);
    }
    static createFromXY(vec) {
        return new Vector(vec.x, vec.y);
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
    getHashCode() {
        return this.x * 100000 + this.y;
    }
    withX(x) {
        return new Vector(x, this.y);
    }
    withY(y) {
        return new Vector(this.x, y);
    }
}
