import { Cell } from "./a_cell.js";
import ProcessFillNumberCellCommand from "./process_fill_number_cell_command.js";
import UpdateCurrentCellValueCommand from "./update_current_cell_value_command.js";
import FixCurrentEquationCommand from "./fix_current_equation_command.js";
import SimpleEquationCalculator from "../simple_equation_calculator.js";
export default class GridEquationGenerator {
    equations;
    operatorVsProbability;
    cells;
    numberCells;
    constructor(equations, operatorVsProbability) {
        this.equations = equations;
        this.operatorVsProbability = operatorVsProbability || new Map([
            ["+", 0.5],
            ["-", 0.5],
            ["x", 0.5],
            ["/", 0.5]
        ]);
        if (this.operatorVsProbability.has("+")) {
            this.operatorVsProbability.set("+", Math.max(this.operatorVsProbability.get("+") || 0.1, 0.1));
        }
        this.cells = this.equations.flatMap(e => e.cells).filter((c, index, self) => self.indexOf(c) === index);
        this.numberCells = this.equations.flatMap(e => e.numberCells).filter((c, index, self) => self.indexOf(c) === index);
    }
    run() {
        let count = 0;
        do {
            const enumerator = this.generate();
            while (true) {
                const { done, value } = enumerator.next();
                if (done)
                    break;
                value.execute();
            }
            count++;
        } while (count < 100 && (this.equations.some(e => e.numberCells.some(c => parseInt(c.value) > 200)) || this.equations.some(e => !e.isRight)));
    }
    *generate() {
        this.fillOthersForEquations();
        const crossCells = this.numberCells.filter(c => c.equations.length === 2);
        const crossResultCells = crossCells.filter(c => c.equations.some(e => e.cells[e.cells.length - 1] === c));
        const cells = this.numberCells.filter(c => !crossCells.includes(c));
        const resultCells = cells.filter(c => c.equations.some(e => e.cells[e.cells.length - 1] === c));
        const cellsToProcess = crossCells.filter(c => !crossResultCells.includes(c))
            .concat(crossResultCells)
            .concat(cells.filter(c => !resultCells.includes(c)))
            .concat(resultCells);
        const processGenerateCells = this.processGenerateCells(cellsToProcess);
        while (true) {
            const { done, value } = processGenerateCells.next();
            if (done)
                break;
            yield value;
        }
        let count = 0;
        while (count++ < 50) {
            const negativeCell = this.numberCells.find(c => c.hasValue && parseInt(c.value) <= 0);
            if (!negativeCell)
                break;
            const enumerator = this.updateCellWithNewValue(negativeCell.holder.coordinate, Math.floor(Math.random() * 20) + 1);
            while (true) {
                const { done, value } = enumerator.next();
                if (done)
                    break;
                yield value;
            }
        }
    }
    *processGenerateCells(cellsToProcess) {
        for (const cell of cellsToProcess) {
            if (cell.hasValue)
                continue;
            const command = this.processGenerateNoValueCell(cell);
            while (true) {
                const { done, value } = command.next();
                if (done)
                    break;
                yield value;
            }
        }
    }
    *processGenerateNoValueCell(cell) {
        const processFillNumberCell = this.processFillNumberCell(cell);
        yield processFillNumberCell;
        for (let [cell, value] of processFillNumberCell.cellVsValues) {
            yield new UpdateCurrentCellValueCommand(cell, parseInt(value), this);
        }
        const negativeCell = this.numberCells.find(c => c.hasValue && parseInt(c.value) <= 0);
        if (negativeCell) {
            const enumerator = this.updateCellWithNewValue(negativeCell.holder.coordinate, Math.floor(Math.random() * 20) + 1);
            while (true) {
                const { done, value } = enumerator.next();
                if (done)
                    break;
                yield value;
            }
        }
    }
    *updateCellWithNewValue(coordinate, value, visited = new Set()) {
        const cell = this.cells.find(c => c.holder.coordinate.equals(coordinate));
        if (!cell)
            return;
        const updateCurrentCellValueCommand = new UpdateCurrentCellValueCommand(cell, value, this);
        yield updateCurrentCellValueCommand;
        if (updateCurrentCellValueCommand.cellVsValues.size > 0 && ![...updateCurrentCellValueCommand.cellVsValues.keys()].some(c => c.equations.every(e => e.isFilled && visited.has(e)))) {
            const equations = [...updateCurrentCellValueCommand.cellVsValues.keys()].flatMap((c) => c.equations);
            equations.forEach(visited.add.bind(visited));
            for (const equation of [...updateCurrentCellValueCommand.cellVsValues.keys()].flatMap(c => c.equations.filter(e => e.isFilled && !e.isRight))) {
                const fixCurrentEquationCommand = new FixCurrentEquationCommand(this, equation, cell);
                yield fixCurrentEquationCommand;
            }
            for (const updatedCell of [...updateCurrentCellValueCommand.cellVsValues.keys()].filter(c => c.equations.some(e => e.isFilled && !e.isRight)).map(c => c.equations.find(e => e.isFilled && !e.isRight).cells[0])) {
                const enumerator = this.updateCellWithNewValue(updatedCell.coordinate, parseInt(updatedCell.value), visited);
                while (true) {
                    const { done, value } = enumerator.next();
                    if (done)
                        break;
                    yield value;
                }
            }
        }
    }
    fillOthersForEquations() {
        this.equations.forEach(eq => {
            eq.cells[0].value = "";
            eq.cells[1].value = "";
            eq.cells[2].value = "";
            eq.cells[3].value = "=";
            eq.cells[4].value = "";
        });
    }
    assignOperatorForEquationThatNeeded() {
        for (const equation of this.equations.filter(e => !e.cells[1].hasValue && e.numberCells.filter(n => !n.hasValue).length === 1)) {
            this.assignOperator(equation);
        }
    }
    assignOperator(equation) {
        const operatorCell = equation.cells[1];
        const allowedOperators = [];
        const plusProbability = this.operatorVsProbability.get("+") || 0.5;
        allowedOperators.push(...Array.from({ length: Math.max(Math.floor(plusProbability * 100), 1) }).map(_ => "+"));
        const minusProbability = this.operatorVsProbability.get("-") || 0.5;
        allowedOperators.push(...Array.from({ length: Math.max(Math.floor(minusProbability * 100), 1) }).map(_ => "-"));
        if (!equation.cells[equation.cells.length - 1].hasValue &&
            equation.numberCells.every(c => !c.hasValue || (parseInt(c.value) < 20 && parseInt(c.value) !== 0))) {
            const multiplicationProbability = this.operatorVsProbability.get("x") || 0.5;
            allowedOperators.push(...Array.from({ length: Math.max(Math.floor(multiplicationProbability * 100), 1) }).map(_ => "x"));
        }
        if (!equation.cells[0].hasValue &&
            equation.numberCells.every(c => !c.hasValue || parseInt(c.value) !== 0)) {
            const divisionProbability = this.operatorVsProbability.get("/") || 0.5;
            allowedOperators.push(...Array.from({ length: Math.max(Math.floor(divisionProbability * 100), 1) }).map(_ => "/"));
        }
        operatorCell.value = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];
    }
    processFillNumberCell(cell) {
        if (cell.hasValue)
            return null;
        return new ProcessFillNumberCellCommand(this, cell);
    }
    static isConstraintCell(cell) {
        const constraintEquation = cell.equations.find(e => e.cells.filter(c => c !== cell).every(c => c.hasValue));
        const value = constraintEquation ? SimpleEquationCalculator.calculateEmptyForNormal(...constraintEquation.cells.map(c => c.value)) : -1;
        return [constraintEquation !== undefined, value];
    }
}
