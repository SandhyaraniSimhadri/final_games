//Play sound effect
export function playSound(runtime, name) {
    if (runtime.globalVars.SoundDisable)
        return;
    const ist = runtime.objects.SoundEffect.createInstance(0, 0, 0);
    ist.instVars.Name = name;
    ist.destroy();
}
export function sendEvent(runtime, name, data = null) {
    const event = runtime.objects.SimpleEvent.createInstance(0, 0, 0);
    event.instVars.Name = name;
    if (data) { // @ts-ignore
        event.data = data;
    }
    event.destroy();
}
