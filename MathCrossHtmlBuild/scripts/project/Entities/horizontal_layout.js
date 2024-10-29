import Vector from "../Vector.js";
export default class HorizontalLayout extends ISpriteInstance {
    padding;
    constructor() {
        super();
        this.padding = this.instVars.padding;
        [...this.children()].forEach(c => c.stateChanged.push(this.onChildStateChanged.bind(this)));
        this.updateLayout();
        // this.runOnNextFrame(() => this.updateLayout());
    }
    onChildStateChanged(c, state) {
        if (state.name === 'visible')
            this.updateLayout();
    }
    addChild(child, opts) {
        super.addChild(child, opts);
        this.updateLayout();
    }
    removeChild(child) {
        super.removeChild(child);
        this.updateLayout();
    }
    updateLayout() {
        let activeChildren = [...this.children()].filter(c => c.visible).sort((a, b) => a.x - b.x);
        if (activeChildren.length === 0)
            return;
        console.log("updating layout:", this);
        const x = this.x - this.width / 2 + this.padding + this.getChildAt(0).width / 2;
        const availableWidth = (this.width - 2 * this.padding - this.getChildAt(0).width / 2 - this.getChildAt(activeChildren.length - 1).width / 2);
        const spacing = availableWidth / (activeChildren.length - 1);
        console.log("available width: " + availableWidth, spacing);
        for (let i = 0; i < activeChildren.length; i++) {
            const child = activeChildren[i];
            child.position = new Vector(x + i * spacing, this.y);
        }
    }
}
