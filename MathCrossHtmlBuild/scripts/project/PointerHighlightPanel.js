import Animator from "./Animator.js";
export default class PointerHighlightPanel {
    runtime;
    handEffect;
    _animator;
    get animator() {
        return this._animator ??= Animator.create(this.runtime);
    }
    constructor(runtime) {
        this.runtime = runtime;
        this.handEffect = runtime.objects.HandEffect.getFirstInstance();
    }
    async highlightClick(target, until) {
        this.clear();
        this.handEffect.position = (target);
        this.handEffect.isVisible = true;
        this.handEffect.isAnimate = true;
        const animator = Animator.create(this.runtime);
        await animator.waitUntil(until).asPromise();
        this.clear();
    }
    async highlightDrag(from, to, until) {
        this.clear();
        this.handEffect.position = (from);
        this.handEffect.isVisible = true;
        this.handEffect.isAnimate = false;
        let finished = false;
        const untilFinish = () => finished || (finished = until());
        while (!untilFinish()) {
            await this.dragAnim(from, to, untilFinish.bind(this));
        }
        this.clear();
    }
    async dragAnim(from, to, until) {
        this.handEffect.color = this.handEffect.color.withAlpha(0);
        this.handEffect.position = from;
        await PointerHighlightPanel.animAlpha(this.animator, this.handEffect.hand, 1, 2);
        if (until())
            return;
        await this.animator.linearAnim(1, n => {
            this.handEffect.position = from.add(to.sub(from).mul(n));
        }).asPromise();
        if (until()) {
            return;
        }
        await this.animator.delay(0.2).asPromise();
        await PointerHighlightPanel.animAlpha(this.animator, this.handEffect.hand, 0, 2);
    }
    static async animAlpha(provider, image, target, speed) {
        const startAlpha = image.color.a;
        await Animator.lerpAnimFunc(provider, speed, 0, 1.2, n => {
            console.log('alpha n:' + n);
            image.color = image.color.withAlpha(startAlpha + (target - startAlpha) * n);
        });
    }
    clear() {
        this.handEffect.isVisible = false;
    }
}
