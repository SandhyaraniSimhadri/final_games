import Color from "../game/color.js";
import Vector from "../Vector.js";
export {};
Object.defineProperty(ISpriteInstance.prototype, 'overlayColor', {
    get() {
        return this._overlayColor ??= new Color(1, 1, 1, 0);
    },
    set(value) {
        this._overlayColor = value;
        this.color = this.color;
    }
});
Object.defineProperty(ISpriteInstance.prototype, 'color', {
    get() {
        return this._color ??= new Color(this.colorRgb[0], this.colorRgb[1], this.colorRgb[2], this.opacity);
    },
    set(value) {
        this._color = value;
        const result = new Color(this.overlayColor.r * this.overlayColor.a +
            value.r * (1 - this.overlayColor.a), this.overlayColor.g * this.overlayColor.a +
            value.g * (1 - this.overlayColor.a), this.overlayColor.b * this.overlayColor.a +
            value.b * (1 - this.overlayColor.a), value.a);
        this.colorRgb = result.toRgb();
        this.opacity = value.a;
    }
});
Object.defineProperty(ISpriteInstance.prototype, 'types', {
    get() {
        return ["ISpriteInstance"];
    }
});
