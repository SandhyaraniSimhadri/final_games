import { lerp, clamp } from './Utils.js';
export default class LerpAnim {
    speed;
    start;
    end;
    updateCallback;
    finishCallback;
    normalized;
    finished;
    constructor(speed, start, end, updateCallback, finishCallback = null) {
        this.speed = speed;
        this.start = start;
        this.end = end;
        this.updateCallback = updateCallback;
        this.finishCallback = finishCallback;
        this.end = end;
        this.normalized = start;
        this.speed = speed;
        this.finished = false;
    }
    update(dt) {
        if (this.finished)
            return;
        this.normalized = clamp(lerp(this.normalized, this.end, dt * this.speed), 0, 1);
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
