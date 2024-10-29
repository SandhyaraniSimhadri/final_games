export default class PrefManager {
    runtime;
    ready = [];
    _isReady = false;
    data = {};
    set isReady(value) {
        if (this._isReady === value)
            return;
        this._isReady = value;
        if (value)
            this.ready.forEach(f => f(this));
    }
    get isReady() {
        return this._isReady;
    }
    constructor(runtime) {
        this.runtime = runtime;
    }
    async load() {
        this.isReady = false;
        this.data = await this.runtime.storage.getItem("pref_data") || {};
        this.isReady = true;
    }
    async save() {
        await this.runtime.storage.setItem("pref_data", this.data);
    }
    hasItem(key) {
        return this.data[key] !== undefined;
    }
    setItem(key, value) {
        this.data[key] = value;
        this.save().then(() => {
        });
    }
    getItem(key, def) {
        return this.data[key] === undefined ? def : this.data[key];
    }
    removeItem(key) {
        delete this.data[key];
        this.save().then(() => {
        });
    }
}
