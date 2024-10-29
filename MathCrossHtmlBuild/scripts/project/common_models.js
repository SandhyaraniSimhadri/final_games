import Vector from "./Vector.js";
import { Direction, toVector } from "./game/direction.js";
export class Equation {
    coordinate;
    direction;
    count;
    constructor(coordinate, direction, count) {
        this.coordinate = coordinate;
        this.direction = direction;
        this.count = count;
    }
    get coordinates() {
        return [...Array(Math.max(this.count, 5)).keys()].map(i => this.coordinate.add(toVector(this.direction).mul(i)));
    }
    get numberCells() {
        return this.coordinates.indexes(0, 2, 4);
    }
    static create(eq) {
        return new Equation(new Vector(eq.coordinate.x, eq.coordinate.y), eq.direction, eq.count);
    }
}
export class PuzzleInfo {
    gridSize;
    holders;
    equations;
    constructor(gridSize, holders, equations) {
        this.gridSize = gridSize;
        this.holders = holders;
        this.equations = equations;
    }
    static create(info) {
        return new PuzzleInfo(Vector.createFromXY(info.gridSize), info.holders.map(h => {
            return { coordinate: new Vector(h.coordinate.x, h.coordinate.y), value: h.value, isFixed: h.isFixed };
        }), info.equations.map(Equation.create));
    }
    get cells() {
        return this.holders.filter(h => !h.isFixed).map(h => h.value);
    }
    trim() {
        const minAndMaxX = new Vector(Math.min(...this.holders.map(h => h.coordinate.x)), Math.max(...this.holders.map(h => h.coordinate.x)));
        const minAndMaxY = new Vector(Math.min(...this.holders.map(h => h.coordinate.y)), Math.max(...this.holders.map(h => h.coordinate.y)));
        return new PuzzleInfo(new Vector(minAndMaxX.y - minAndMaxX.x + 1, minAndMaxY.y - minAndMaxY.x + 1), this.holders.map(h => {
            return {
                coordinate: h.coordinate.sub(new Vector(minAndMaxX.x, minAndMaxY.x)),
                value: h.value,
                isFixed: h.isFixed
            };
        }), this.equations.map(e => new Equation(e.coordinate.sub(new Vector(minAndMaxX.x, minAndMaxY.x)), e.direction, e.count)));
    }
}
