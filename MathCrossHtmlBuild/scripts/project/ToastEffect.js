import SpriteInstance from "./base/SpriteInstance.js";
export default class ToastEffect extends SpriteInstance {
    _text;
    _image;
    get text() {
        console.log("text:" + this._text);
        return this._text ??= this.getChild("ITextInstance");
    }
    get image() {
        return this._image ??= this.getChild("ISpriteInstance");
    }
}
