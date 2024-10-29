import Cell from "./cell.js";
import Vector from "../Vector.js";
import { AddConfig } from "./i_cell_transporter.js";
import Component from "../base/Component.js";
import Grid from "./grid.js";
import Animator from "../Animator.js";
import { animationPresets, audioPresets, tweenPresets } from "../Main.js";
import { animation } from "../animation_utils.js";
export default class MoveCellTransporter extends Component {
    _crossGridController;
    get crossGridController() {
        return this._crossGridController ??= this.getComponent("CrossGridController");
    }
    _pool;
    get pool() {
        return this._pool ??= this.findObjectOfType("CellPool");
    }
    get types() {
        return [...super.types, "ICellTransporter", "MoveCellTransporter"];
    }
    get grid() {
        return this.gameObject;
    }
    async addTo(cell, to, config) {
        const startPosition = cell.position;
        const target = this.grid.getTile(to).position;
        const startCellSize = cell.size;
        const targetCellSize = this.grid.getTile(to).size;
        if (config.sound) {
            this.playSoundIfCan(audioPresets.CELL_ADD);
        }
        const anim = animationPresets.CELL_ADD_TO?.deepClone();
        if (anim) {
            const others = {
                start: { position: startPosition, size: startCellSize },
                target: { position: target, size: targetCellSize }
            };
            await animation(this, cell, anim, others).asPromise();
            console.log("add to animation done", others);
        }
        else {
            await Animator.tweenAnimFunc(this, tweenPresets.CELL_ADD_TO, n => {
                cell.position = Vector.lerp(startPosition, target, n);
            });
            await Animator.linearAnimFunc(this, 6, n => {
                cell.size = Vector.lerp(startCellSize, targetCellSize, n);
            });
        }
        this.crossGridController.addCell(cell, to);
    }
    async return(cell) {
        const startPosition = cell.position;
        const target = this.pool.getPositionFor(cell);
        const startCellSize = cell.size;
        const targetCellSize = this.pool.cellSize;
        this.playSoundIfCan(audioPresets.CELL_RETURN);
        const anim = animationPresets.CELL_RETURN_TO;
        if (anim) {
            await animation(this, cell, anim, {
                // start: {position: startPosition, size: startCellSize, opacity: 0.1, angle: 50},
                target: { position: target, size: targetCellSize }
            }).asPromise();
        }
        else {
            await Animator.tweenAnimFunc(this, tweenPresets.CELL_RETURN_TO, n => {
                cell.position = Vector.lerp(startPosition, target, n);
                cell.size = Vector.lerp(startCellSize, targetCellSize, n);
            });
        }
        this.pool.return(cell);
    }
}
