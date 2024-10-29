import { playSoundIfCan } from "./utils/game_utils.js";
import Animator from "./Animator.js";
import { boolPresets, colorPresets, gradientPresets, spritePresets } from "./Main.js";
export default class Scene {
    runtime;
    _animator;
    get animator() {
        return this._animator ??= Animator.create(this.runtime);
    }
    constructor(runtime) {
        this.runtime = runtime;
        [...runtime.objects.ColorPresetImages.instances()].forEach(img => {
            img.color = colorPresets[img.instVars.ColorPreset] ?? img.color;
        });
        [...runtime.objects.ColorPresetTexts.instances()].forEach(img => {
            img.color = colorPresets[img.instVars.ColorPreset] ?? img.color;
            console.log(img, colorPresets[img.instVars.ColorPreset]);
        });
        [...runtime.objects.GradientPresetImages.instances()].forEach(img => {
            console.log(img.effects);
            const effect = img.effects.find(e => e.name === "Gradient");
            const preset = gradientPresets[img.instVars.GradientPreset];
            if (!preset)
                return;
            effect.setParameter(0, [preset.start.r, preset.start.g, preset.start.b]);
            effect.setParameter(1, preset.start.a);
            effect.setParameter(2, [preset.end.r, preset.end.g, preset.end.b]);
            effect.setParameter(3, preset.end.a);
        });
        [...runtime.objects.SpritePresets.instances()].forEach(img => {
            img.setAnimation(spritePresets[img.instVars.SpritePreset] ?? img.animationName);
        });
        [...runtime.objects.BoolPresets.instances()].forEach(img => {
            img.visible = boolPresets[img.instVars.BoolPreset] ?? img.visible;
        });
    }
    update(dt) {
    }
    onLayoutEnded() {
    }
    playSoundIfCan(soundName) {
        playSoundIfCan(this.runtime, soundName);
    }
    async delay(seconds, action) {
        await this.animator.delay(seconds).asPromise();
        action?.();
    }
    findObjectOfType(typeName) {
        // @ts-ignore
        return this.runtime.objects[typeName].getFirstInstance() ?? null;
    }
    findObjectsOfType(typeName) {
        // @ts-ignore
        return [...this.runtime.objects[typeName].instances()].cast();
    }
}
