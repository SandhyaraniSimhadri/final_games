import Component from "../base/Component.js";
import Vector from "../Vector.js";
import InputController from "../input_controller.js";
import Animator from "../Animator.js";
import { lerp } from "../Utils.js";
export default class DragInteractionHandler extends Component {
    afterFocusStarted = [];
    beforeFocusStarted = [];
    active = true;
    focus = false;
    _pool;
    _draggingCell;
    set draggingCell(value) {
        if (value)
            value.zElevation = 0.1;
        this._draggingCell = value;
    }
    get draggingCell() {
        return this._draggingCell;
    }
    dragPoint;
    get types() {
        return [...super.types, "IInteractionHandler", "DragInteractionHandler"];
    }
    get pool() {
        return this._pool ??= this.findObjectOfType("CellPool");
    }
    _grid;
    get grid() {
        return this._grid ??= this.findObjectOfType("Grid");
    }
    _controller;
    get controller() {
        return this._controller ??= this.getComponent("CrossGridController");
    }
    _transporter;
    get transporter() {
        return this._transporter ??= Component.get("ICellTransporter");
    }
    _snippingHolder;
    get snippingHolder() {
        return this._snippingHolder;
    }
    set snippingHolder(value) {
        if (this._snippingHolder) {
            this._snippingHolder.highlight = false;
        }
        this._snippingHolder = value;
        if (this._snippingHolder) {
            this._snippingHolder.highlight = true;
        }
    }
    get draggableHolders() {
        return this.grid.tiles.filter(t => t.active && !t.fixedItem);
    }
    awake() {
        super.awake();
        const interactionDetector = this.getComponent("CellInteractionDetector");
        interactionDetector.dragStarted.push(this.onDragStarted.bind(this));
        interactionDetector.dragEnded.push(this.onDragEnded.bind(this));
        interactionDetector.dragMoved.push(this.onDragMoved.bind(this));
    }
    onDragStarted(cell) {
        if (this.draggingCell)
            return;
        this.beforeFocusStarted.forEach(f => f(this));
        this.focus = true;
        if (cell.holder) {
            this.controller.removeCell(cell);
        }
        else {
            this.pool.remove(cell);
        }
        this.draggingCell = cell;
        this.draggingCell.highlight = true;
        const position = InputController.mousePosition.clone();
        const [x, y] = this.gameObject.layer.cssPxToLayer(position.x, position.y);
        this.dragPoint = new Vector(x, y);
        this.dragAsync().then();
    }
    // noinspection JSUnusedLocalSymbols
    onDragEnded(cell) {
        this.draggingCell.highlight = false;
        if (this.snippingHolder) {
            const holderCell = this.snippingHolder.item;
            if (holderCell) {
                this.controller.removeCell(holderCell);
                holderCell.highlight = false;
                this.transporter.return(holderCell).then();
            }
            this.transporter.addTo(this.draggingCell, this.snippingHolder.coordinate, { sound: true }).then();
        }
        else {
            this.transporter.return(this.draggingCell).then();
        }
        this.draggingCell = undefined;
        this.focus = false;
        this.snippingHolder = undefined;
        this.afterFocusStarted.forEach(f => f(this));
    }
    // noinspection JSUnusedLocalSymbols
    onDragMoved(cell, delta) {
        const position = InputController.mousePosition.clone();
        const [x, y] = this.gameObject.layer.cssPxToLayer(position.x, position.y);
        this.dragPoint = new Vector(x, y);
    }
    async dragAsync() {
        const offset = new Vector(0, -300);
        const offsetAtStart = this.draggingCell.position.sub(this.dragPoint);
        const startSize = this.draggingCell.size.x;
        const targetSize = Math.max(startSize, this.pool.cellSize.x);
        await Animator.lerpAnimFunc(this, 40, 0, 1.2, n => {
            if (!this.draggingCell) {
                return;
            }
            this.draggingCell.size = Vector.one.mul(lerp(startSize, targetSize, n));
            this.draggingCell.position = this.dragPoint.add(Vector.lerp(offsetAtStart, offset, n));
        });
        if (!this.draggingCell) {
            return;
        }
        const holderWidth = this.grid.getTileXY(1, 0).position.sub(this.grid.getTileXY(0, 0).position).mag();
        const cellWidth = this.draggingCell.width;
        await Animator.untilFunc(this, () => !this.draggingCell, () => {
            this.draggingCell.position = this.dragPoint.add(offset);
            this.snippingHolder = this.draggableHolders.find(h => h.position.sub(this.draggingCell.position).mag() < (holderWidth + cellWidth) / 2);
        });
    }
}
