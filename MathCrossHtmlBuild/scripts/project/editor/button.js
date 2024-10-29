import Vector from "../Vector.js";
export default class Button extends ISpriteInstance {
    clicked = [];
    get intractable() {
        return this.instVars.intractable;
    }
    set intractable(value) {
        this.instVars.intractable = value;
        this.opacity = value ? 1 : 0.6;
    }
    onClicked(item) {
        console.log("Clicked");
        if (!this.intractable) {
            return;
        }
        this.clicked.forEach(c => c(this));
        this.clickAnim().then();
    }
    async clickAnim() {
        console.log("Clicking Anim");
        await this.animator.linearAnim(15, n => {
            console.log(n);
            return this.scale = Vector.lerp(Vector.one, new Vector(1.1, 1.1), n);
        }).asPromise(this.animator);
        await this.animator.linearAnim(15, n => this.scale = Vector.lerp(new Vector(1.1, 1.1), Vector.one, n)).asPromise(this.animator);
    }
}
