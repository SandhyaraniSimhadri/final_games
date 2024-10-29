import Component from "../base/Component.js";
import Vector from "../Vector.js";
import InputController from "../input_controller.js";
export default class CellInteractionDetector extends Component {
    dragStarted = [];
    dragEnded = [];
    clicked = [];
    dragMoved = [];
    onPointerDownBind = this.onPointerDown.bind(this);
    onPointerUpBind = this.onPointerUp.bind(this);
    onPointerMoveBind = this.onPointerMove.bind(this);
    pointerDownTime = 0;
    lastPointerPosition;
    pointerDownCell;
    detectClickOnPoolCell = false;
    _dragging = false;
    get dragging() {
        return this._dragging;
    }
    set dragging(value) {
        this._dragging = value;
    }
    get types() {
        return [...super.types, "CellInteractionDetector"];
    }
    awake() {
        super.awake();
        InputController.instance.pointerDown.push(this.onPointerDownBind);
        InputController.instance.pointerUp.push(this.onPointerUpBind);
        InputController.instance.pointerCancel.push(this.onPointerUpBind);
        InputController.instance.pointerMove.push(this.onPointerMoveBind);
    }
    onDestroy() {
        super.onDestroy();
        InputController.instance.pointerDown.remove(this.onPointerDownBind);
        InputController.instance.pointerUp.remove(this.onPointerUpBind);
        InputController.instance.pointerCancel.remove(this.onPointerUpBind);
        InputController.instance.pointerMove.remove(this.onPointerMoveBind);
    }
    setUp(cells) {
        for (const cell of cells) {
            cell.pointerDown.push(this.onCellPointerDown.bind(this));
        }
    }
    onCellPointerDown(cell) {
        this.pointerDownCell = cell;
        this.pointerDownTime = performance.now();
    }
    onPointerDown(e) {
        this.lastPointerPosition = this.toPosition(e.clientX, e.clientY);
    }
    onPointerUp(e) {
        if (!this.pointerDownCell) {
            return;
        }
        if (this.dragging) {
            this.dragging = false;
            this.dragEnded.forEach(f => f(this.pointerDownCell));
        }
        else {
            this.clicked.forEach(f => f(this.pointerDownCell));
        }
        this.pointerDownCell = undefined;
    }
    onPointerMove(e) {
        if (!this.pointerDownCell)
            return;
        const position = this.toPosition(e.clientX, e.clientY);
        if ((performance.now() - this.pointerDownTime > 200
            || position.sub(this.lastPointerPosition).mag() > 1
            || (!this.pointerDownCell.holder && !this.detectClickOnPoolCell)) && !this.dragging) {
            this.dragging = true;
            this.dragStarted.forEach(f => f(this.pointerDownCell));
        }
        else if (this.dragging) {
            if (position.sub(this.lastPointerPosition).mag() > 1) {
                this.dragMoved.forEach(f => f(this.pointerDownCell, position.sub(this.lastPointerPosition)));
                this.lastPointerPosition = position.clone();
            }
        }
    }
    toPosition(x, y) {
        const [rx, ry] = this.gameObject.layer.cssPxToLayer(x, y);
        return new Vector(rx, ry);
    }
    resetObject() {
    }
}
