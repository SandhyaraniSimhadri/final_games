import { Cell, CellHolder, Direction, Equation } from "./a_cell.js";
import { Equation as GlobalEquation } from "../../common_models.js";
import Vector from "../../Vector.js";
import InsertCommand from "./insert_command.js";
export default class Grid {
    static ALL_ALLOWED_POSITIONS = [0, 2, 4];
    tiles = [];
    _equations = [];
    get equations() {
        return this._equations;
    }
    set equations(value) {
        this._equations.splice(0, this._equations.length, ...value);
    }
    _size;
    set size(value) {
        this._size = value;
    }
    get size() {
        return this._size;
    }
    getItem(vec) {
        return this.getItemXY(vec.x, vec.y);
    }
    getItemXY(x, y) {
        return this.tiles[y * this.size.x + x];
    }
    get currentCells() {
        return this.tiles.filter(t => t.item).map(t => t.item);
    }
    get isClosed() {
        return this.currentCells.every(c => c.allowedDirection === Direction.None);
    }
    resizeGrid(size) {
        this.reset();
        this.tiles.clear();
        this.size = size.clone();
        for (let y = 0; y < size.y; y++) {
            for (let x = 0; x < size.x; x++) {
                this.tiles.push(new CellHolder().with(c => c.coordinate = new Vector(x, y)));
            }
        }
    }
    reset() {
        this.tiles.forEach(t => t.item = undefined);
        this.equations.clear();
    }
    static getEquationCoordinates(direction, coordinate, position) {
        const vec = direction === Direction.Horizontal ? Vector.right : Vector.up;
        const start = coordinate.sub(vec.mul(position));
        return Array.from({ length: 5 }, (_, i) => start.add(vec.mul(i)));
    }
    isValidCoordinate(...coordinates) {
        return coordinates.every(c => c.x >= 0 && c.x < this.size.x && c.y >= 0 && c.y < this.size.y);
    }
    updateCell(coordinate, visited = undefined) {
        visited = visited || new Set();
        if (visited.has(coordinate.toString()))
            return;
        visited.add(coordinate.toString());
        const item = this.getItem(coordinate).item;
        item.allowedPositions.clear();
        item.allowedPositions.push(...(item.allowedDirection === Direction.None ? [] : Grid.ALL_ALLOWED_POSITIONS.filter(j => {
            return this.isValidCoordinate(...Grid.getEquationCoordinates(item.allowedDirection, coordinate, j)) &&
                Grid.getEquationCoordinates(item.allowedDirection, coordinate, j).every(c => !this.getItem(c).item || this.getItem(c).item?.allowedDirection === item.allowedDirection);
        })));
        if (item.allowedPositions.length === 0) {
            item.allowedDirection = Direction.None;
        }
        this.updateRelatedCells(coordinate, visited);
    }
    *generate(count) {
        this.reset();
        const direction = Math.random() > 0.5 ? Direction.Horizontal : Direction.Vertical;
        let cellHolder;
        let positions;
        do {
            cellHolder = this.tiles.getRandom();
            positions = Grid.ALL_ALLOWED_POSITIONS.filter(p => this.isValidCoordinate(...Grid.getEquationCoordinates(direction, cellHolder.coordinate, p)));
        } while (positions.length === 0);
        yield new InsertCommand(new EquationInfo(direction, cellHolder.coordinate, positions.first()), this);
        for (let i = 1; i < count; i++) {
            const cells = this.currentCells.filter(c => c.allowedDirection !== Direction.None && c.allowedPositions.length > 0);
            if (cells.length === 0)
                break;
            const cell = cells.getRandom();
            yield new InsertCommand(new EquationInfo(cell.allowedDirection, cell.coordinate, cell.allowedPositions.getRandom()), this);
        }
    }
    setEquations(...equations) {
        console.log(equations);
        equations.flatMap(e => {
            console.log(e, e.coordinates);
            return e.coordinates;
        }).distinct().forEach(c => this.getItem(c).item = new Cell());
        this.equations = equations.map(e => {
            return new Equation(e.coordinates.map(c => this.getItem(c).item));
        });
    }
    addEquation(equation) {
        this.equations.push(equation);
    }
    removeEquation(...equation) {
        equation.forEach(e => this.equations.remove(e));
    }
    updateRelatedCells(updatedCell, visited = new Set()) {
        const directions = [Direction.Horizontal, Direction.Vertical];
        directions.map(d => Grid.ALL_ALLOWED_POSITIONS
            .map(p => Grid.getEquationCoordinates(d, updatedCell, p))
            .filter(cs => this.isValidCoordinate(...cs))).flatMap(cs => cs).flatMap(cs => cs).filter(c => this.getItem(c).item)
            .forEach(c => this.updateCell(c, visited));
    }
}
export class EquationInfo {
    direction;
    coordinate;
    position;
    constructor(direction, coordinate, position) {
        this.direction = direction;
        this.coordinate = coordinate;
        this.position = position;
    }
}
