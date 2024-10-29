import { Cell, Equation } from "./a_cell.js";
import GridEquationGenerator from "./grid_equation_generator.js";
import SimpleEquationCalculator from "../simple_equation_calculator.js";
export default class UpdateCurrentCellValueCommand {
    cell;
    value;
    grid;
    oldValue;
    cellVsValues = new Map();
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
    visitedEquations = [];
    fixedVisitedEquations = [];
    get CellVsValues() {
        return this.cellVsValues;
    }
    constructor(cell, value, grid) {
        this.cell = cell;
        this.value = value;
        this.grid = grid;
    }
    execute() {
        if (this.executeIfHasUndo())
            return;
        this.oldValue = this.cell.value;
        this.cell.value = this.value.toString();
        this.cellVsValues.set(this.cell, [this.oldValue, this.cell.value]);
        this.fillRelatedEquationOthersIfNeed(this.cell);
        this.hasExecute = true;
        this.hasUndo = true;
    }
    executeIfHasUndo() {
        switch (true) {
            case this.hasExecute && this.hasUndo:
                return true;
            case this.hasExecute:
                this.cellVsValues.forEach((value, key) => {
                    key.value = value[1];
                });
                this.hasUndo = true;
                return true;
        }
        return false;
    }
    fillRelatedEquationOthersIfNeed(cell) {
        for (const equation of cell.equations.filter(equation => equation.numberCells.filter(c => !c.hasValue).length === 1)) {
            this.grid.assignOperatorForEquationThatNeeded();
            const emptyCell = equation.cells.find(c => !c.hasValue);
            const value = SimpleEquationCalculator.calculateEmptyForNormal(...equation.cells.map(c => c.value));
            if (emptyCell) {
                emptyCell.value = value.toString();
                this.fillRelatedEquationOthersIfNeed(emptyCell);
                this.cellVsValues.set(emptyCell, [emptyCell.value, value.toString()]);
            }
        }
    }
    undo() {
        if (!this.hasUndo) {
            return;
        }
        this.cellVsValues.forEach((_, key) => {
            key.value = "";
        });
        this.hasUndo = false;
    }
}
