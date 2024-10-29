import Vector from "./Vector.js";
export default class HighlightButton extends ISpriteInstance {
    highlightClicked = [];
    highlight = false;
    screenPoint = Vector.zero;
    constructor() {
        super();
        this.screenPoint = new Vector(this.x, this.y);
    }
    onPointerDown() {
        this.highlightClicked.slice().forEach(c => c(this));
    }
}
