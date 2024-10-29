import { makeItAsComponentInstanceIfCan } from "../game/component_instance_maker.js";
export default class SpriteInstance extends ISpriteInstance {
    constructor() {
        super();
        makeItAsComponentInstanceIfCan(this);
    }
    // private readonly beforeLayoutEndCallback = this.beforeLayoutEnd.bind(this);
    // private readonly updateCallback = () => {
    //     if (this.isVisible && this.layer.isSelfAndParentsVisible) this.update();
    // }
    //
    //
    // constructor() {
    //     super();
    //     this.runtime.layout.addEventListener('beforelayoutend', this.beforeLayoutEndCallback);
    //     this.runtime.addEventListener("tick", this.updateCallback);
    // }
    //
    //
    // beforeLayoutEnd() {
    //     this.onDestroy();
    // }
    //
    // onDestroy() {
    //     this.runtime.layout.removeEventListener('beforelayoutend', this.beforeLayoutEndCallback);
    //     this.runtime.removeEventListener("tick", this.updateCallback);
    // }
    //
    //
    // update() {
    //
    // }
    //
    // public destroy() {
    //     this.onDestroy();
    //     super.destroy();
    // }
    get types() {
        return [...super.types, "SpriteInstance"];
    }
}
