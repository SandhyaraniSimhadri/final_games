// noinspection JSUnusedGlobalSymbols
import Cell from "./cell.js";
import Color from "./color.js";
import { colorPresets } from "../Main.js";
export default class MemberCell extends Cell {
    text;
    outline;
    constructor() {
        super();
        this.text = this.getChild("ITextInstance");
        this.outline = this.getEffect("BetterOutline");
        // this.runOnNextFrame(() => this.text = this.getChild<ITextInstance>("ITextInstance")!);
    }
    _value = '';
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this.text)
            this.text.text = value;
    }
    get bgColor() {
        return this.color;
    }
    set bgColor(value) {
        this.color = value;
        this.colorRgb = value.toRgb();
    }
    set outlineColor(value) {
        const effect = this.getEffect('BetterOutline');
        // effect.isActive = value.a > 0.001;
        effect.setParameter(0, value.toRgb());
    }
    set textColor(value) {
        if (this.text)
            this.text.colorRgb = value.toRgb();
    }
    setAestheticsByName(aesthetic) {
        const aestheticsInfo = MemberCell.getAestheticsInfoFor(aesthetic);
        this.setAesthetics(aestheticsInfo);
    }
    setAesthetics(aestheticsInfo) {
        this.bgColor = aestheticsInfo.bgColor;
        this.textColor = aestheticsInfo.textColor;
        this.outline.isActive = aestheticsInfo.borderColor.a > 0.001;
        this.outline.setParameter(0, aestheticsInfo.borderColor.toRgb());
    }
    static getAestheticsInfoFor(aesthetic) {
        return new AestheticsInfo(colorPresets[`BOX_${aesthetic}`] ?? Color.yellow, colorPresets[`BOX_TEXT_${aesthetic}`] ?? Color.black, colorPresets[`BOX_BORDER_${aesthetic}`] ?? Color.black);
    }
    init(info) {
        this.text = this.getChild("ITextInstance");
        this.value = info.value;
    }
}
export class AestheticsInfo {
    bgColor;
    textColor;
    borderColor;
    static DEFAULT_FIXED = "DEFAULT_FIXED";
    static SATISFY_FIXED = "SATISFY_FIXED";
    static DEFAULT_FREE = "DEFAULT_FREE";
    static RIGHT_FREE = "RIGHT_FREE";
    static WRONG_FREE = "WRONG_FREE";
    constructor(bgColor, textColor, borderColor) {
        this.bgColor = bgColor;
        this.textColor = textColor;
        this.borderColor = borderColor;
    }
}
