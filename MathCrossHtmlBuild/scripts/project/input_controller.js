import Vector from "./Vector.js";
export default class InputController {
    runtime;
    static _instance;
    static get instance() {
        if (!this._instance) {
            this._instance = new InputController(window.gRuntime);
        }
        return this._instance;
    }
    pointerDown = [];
    pointerUp = [];
    pointerMove = [];
    pointerCancel = [];
    mouseWheel = [];
    static mousePosition = new Vector(0, 0);
    constructor(runtime) {
        this.runtime = runtime;
        new MultiEventHandler([
            [runtime, "pointerdown", (e) => this.onPointerDown(e)],
            [runtime, "pointermove", (e) => this.onPointerMove(e)],
            [runtime, "pointerup", (e) => this.onPointerUp(e)],
            [runtime, "pointercancel", (e) => this.onPointerCancel(e)],
            [runtime, "wheel", (e) => this.onMouseWheel(e)]
        ]);
    }
    onPointerDown(e) {
        // if (e.pointerId === 1)
        InputController.mousePosition = new Vector(e.clientX, e.clientY);
        this.pointerDown.forEach((handler) => handler(e));
    }
    onPointerMove(e) {
        // if (e.pointerId === 1)
        InputController.mousePosition = new Vector(e.clientX, e.clientY);
        this.pointerMove.forEach((handler) => handler(e));
    }
    onPointerUp(e) {
        // if (e.pointerId === 1)
        InputController.mousePosition = new Vector(e.clientX, e.clientY);
        this.pointerUp.forEach((handler) => handler(e));
    }
    onPointerCancel(e) {
        if (e.pointerId === 1)
            InputController.mousePosition = new Vector(e.clientX, e.clientY);
        this.pointerCancel.forEach((handler) => handler(e));
    }
    onMouseWheel(e) {
        this.mouseWheel.forEach((handler) => handler(e));
    }
}
export class MultiEventHandler {
    eventHandlers;
    constructor(arr) {
        this.eventHandlers = arr;
        for (const [target, eventName, handler] of this.eventHandlers) {
            target.addEventListener(eventName, handler);
        }
    }
    remove() {
        for (const [target, eventName, handler] of this.eventHandlers) {
            target.removeEventListener(eventName, handler);
        }
    }
}
