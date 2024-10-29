var SimpleEvent = InstanceType.SimpleEvent;
const events = new Map();
const objectVsCallback = new Map();
export function registerEvent(runtime, event, callback) {
    let listener = (e) => {
        if (e.instance.instVars.Name !== event)
            return;
        // @ts-ignore
        callback(e.instance["data"]);
    };
    runtime.objects.SimpleEvent.addEventListener("instancedestroy", listener);
    events.set(callback, listener);
}
export function unregisterEvent(runtime, event) {
    if (!events.has(event))
        return;
    runtime.objects.SimpleEvent.removeEventListener("instancedestroy", events.get(event));
    events.delete(event);
}
export function sendEvent(runtime, event, data) {
    const eventInstance = runtime.objects.SimpleEvent.createInstance(0, 0, 0);
    // @ts-ignore
    eventInstance["data"] = data;
    eventInstance.instVars.Name = event;
    eventInstance.destroy();
}
export function registerEventWithObject(runtime, object, event, callback) {
    if (!objectVsCallback.has(object)) {
        objectVsCallback.set(object, new Map());
    }
    if (objectVsCallback.get(object).has(event)) {
        return;
    }
    objectVsCallback.get(object).set(event, callback);
    registerEvent(runtime, event, callback);
}
export function unregisterEventWithObject(runtime, object, event) {
    const callback = objectVsCallback.get(object)?.get(event);
    if (!callback) {
        return;
    }
    objectVsCallback.get(object).delete(event);
    unregisterEvent(runtime, callback);
}
