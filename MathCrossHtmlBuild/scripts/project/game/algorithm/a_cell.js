import Vector from "../../Vector.js";
import { Direction as GameDirection } from "../direction.js";
import SimpleEquationCalculator from "../simple_equation_calculator.js";
/// <reference path = "../direction.js" />
export class Cell {
    allowedDirection = Direction.None;
    allowedPositions = [];
    holder = null;
    equations = [];
    value;
    get hasValue() {
        return this.value && this.value !== '';
    }
    get coordinate() {
        return this.holder?.coordinate;
    }
    copy() {
        const cell = new Cell();
        cell.allowedDirection = this.allowedDirection;
        cell.allowedPositions = this.allowedPositions.slice();
        cell.value = this.value;
        cell.holder = this.holder;
        return cell;
    }
    constructor(values = undefined) {
        if (values) {
            Object.assign(this, values);
        }
    }
}
export class Equation {
    _cells;
    constructor(cells) {
        this._cells = cells.slice();
        this.cells.forEach(c => c.equations.push(this));
    }
    get cells() {
        return this._cells;
    }
    get numberCells() {
        return this.cells.indexes(0, 2, 4);
    }
    get coordinate() {
        return this.cells[0].holder.coordinate.clone();
    }
    get coordinates() {
        return this.cells.map(c => c.holder.coordinate.clone());
    }
    get direction() {
        return this._cells[1].holder.coordinate.x === this._cells[0].holder.coordinate.x ? GameDirection.Down : GameDirection.Right;
    }
    get isFilled() {
        return this.cells.every(c => c.hasValue);
    }
    get isRight() {
        return this.isFilled
            && (this.operator !== '/' || this.numberCells[1].value !== '0')
            && SimpleEquationCalculator.calculate(...this.cells.take(3).map(c => c.value)) === parseInt(this.cells.last().value);
    }
    get operator() {
        return this.cells[1].value;
    }
}
export class CellHolder {
    coordinate = new Vector(0, 0);
    _item;
    get item() {
        return this._item;
    }
    set item(value) {
        if (this._item !== undefined) {
            this._item.holder = null;
        }
        this._item = value;
        if (this._item !== undefined) {
            this._item.holder = this;
        }
    }
}
export var Direction;
(function (Direction) {
    Direction[Direction["None"] = 0] = "None";
    Direction[Direction["Vertical"] = 1] = "Vertical";
    Direction[Direction["Horizontal"] = 2] = "Horizontal";
})(Direction || (Direction = {}));
export function oppositeDirection(direction) {
    switch (direction) {
        case Direction.Vertical:
            return Direction.Horizontal;
        case Direction.Horizontal:
            return Direction.Vertical;
        default:
            return Direction.None;
    }
}
