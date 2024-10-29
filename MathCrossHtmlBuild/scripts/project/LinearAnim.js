import { clamp } from './Utils.js';
export default class LinearMoveAnim {
    speed;
    updateCallback;
    finishCallback;
    normalized = 0;
    finished = false;
    constructor(speed, updateCallback, finishCallback = null) {
        this.speed = speed;
        this.updateCallback = updateCallback;
        this.finishCallback = finishCallback;
        this.normalized = 0;
        this.finished = false;
    }
    update(dt) {
        if (this.finished)
            return;
        this.normalized = clamp(this.normalized + dt * this.speed, 0, 1);
        if (this.updateCallback) {
            this.updateCallback(this.normalized);
        }
        if (this.normalized >= 1) {
            this.finished = true;
            if (this.finishCallback)
                this.finishCallback();
        }
    }
}
