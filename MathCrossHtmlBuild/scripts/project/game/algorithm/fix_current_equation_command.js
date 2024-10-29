import { Cell } from "./a_cell.js";
import SimpleEquationCalculator from "../simple_equation_calculator.js";
export default class FixCurrentEquationCommand {
    grid;
    equation;
    updatedCell;
    _hasExecute = false;
    set hasExecute(value) {
        this._hasExecute = value;
    }
    get hasExecute() {
        return this._hasExecute;
    }
    _hasUndo = false;
    set hasUndo(value) {
        this._hasUndo = value;
    }
    get hasUndo() {
        return this._hasUndo;
    }
    fixedCell;
    _oldValue;
    _oldOperator;
    _newValue;
    _newOperator;
    constructor(grid, equation, updatedCell) {
        this.grid = grid;
        this.equation = equation;
        this.updatedCell = updatedCell;
        this.equation = equation;
        this.updatedCell = updatedCell;
    }
    execute() {
        switch (true) {
            case this.hasExecute && this.hasUndo:
                return;
            case this.hasExecute:
                if (this.fixedCell !== null) {
                    this.equation.cells[1].value = this._newOperator;
                    this.fixedCell.value = this._newValue;
                }
                this.hasUndo = true;
                return;
        }
        if (!this.equation.isFilled) {
            throw new Error("Invalid operation");
        }
        this.processExecute();
        this.hasUndo = true;
        this.hasExecute = true;
    }
    processExecute() {
        this._oldOperator = this.equation.cells[1].value;
        const [isLast, otherCell] = this.process();
        if (isLast) {
            return;
        }
        this._oldValue = otherCell.value;
        otherCell.value = "";
        this.fixedCell = otherCell;
        this.grid.assignOperatorForEquationThatNeeded();
        otherCell.value = SimpleEquationCalculator.calculateEmptyForNormal(...this.equation.cells.map(c => c.value)).toString();
        this._newValue = otherCell.value;
    }
    process() {
        const otherCells = this.equation.numberCells.filter(c => c !== this.updatedCell)
            // .filter(c => c.equations.every(eq => eq === this.equation || !this._excludedEquations.has(eq)))
            .slice();
        let otherCell;
        if ((this.updatedCell === this.equation.cells[this.equation.cells.length - 1] || parseInt(this.updatedCell.value) === 0 ||
            (otherCells.length > 0 && otherCells[otherCells.length - 1] !== this.equation.numberCells[this.equation.numberCells.length - 1])) &&
            this.equation.cells[1].value === "x") {
            this.grid.assignOperator(this.equation);
        }
        if ((this.updatedCell === this.equation.cells[0] || (this.equation.numberCells[1]?.value === "0")) &&
            this.equation.cells[1].value === "/") {
            this.grid.assignOperator(this.equation);
            console.log("Try assign operator when division not satisfied: " + this.equation);
        }
        this._newOperator = this.equation.cells[1].value;
        if (otherCells.length === 0) {
            return [true, undefined];
        }
        otherCell = this.equation.cells[1].value === "x" ? otherCells[otherCells.length - 1] :
            this.equation.cells[1].value === "/" ? otherCells[0] :
                otherCells[Math.floor(Math.random() * otherCells.length)];
        return [false, otherCell];
    }
    undo() {
        if (!this.hasUndo) {
            return;
        }
        if (this.fixedCell === null) {
            this.hasUndo = false;
            return;
        }
        this.equation.cells[1].value = this._oldOperator;
        this.fixedCell.value = this._oldValue;
        this.hasUndo = false;
    }
}
