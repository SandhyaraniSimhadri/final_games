export default class TextWithBG extends ISpriteInstance {
    text;
    constructor() {
        super();
        this.text = this.runtime.objects[this.instVars.TextObject].createInstance(this.layer.index, this.x, this.y);
        this.addDefaultChild(this.text);
    }
    addDefaultChild(child) {
        this.addChild(child, {
            transformX: true,
            transformY: true,
            transformAngle: true,
            transformZElevation: true,
            transformWidth: true,
            transformHeight: true,
            destroyWithParent: true
        });
    }
}
