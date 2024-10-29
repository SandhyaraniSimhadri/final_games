import Color from "../game/color.js";
export {};
Object.defineProperty(ITextInstance.prototype, 'color', {
    get() {
        return new Color(this.fontColor[0], this.fontColor[1], this.fontColor[2], this.opacity);
    },
    set(value) {
        this.fontColor = value.toRgb();
        console.log(this.fontColor);
        this.opacity = value.a;
    }
});
Object.defineProperty(ITextInstance.prototype, 'types', {
    get() {
        return ["ITextInstance"];
    }
});
