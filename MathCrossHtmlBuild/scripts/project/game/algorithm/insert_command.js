import { Cell, Direction, Equation, oppositeDirection } from "./a_cell.js";
import Grid, {} from "./a_grid.js";
export default class InsertCommand {
    grid;
    direction;
    coordinate;
    position;
    oldDirection = Direction.None;
    // noinspection JSMismatchedCollectionQueryUpdate
    _oldCells = [];
    set oldCells(value) {
        this._oldCells = value;
    }
    get oldCells() {
        return this._oldCells;
    }
    _hasUndo = false;
    set hasUndo(value) {
        this._hasUndo = value;
    }
    get hasUndo() {
        return this._hasUndo;
    }
    _hasExecute = false;
    set hasExecute(value) {
        this._hasExecute = value;
    }
    get hasExecute() {
        return this._hasExecute;
    }
    constructor(info, grid) {
        this.grid = grid;
        this.direction = info.direction;
        this.coordinate = info.coordinate;
        this.position = info.position;
    }
    execute() {
        const coordinates = Grid.getEquationCoordinates(this.direction, this.coordinate, this.position);
        this.oldCells = new Array(coordinates.length);
        coordinates.forEach((c, i) => {
            this.addOrUpdateCell(coordinates, i);
        });
        this.grid.addEquation(new Equation(coordinates.map(c => this.grid.getItem(c).item)));
        this.hasUndo = true;
        this.hasExecute = true;
    }
    addOrUpdateCell(coordinates, i) {
        const c = coordinates[i];
        const cellHolder = this.grid.getItem(c);
        if (!cellHolder.item) {
            const d = i % 2 === 1 ? Direction.None : oppositeDirection(this.direction);
            cellHolder.item = new Cell({ allowedDirection: d });
        }
        else {
            this.oldCells[i] = cellHolder.item.copy();
            cellHolder.item.allowedDirection = Direction.None;
        }
        const hashSet = new Set();
        this.grid.updateCell(cellHolder.coordinate, hashSet);
    }
    undo() {
        if (!this.hasUndo) {
            return;
        }
        const coordinates = Grid.getEquationCoordinates(this.direction, this.coordinate, this.position);
        const equationToRemove = this.grid.equations.filter(e => e.coordinates.every((c, i) => c.equals(coordinates[i])));
        this.grid.removeEquation(...equationToRemove);
        coordinates.forEach((c, i) => {
            this.undoCell(coordinates, i);
        });
        this.hasUndo = false;
    }
    undoCell(coordinates, i) {
        const c = coordinates[i];
        const cellHolder = this.grid.getItem(c);
        if (this.oldCells[i]) {
            cellHolder.item.allowedDirection = this.oldCells[i].allowedDirection;
            cellHolder.item.allowedPositions = [...this.oldCells[i].allowedPositions];
        }
        else {
            cellHolder.item = undefined;
        }
    }
}
