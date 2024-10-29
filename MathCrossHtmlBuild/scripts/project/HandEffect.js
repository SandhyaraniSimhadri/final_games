import Vector from "./Vector.js";
import { lerp } from "./Utils.js";
// noinspection InfiniteLoopJS,JSSuspiciousNameCombination
export default class HandEffect extends ISpriteInstance {
    hand;
    // private handSize: Vector;
    isAnimate = true;
    constructor() {
        super();
        this.hand = this.runtime.objects.HandIcon.getFirstInstance();
        this.hand.x = this.x;
        this.hand.y = this.y;
        // this.handSize = new Vector(this.hand.width, this.hand.height);
        this.addDefaultChild(this.hand);
        this.animate().then(() => {
        });
    }
    async animate() {
        const animator = this.runtime.objects.Animator.createInstance(0, 0, 0);
        const minAndMaxScale = new Vector(0.9, 1.1);
        while (true) {
            if (!this.isAnimate) {
                this.hand.scale = Vector.one;
                await animator.waitUntil(() => this.isAnimate).asPromise();
            }
            await animator.linearAnim(3, n => {
                const scale = lerp(minAndMaxScale.x, minAndMaxScale.y, n);
                this.hand.scale = Vector.one.mul(scale);
                // this.hand.width = this.handSize.x * scale;
                // this.hand.height = this.handSize.y * scale;
            }).asPromise();
            await animator.delay(0.3).asPromise();
            await animator.linearAnim(3, n => {
                const scale = lerp(minAndMaxScale.y, minAndMaxScale.x, n);
                this.hand.scale = Vector.one.mul(scale);
                // this.hand.width = this.handSize.x * scale;
                // this.hand.height = this.handSize.y * scale;
            }).asPromise();
        }
    }
    addDefaultChild(child) {
        this.addChild(child, {
            transformX: true,
            transformY: true,
            transformAngle: true,
            transformZElevation: true,
            transformWidth: true,
            transformHeight: true,
            destroyWithParent: true,
            transformVisibility: true
        });
    }
}
