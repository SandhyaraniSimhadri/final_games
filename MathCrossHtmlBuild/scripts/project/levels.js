import { PuzzleInfo } from "./common_models.js";
export default class Levels {
    static _default;
    ready = [];
    static get default() {
        return this._default ??= new Levels().with(l => l.loadFromFile('levels.json').then());
    }
    levels = [];
    _isReady = false;
    get isReady() {
        return this._isReady;
    }
    set isReady(value) {
        if (this._isReady === value)
            return;
        this._isReady = value;
        if (value)
            this.ready.forEach(f => f(this));
    }
    get runtime() {
        return window.gRuntime;
    }
    constructor() {
    }
    async loadFromFile(path = 'levels.json') {
        this.isReady = false;
        this.levels.clear();
        const url = await this.runtime.assets.getProjectFileUrl(path);
        const response = await fetch(url);
        const json = await response.text();
        this.levels.push(...JSON.parse(json).levels.map((l) => {
            return { level: l.level, info: PuzzleInfo.create(l.info) };
        }));
        this.isReady = true;
    }
    async loadFromJson(json) {
        this.isReady = false;
        this.levels.clear();
        this.levels.push(...JSON.parse(json).levels.map((l) => {
            return { level: l.level, info: PuzzleInfo.create(l.info) };
        }));
        this.isReady = true;
    }
    async loadFromStorage(key = "Levels") {
        this.isReady = false;
        const data = await this.runtime.storage.getItem(key);
        if (data === null) {
            this.isReady = true;
            return;
        }
        this.levels.clear();
        this.levels.push(...data["levels"].map((l) => {
            return { level: l.level, info: PuzzleInfo.create(l.info) };
        }));
        this.isReady = true;
    }
    async saveToStorage(key = "Levels") {
        this.isReady = false;
        await this.runtime.storage.setItem(key, { levels: this.levels });
        this.isReady = true;
        console.log(JSON.stringify({ levels: this.levels }));
    }
    getLevel(level) {
        return this.levels.find(l => l.level === level);
    }
    addOrUpdate(level, info) {
        const index = this.levels.findIndex(l => l.level === level);
        if (index !== -1) {
            this.levels[index].info = PuzzleInfo.create(info);
        }
        else {
            this.levels.push({ level, info: PuzzleInfo.create(info) });
        }
        this.levels.sort((a, b) => a.level - b.level);
    }
}
