import Component from "../base/Component.js";
import MemberCell, { AestheticsInfo } from "./member_cell.js";
import SimpleEquationCalculator from "./simple_equation_calculator.js";
import Vector from "../Vector.js";
import { Equation } from "../common_models.js";
import { animationPresets, audioPresets, tweenPresets, valuePresets } from "../Main.js";
import Animator from "../Animator.js";
import { animation } from "../animation_utils.js";
export default class CrossGridEquationController extends Component {
    completed = [];
    equations = [];
    controller = null;
    equationStates = new Map();
    get grid() {
        return this.gameObject;
    }
    get types() {
        return [...super.types, "CrossGridEquationController"];
    }
    static getInvolveEquations(equations, coordinate) {
        return equations.filter(e => e.coordinates.some(c => c.equals(coordinate)));
    }
    awake() {
        super.awake();
        this.controller = this.getComponent("CrossGridController");
        this.controller.addedCell.push(this.onControllerOnAddedCell.bind(this));
        this.controller.removedCell.push(this.onControllerOnRemovedCell.bind(this));
    }
    // noinspection JSUnusedLocalSymbols
    onControllerOnAddedCell(cell) {
        this.processEquations(this.equations);
    }
    // noinspection JSUnusedLocalSymbols
    onControllerOnRemovedCell(cell, holder) {
        this.processEquations(this.equations);
    }
    resetObject() {
        this.equations.clear();
    }
    setUp(equations) {
        this.equations.push(...equations);
    }
    processEquations(equations) {
        const equationStates = equations.toMap(equation => equation, this.getState.bind(this));
        const tiles = equations.flatMap(equation => equation.coordinates.map(c => this.grid.getTile(c))).distinct().filter(t => t.item);
        const fixedCellsVsAesthetics = tiles.filter(t => t.fixedItem).map(t => {
            return {
                cell: t.item,
                aesthetics: CrossGridEquationController.getInvolveEquations(equations, t.coordinate).some(e => equationStates.get(e) === EquationState.Wrong) ||
                    CrossGridEquationController.getInvolveEquations(equations, t.coordinate).every(e => equationStates.get(e) === EquationState.NotFill) ?
                    AestheticsInfo.DEFAULT_FIXED : AestheticsInfo.SATISFY_FIXED
            };
        });
        const freeCellsVsAesthetics = tiles.filter(t => !t.fixedItem).map(t => {
            return {
                cell: t.item,
                aesthetics: CrossGridEquationController.getInvolveEquations(equations, t.coordinate).some(e => equationStates.get(e) === EquationState.Wrong) ? AestheticsInfo.WRONG_FREE :
                    CrossGridEquationController.getInvolveEquations(equations, t.coordinate).some(e => equationStates.get(e) === EquationState.Right) ?
                        AestheticsInfo.RIGHT_FREE : AestheticsInfo.DEFAULT_FREE
            };
        });
        this.handleEquationStateEvents(equationStates);
        [...equationStates.keys()].forEach(e => this.equationStates.set(e, equationStates.get(e)));
        fixedCellsVsAesthetics.concat(freeCellsVsAesthetics).forEach(({ cell, aesthetics }) => cell.setAestheticsByName(aesthetics));
        if ([...equationStates.values()].every(s => s === EquationState.Right)) {
            this.completed.forEach(a => a());
        }
    }
    getState(equation) {
        const cells = equation.coordinates.map(c => this.grid.getTile(c).item);
        if (cells.some(c => !c))
            return EquationState.NotFill;
        return SimpleEquationCalculator.isRight(cells.map(c => c.value)) ? EquationState.Right : EquationState.Wrong;
    }
    handleEquationStateEvents(equationStates) {
        [...equationStates.keys()].filter(e => equationStates.get(e) === EquationState.Right && this.equationStates.get(e) !== EquationState.Right).forEach(e => {
            this.onEquationSuccess(e, this.equationStates.get(e));
        });
        [...equationStates.keys()].filter(e => equationStates.get(e) === EquationState.Wrong && this.equationStates.get(e) !== EquationState.Wrong).forEach(e => {
            this.onEquationFailed(e, this.equationStates.get(e));
        });
        [...equationStates.keys()].filter(e => equationStates.get(e) === EquationState.NotFill && this.equationStates.get(e) !== EquationState.NotFill).forEach(e => {
            this.onEquationNotFilled(e, this.equationStates.get(e));
        });
    }
    onEquationNotFilled(e, equationState) {
    }
    onEquationFailed(e, equationState) {
    }
    onEquationSuccess(e, equationState) {
        this.startCoroutine(this.equationSuccessAnim(e.coordinates.map(c => this.grid.getTile(c).item).cast()));
        this.playSoundIfCan(audioPresets.EQUATION_SUCCESS);
    }
    *equationSuccessAnim(cells) {
        const startScale = cells[0].scale.x;
        let currentIndex = 0;
        const anim = animationPresets['EQUATION_SUCCESS']?.deepClone();
        if (anim) {
            yield Animator.tweenAnimFuncYield(this, tweenPresets.EQUATION_SUCCESS, n => {
                const index = Math.floor(n * (cells.length - 1));
                if (index <= currentIndex)
                    return;
                currentIndex = index;
                const memberCell = cells[index];
                memberCell.zElevation += index * 0.0001;
                const yieldInstructions = animation(this, memberCell, anim.deepClone()).toGenerator();
                this.startCoroutine(yieldInstructions, () => {
                    memberCell.zElevation -= index * 0.0001;
                    memberCell.scale = Vector.one.mul(startScale);
                });
            });
        }
    }
}
export var EquationState;
(function (EquationState) {
    EquationState[EquationState["NotFill"] = 0] = "NotFill";
    EquationState[EquationState["Right"] = 1] = "Right";
    EquationState[EquationState["Wrong"] = 2] = "Wrong";
})(EquationState || (EquationState = {}));
