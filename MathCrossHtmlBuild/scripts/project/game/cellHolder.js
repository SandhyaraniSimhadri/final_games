import Vector from "../Vector.js";
import Color from "./color.js";
import { addDefaultChild } from "../utils/game_utils.js";
import { colorPresets } from "../Main.js";
// noinspection JSUnusedGlobalSymbols
export default class CellHolder extends ISpriteInstance {
    clicked = [];
    get highlightEffect() {
        return this.getChildAt(0);
    }
    _item = null;
    coordinate;
    grid = null;
    intractable = true;
    fixedItem = false;
    _active = true;
    _highlight = false;
    get size() {
        return new Vector(this.width, this.height);
    }
    set outlineColor(value) {
        const effect = this.getEffect('BetterOutline');
        effect.isActive = value.a > 0.001;
        console.log('setting_outline', value);
        effect.setParameter(0, value.toRgb());
    }
    set size(value) {
        this.width = value.x;
        this.height = value.y;
    }
    get highlight() {
        return this._highlight;
    }
    set highlight(value) {
        if (value === this._highlight) {
            return;
        }
        this._highlight = value;
        if (this.highlightEffect)
            this.highlightEffect.isVisible = value;
        if (this.item)
            this.item.highlight = value;
        // console.log('highlighted:', this);
        this.zElevation += value ? 0.00005 : -0.00005;
    }
    set item(value) {
        if (value?.holder) {
            value.holder.item = null;
        }
        if (this._item) {
            this._item.removeFromParent();
            this._item.holder = null;
        }
        this._item = value;
        if (value) {
            addDefaultChild(value, this);
            value.zElevation = this.zElevation + 0.00005;
            value.holder = this;
        }
    }
    get item() {
        return this._item;
    }
    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
        this.setAesthetics(value ? AestheticsInfo.DEFAULT : AestheticsInfo.DEACTIVE);
    }
    constructor() {
        super();
        this.coordinate = new Vector(0, 0);
    }
    onPointerDown() {
        if (!this.intractable || !this.active)
            return;
        this.clicked.forEach(f => f(this));
    }
    setAesthetics(aesthetic) {
        const aestheticsInfo = CellHolder.getAestheticsInfoFor(aesthetic);
        console.log('set_aesthetics_cell_holder', aestheticsInfo);
        this.color = aestheticsInfo.bgColor;
        this.outlineColor = aestheticsInfo.borderColor;
    }
    static getAestheticsInfoFor(aesthetic) {
        return new AestheticsInfo(colorPresets[`BOX_HOLDER_BG_${aesthetic}`] ?? Color.yellow, colorPresets[`BOX_HOLDER_BORDER_${aesthetic}`] ?? Color.black);
    }
}
class AestheticsInfo {
    bgColor;
    borderColor;
    static DEFAULT = "DEFAULT";
    static DEACTIVE = "DEACTIVE";
    constructor(bgColor, borderColor) {
        this.bgColor = bgColor;
        this.borderColor = borderColor;
    }
}
