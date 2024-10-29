import Animator from "../Animator.js";
import { lerp, rand } from "../Utils.js";
import { animation } from "../animation_utils.js";
import { animationPresets } from "../Main.js";
export function setGroupVisible(runtime, groupName, visible) {
    // @ts-ignore
    runtime.callFunction("SetGroupVisible", groupName, visible);
}
export function sendEvent(runtime, name, data = null) {
    const event = runtime.objects.SimpleEvent.createInstance(0, 0, 0);
    // @ts-ignore
    event["data"] = data;
    event.instVars.Name = name;
    event.destroy();
}
export function playSoundIfCan(runtime, name) {
    runtime.callFunction("PlaySoundIfCan", name);
    // if (runtime.globalVars.SoundDisable)
    //     return;
    // const ist = runtime.objects.SoundEffect.createInstance(0, 0, 0);
    // ist.instVars.Name = name;
    // ist.destroy();
}
export function registerInstanceClass(runtime, objectName, cl) {
    // @ts-ignore
    runtime.objects[objectName].setInstanceClass(cl);
}
export function addDefaultChild(child, parent, ops = {}) {
    (parent).addChild(child, Object.assign({
        transformX: true,
        transformY: true,
        transformAngle: true,
        transformZElevation: true,
        transformWidth: true,
        transformHeight: true,
        destroyWithParent: true,
        transformVisibility: true,
        // transformOpacity: true
    }, ops));
}
export function findObjectOfType(runtime, typeName) {
    // @ts-ignore
    return runtime.objects[typeName].getFirstInstance() ?? null;
}
export function findObjectsOfType(runtime, typeName) {
    // @ts-ignore
    return [...runtime.objects[typeName].instances()].cast();
}
export function findObjectsAuto(runtime, value) {
    const items = [...runtime.objects.HasNames.instances()].filter(o => o.instVars.Name === value);
    return items.length ? items : findObjectsOfType(runtime, value);
}
export async function toastAnimation(runtime, uid) {
    const bg = runtime.objects.effectbg.getFirstInstance();
    bg.isVisible = true;
    const effect = runtime.getInstanceByUid(uid);
    const width = effect.width;
    const height = effect.height;
    const animator = Animator.create(runtime);
    const startX = effect.x;
    const midX = runtime.layout.width / 2;
    const endX = -(startX - runtime.layout.width / 2) + runtime.layout.width / 2;
    const endScale = 1.5;
    await animator.lerpAnim(15, 0, 1.2, n => {
        effect.x = lerp(startX, midX, n);
        effect.width = width * lerp(endScale, 1, n);
        effect.height = height * lerp(endScale, 1, n);
    }).asPromise();
    await animator.delay(1).asPromise();
    await animator.lerpAnim(15, 0, 1.2, n => {
        effect.x = lerp(midX, endX, n);
        effect.width = width * lerp(1, endScale, n);
        effect.height = height * lerp(1, endScale, n);
    }).asPromise();
    animator.destroy();
    effect.destroy();
    bg.isVisible = false;
}
export async function showEffectToast(runtime, message) {
    const toast = runtime.objects.ToastEffect.getFirstInstance();
    const effect = runtime.objects.ToastEffect.createInstance("GameUI", runtime.layout.width * 1.5, runtime.layout.height / 2 - 300, true);
    const effectBg = runtime.objects.effectbg.getFirstInstance();
    for (let key in toast?.instVars) {
        effect.instVars[key] = toast.instVars[key];
    }
    addDefaultChild(effect, effectBg);
    const animator = Animator.create(runtime);
    console.log('show_effect', [...effectBg.children()]);
    // await animator.delayFrame();
    // animator.destroy();
    // @ts-ignore
    effect["text"].text = message;
    // @ts-ignore
    effect["image"].setAnimation(rand(0, 4) + "");
    const preset = animationPresets['TOAST_EFFECT'];
    if (!preset) {
        return;
    }
    effectBg.isVisible = true;
    await animation(animator.blankComponent, effectBg, preset).asPromise();
    effectBg.isVisible = false;
    effect.destroy();
}
