import CellHolder from "./cellHolder.js";
import SpriteInstance from "../base/SpriteInstance.js";
export default class Cell extends SpriteInstance {
    pointerDown = [];
    highlightEffect = undefined;
    _highlight = false;
    holder = null;
    get highlight() {
        return this._highlight;
    }
    set highlight(value) {
        if (this._highlight === value) {
            return;
        }
        this._highlight = value;
        if (this.highlightEffect)
            this.highlightEffect.isVisible = value;
        this.zElevation += value ? 0.0001 : -0.0001;
    }
    // get size() {
    //     return this.width;
    // }
    // set size(value: number) {
    //     this.width = value;
    //     this.height = value;
    // }
    constructor() {
        super();
        this.highlightEffect = this.getChildAt(1);
        this.highlight = false;
    }
    onPointerDown(e) {
        console.log('on pointer down:' + this);
        this.pointerDown.forEach(f => f(this));
    }
    onPointerUp(e) {
        this.pointerDown.forEach(f => f(this));
    }
}
