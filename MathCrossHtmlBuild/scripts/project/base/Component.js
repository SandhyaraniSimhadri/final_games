import { playSoundIfCan } from "../utils/game_utils.js";
import Animator from "../Animator.js";
import { YieldInstruction } from "./YieldInstruction.js";
export default class Component {
    static allComponents = [];
    enabled = true;
    // @ts-ignore
    gameObject;
    updatables = [];
    coroutines = [];
    constructor() {
        Component.allComponents.push(this);
    }
    get types() {
        return ["IUpdatable", "IUpdatableProvider", "Component"];
    }
    get runtime() {
        return this.gameObject.runtime;
    }
    static get(type) {
        return Component.allComponents.find(c => c.types.includes(type)) ?? null;
    }
    awake() {
    }
    find() {
        this.updatables.filter(u => u).forEach(u => u);
    }
    start() {
    }
    update() {
        this.updatables.forEach(u => u.update(this.runtime.dt));
    }
    onDestroy() {
        Component.allComponents.remove(this);
    }
    getComponent(type) {
        // @ts-ignore
        return this.gameObject.getComponent(type);
    }
    getComponents(type) {
        // @ts-ignore
        return this.gameObject.getComponents(type);
    }
    findObjectOfType(typeName) {
        // @ts-ignore
        return this.runtime.objects[typeName].getFirstInstance() ?? null;
    }
    findObjectsOfType(typeName) {
        // @ts-ignore
        return [...this.runtime.objects[typeName].instances()].cast();
    }
    addToUpdatables(updatable) {
        this.updatables.push(updatable);
    }
    removeFromUpdatables(updatable) {
        this.updatables.remove(updatable);
    }
    playSoundIfCan(soundName) {
        playSoundIfCan(this.runtime, soundName);
    }
    startCoroutine(generator, onComplete, token = { cancel: false }) {
        console.log("starting coroutine 1");
        token ??= { cancel: false };
        const runInfo = { current: undefined };
        const gs = Component.runCoroutine(generator, runInfo, token);
        const coroutineInfo = new CoroutineInfo(gs, token, runInfo);
        this.coroutines.push(coroutineInfo);
        this.runAsyncGenerator(gs).then(() => {
            onComplete?.call(this);
            coroutineInfo.complete();
            return this.coroutines.remove(coroutineInfo);
        });
        return coroutineInfo;
    }
    stopCoroutine(coroutineInfo) {
        if (!this.coroutines.includes(coroutineInfo))
            return;
        coroutineInfo.cancel();
        this.coroutines.remove(coroutineInfo);
    }
    stopAllCoroutines() {
        this.coroutines.forEach(c => c.cancel());
        this.coroutines.clear();
    }
    async runAsyncGenerator(gs) {
        for await (let g of gs) {
        }
    }
    static async *runCoroutine(generator, runInfo = {}, token = {}) {
        let result = generator.next();
        console.log("starting coroutine");
        while (!result.done) {
            if (token.cancel) {
                return;
            }
            runInfo.current = result.value;
            yield result.value.asPromise();
            result = generator.next();
        }
    }
}
export class CoroutineInfo {
    generator;
    token;
    runInfo;
    ended = [];
    _running = true;
    get running() {
        return this._running;
    }
    set running(value) {
        this._running = value;
        if (!value) {
            this.ended.forEach(f => f(this));
        }
    }
    constructor(generator, token, runInfo) {
        this.generator = generator;
        this.token = token;
        this.runInfo = runInfo;
    }
    cancel() {
        this.token.cancel = true;
        this.runInfo.current?.cancel();
        this.running = false;
    }
    complete() {
        this.running = false;
    }
    asPromise() {
        return new Promise(resolve => {
            if (!this.running) {
                resolve();
                return;
            }
            this.ended.push(() => resolve());
        });
    }
}
