// noinspection JSUnusedGlobalSymbols
import LinearMoveAnim from "./LinearAnim.js";
import LerpAnim from "./LerpAnim.js";
import { PromiseYieldInstruction } from "./base/YieldInstruction.js";
import SpriteInstance from "./base/SpriteInstance.js";
import { curves } from "./Curves.js";
export default class Animator extends SpriteInstance {
    updatables = [];
    constructor() {
        super();
    }
    update() {
        // console.log("Animator update");
        this.updatables.forEach(u => u.update(this.runtime.dt));
    }
    delayFrame(count = 1) {
        return Animator.delayFrameYield(this, count);
    }
    static delayFrameFunc(provider, count = 1, token = null) {
        return new Promise((resolve, _) => {
            let frameCount = 0;
            let wait = null;
            const removeFromUpdatables = provider.removeFromUpdatables.bind(provider);
            wait = {
                update() {
                    frameCount++;
                    if (token && token.cancel) {
                        removeFromUpdatables(wait);
                        return;
                    }
                    if (frameCount >= count) {
                        resolve();
                        removeFromUpdatables(wait);
                    }
                }
            };
            provider.addToUpdatables(wait);
        });
    }
    static delayFrameYield(provider, count = 1) {
        return new PromiseYieldInstruction((token) => Animator.delayFrameFunc(provider, count, token));
    }
    static create(runtime, isGlobal = false, layerIndex = 0) {
        const animator = isGlobal ? runtime.objects.AnimatorGlobal : runtime.objects.Animator;
        return animator.createInstance(layerIndex, 0, 0);
    }
    waitUntil(predicate) {
        return Animator.waitUntilFuncYield(this, predicate);
    }
    static waitUntilFunc(provider, predicate, token = null) {
        return new Promise((resolve, _) => {
            let wait = null;
            const removeFromUpdatables = provider.removeFromUpdatables.bind(provider);
            wait = {
                update() {
                    if (token && token.cancel) {
                        removeFromUpdatables(wait);
                        return;
                    }
                    if (predicate()) {
                        resolve();
                        removeFromUpdatables(wait);
                    }
                }
            };
            provider.addToUpdatables(wait);
        });
    }
    static waitUntilFuncYield(provider, predicate) {
        return new PromiseYieldInstruction((token) => Animator.waitUntilFunc(provider, predicate, token));
    }
    addToUpdatables(updatable) {
        this.updatables.push(updatable);
    }
    removeFromUpdatables(updatable) {
        console.log("removeFromUpdatables", this);
        this.updatables.remove(updatable);
    }
    linearAnim(speed, updateCallback, finished = null) {
        return Animator.linearAnimFuncYield(this, speed, updateCallback, finished);
    }
    static linearAnimFunc(provider, speed, updateCallback, finished = null, token = null) {
        return new Promise((resolve, _) => {
            let anim = null;
            anim = new LinearMoveAnim(speed, (n) => {
                if (token && token.cancel) {
                    resolve(false);
                    provider.removeFromUpdatables(anim);
                    console.log('updatables', provider);
                    // finished?.()
                    return;
                }
                if (updateCallback)
                    updateCallback(n);
                if (token && token.cancel) {
                    resolve(false);
                    provider.removeFromUpdatables(anim);
                    // finished?.()
                    return;
                }
            }, () => {
                // updateCallback(1);
                if (token && token.cancel)
                    return;
                provider.removeFromUpdatables(anim);
                if (finished)
                    finished();
                resolve(true);
            });
            provider.addToUpdatables(anim);
        });
    }
    curveAnim(curve, time, updateCallback, finished = null) {
        return Animator.curveAnimFuncYield(this, curve, time, updateCallback, finished);
    }
    static tweenAnimFunc(provider, tween, updateCallback, finished = null, token = null) {
        return this.curveAnimFunc(provider, curves[tween.curve], tween.duration, updateCallback, finished, token);
    }
    static tweenAnimFuncYield(provider, tween, updateCallback, finished = null) {
        return new PromiseYieldInstruction(async (token) => {
            await Animator.tweenAnimFunc(provider, tween, updateCallback, finished, token);
        });
    }
    tweenAnim(tween, updateCallback, finished = null) {
        return Animator.tweenAnimFuncYield(this, tween, updateCallback, finished);
    }
    static curveAnimFunc(provider, curve, time, updateCallback, finished = null, token = null) {
        return this.linearAnimFunc(provider, 1 / time, (n) => {
            updateCallback(curve(n), n);
        }, finished, token);
    }
    static curveAnimFuncYield(provider, curve, time, updateCallback, finished = null, token = undefined) {
        return new PromiseYieldInstruction(async (token) => {
            await Animator.curveAnimFunc(provider, curve, time, updateCallback, finished, token);
        }, token);
    }
    static linearAnimFuncYield(provider, speed, updateCallback, finished = null) {
        return new PromiseYieldInstruction(async (token) => {
            await Animator.linearAnimFunc(provider, speed, updateCallback, finished, token);
        });
    }
    until(predicate, updateCallback, finished = null) {
        return Animator.untilFuncYield(this, predicate, updateCallback, finished);
    }
    static untilFunc(provider, predicate, updateCallback, finished = null, token = null) {
        return new Promise((resolve, _) => {
            let wait = null;
            const removeFromUpdatables = provider.removeFromUpdatables.bind(provider);
            wait = {
                update() {
                    if (predicate() || token && token.cancel) {
                        resolve();
                        finished?.();
                        removeFromUpdatables(wait);
                    }
                    else
                        updateCallback();
                }
            };
            provider.addToUpdatables(wait);
        });
    }
    static untilFuncYield(provider, predicate, updateCallback, finished = null) {
        return new PromiseYieldInstruction((token) => Animator.untilFunc(provider, predicate, updateCallback, finished, token));
    }
    lerpAnim(speed, start, end, updateCallback, finished = null) {
        return Animator.lerpAnimFuncYield(this, speed, start, end, updateCallback, finished);
    }
    static lerpAnimFunc(updatableProvider, speed, start, end, updateCallback, finished = null, token = null) {
        return new Promise((resolve, _) => {
            let anim = null;
            console.log("lerpAnimFunc", updatableProvider);
            anim = new LerpAnim(speed, start, end, (n) => {
                if (updateCallback)
                    updateCallback(n);
                if (token && token.cancel) {
                    updatableProvider.removeFromUpdatables(anim);
                }
            }, () => {
                updatableProvider.removeFromUpdatables(anim);
                if (finished)
                    finished();
                resolve();
            });
            updatableProvider.addToUpdatables(anim);
        });
    }
    static lerpAnimFuncYield(updatableProvider, speed, start, end, updateCallback, finished = null) {
        return new PromiseYieldInstruction((token) => Animator.lerpAnimFunc(updatableProvider, speed, start, end, updateCallback, finished, token));
    }
    delay(s) {
        return Animator.delayFuncYield(this, s);
    }
    static delayFunc(provider, s, token = {}) {
        return new Promise((resolve, _) => {
            let time = s;
            let wait = null;
            const removeFromUpdatables = provider.removeFromUpdatables.bind(provider);
            wait = {
                update(dt) {
                    time -= dt;
                    if (time <= 0 || token && token.cancel) {
                        resolve();
                        removeFromUpdatables(wait);
                    }
                }
            };
            provider.addToUpdatables(wait);
        });
    }
    static delayFuncYield(provider, s) {
        return new PromiseYieldInstruction((token) => Animator.delayFunc(provider, s, token));
    }
}
