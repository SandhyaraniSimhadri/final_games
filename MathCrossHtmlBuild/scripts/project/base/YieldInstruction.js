import Animator from "../Animator.js";
var fade_out_box = InstanceType.fade_out_box;
export class YieldInstruction {
    ended = [];
    _keepWaiting = true;
    get keepWaiting() {
        return this._keepWaiting;
    }
    set keepWaiting(value) {
        this._keepWaiting = value;
        if (!value) {
            this.ended.forEach(f => f(this));
        }
    }
    cancel() {
        console.log("cancelling", this);
        this.keepWaiting = false;
    }
    asPromise() {
        return new Promise(resolve => {
            if (!this.keepWaiting) {
                resolve();
                return;
            }
            this.ended.push(() => resolve());
        });
    }
    *toGenerator() {
        yield this;
    }
    static parallel(...instructions) {
        return new ParallelYieldInstruction(...instructions);
    }
    static series(...instructions) {
        return new SeriesYieldInstruction(...instructions);
    }
    static fromGenerator(generator, token = { cancel: false }) {
        return new GeneratorYieldInstruction(generator, token);
    }
}
export class GeneratorYieldInstruction extends YieldInstruction {
    generator;
    token;
    current;
    constructor(generator, token = { cancel: false }) {
        super();
        this.generator = generator;
        this.token = token;
        this.token ??= { cancel: false };
    }
    cancel() {
        super.cancel();
        this.current?.cancel();
        this.token.cancel = true;
    }
    async runCoroutine(generator, runInfo = {}, token = {}) {
        let result = generator.next();
        console.log("starting coroutine");
        while (!result.done) {
            if (token.cancel) {
                return;
            }
            this.current = result.value;
            await result.value.asPromise();
            result = generator.next();
        }
        this.current = undefined;
    }
}
export class PromiseYieldInstruction extends YieldInstruction {
    token;
    promise;
    constructor(promise, token = { cancel: false }) {
        super();
        this.token = token;
        this.token ??= { cancel: false };
        this.promise = promise(this.token);
        console.log("starting");
        this.promise.then(() => {
            this.keepWaiting = false;
            console.log("resolved");
        });
    }
    cancel() {
        super.cancel();
        this.token.cancel = true;
    }
}
export class ParallelYieldInstruction extends YieldInstruction {
    instructions;
    token = {
        cancel: false
    };
    constructor(...instructions) {
        super();
        this.instructions = instructions.map(instruction => instruction());
        this.instructions.forEach(instruction => instruction.ended.push(() => {
            if (this.instructions.every(i => !i.keepWaiting)) {
                this.keepWaiting = false;
            }
        }));
    }
    cancel() {
        super.cancel();
        this.token.cancel = true;
        this.instructions.forEach(instruction => instruction.cancel());
    }
}
export class SeriesYieldInstruction extends YieldInstruction {
    instructions;
    token = {
        cancel: false
    };
    currentInstruction;
    constructor(...instructions) {
        super();
        this.instructions = instructions;
        this.run().then();
    }
    async run() {
        for (let i = 0; i < this.instructions.length; i++) {
            if (this.token.cancel) {
                return;
            }
            this.currentInstruction = this.instructions[i]();
            await this.currentInstruction.asPromise();
        }
        this.keepWaiting = false;
    }
    cancel() {
        super.cancel();
        this.token.cancel = true;
        this.currentInstruction?.cancel();
    }
}
export class WaitForSeconds extends YieldInstruction {
    token = { cancel: false };
    promise;
    constructor(time, provider) {
        super();
        this.promise = Animator.delayFunc(provider, time, this.token).then(() => {
            this.keepWaiting = false;
        });
    }
    cancel() {
        super.cancel();
        this.token.cancel = true;
    }
}
export class WaitUntil extends YieldInstruction {
    token = { cancel: false };
    promise;
    constructor(func, provider) {
        super();
        this.promise = Animator.waitUntilFunc(provider, func, this.token).then(() => {
            this.keepWaiting = false;
        });
    }
    cancel() {
        super.cancel();
        this.token.cancel = true;
    }
}
