import GridEquationGenerator from "./grid_equation_generator.js";
import { Cell } from "./a_cell.js";
import SimpleEquationCalculator from "../simple_equation_calculator.js";
export default class ProcessFillNumberCellCommand {
    grid;
    cell;
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
    get CellVsValues() {
        return this.cellVsValues;
    }
    constructor(grid, cell) {
        this.grid = grid;
        this.cell = cell;
    }
    execute() {
        if (this.executeIfHasUndo())
            return;
        this.cellVsValues.clear();
        this.fillNumberTheCell(this.cell);
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
                    key.value = value;
                });
                this.hasUndo = true;
                return true;
        }
        return false;
    }
    fillNumberTheCell(cell) {
        this.grid.assignOperatorForEquationThatNeeded();
        const [constraint, value] = GridEquationGenerator.isConstraintCell(cell);
        cell.value = constraint
            ? value.toString()
            : Array.from({ length: 20 }, (_, i) => i + 1).getRandom().toString();
        this.cellVsValues.set(cell, cell.value);
    }
    fillRelatedEquationOthersIfNeed(cell) {
        for (const equation of cell.equations.filter(equation => equation.numberCells.filter(c => !c.hasValue).length === 1)) {
            this.grid.assignOperatorForEquationThatNeeded();
            const emptyCell = equation.cells.find(c => !c.hasValue);
            const value = SimpleEquationCalculator.calculateEmptyForNormal(...equation.cells.map(c => c.value));
            if (emptyCell) {
                emptyCell.value = value.toString();
                this.cellVsValues.set(emptyCell, emptyCell.value);
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
