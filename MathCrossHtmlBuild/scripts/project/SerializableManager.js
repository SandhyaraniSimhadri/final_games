import { prefs } from "./Main.js";
export default class SerializableManager {
    //make this singleton
    static _instance;
    constructor() {
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SerializableManager();
        }
        return this._instance;
    }
    keyVsSerializableInfo = new Map();
    register(key, serializable, updatableEvent = null) {
        if (!key || !serializable)
            return;
        if (this.keyVsSerializableInfo.has(key) || [...this.keyVsSerializableInfo.values()].some(v => v.serializable === serializable))
            return;
        const updatableEventOnUpdated = this.updatableEventOnUpdated.bind(this);
        if (updatableEvent) {
            updatableEvent.updated.push(updatableEventOnUpdated);
        }
        this.keyVsSerializableInfo.set(key, new SerializableInfo(serializable, updatableEvent, updatableEvent ? updatableEventOnUpdated : null));
    }
    registerIfNotAlready(key, serializable, updatableEvent = null) {
        if (this.haveAlreadyRegisteredKey(key) || this.haveAlreadyRegisteredSerializable(serializable))
            return;
        this.register(key, serializable, updatableEvent);
    }
    haveAlreadyRegisteredSerializable(serializable) {
        return [...this.keyVsSerializableInfo.values()].some(v => v.serializable === serializable);
    }
    haveAlreadyRegisteredKey(key) {
        return this.keyVsSerializableInfo.has(key);
    }
    unregister(key) {
        this.getMatchedPairsForKey(key).forEach(([k, v]) => {
            if (v.updatableEvent) {
                v.updatableEvent.updated = v.updatableEvent.updated.filter(e => e !== v.callback);
            }
            this.keyVsSerializableInfo.delete(k);
        });
    }
    updatableEventOnUpdated(e) {
        this.save(this.getKeyForUpdatableEvent(e));
    }
    getKeyForUpdatableEvent(e) {
        return [...this.keyVsSerializableInfo.entries()].find(([k, v]) => v.updatableEvent === e)?.[0] || null;
    }
    save(key = null) {
        this.getMatchedPairsForKey(key).forEach(([k, v]) => {
            prefs.setItem(this.getFullKey(k), v.serializable.toSave());
        });
    }
    getFullKey(key) {
        return `${this.constructor.name}_${key}`;
    }
    getMatchedPairsForKey(key = null) {
        return [...this.keyVsSerializableInfo.entries()].filter(([k, v]) => !key || k === key);
    }
    restore(key = null) {
        this.getMatchedPairsForKey(key).forEach(([k, v]) => {
            v.serializable.restore(this.getSaveData(k));
        });
    }
    getSaveData(k) {
        return prefs.getItem(this.getFullKey(k), '');
    }
    haveSaveDataForKey(k) {
        return !!this.getSaveData(k);
    }
    haveSaveDataForSerializable(s) {
        return !!this.getSaveData(this.getKeyForSerializable(s));
    }
    getKeyForSerializable(s) {
        return [...this.keyVsSerializableInfo.entries()].find(([k, v]) => v.serializable === s)?.[0] || null;
    }
    clearData(key) {
        this.getMatchedPairsForKey(key).forEach(([k, v]) => {
            prefs.removeItem(this.getFullKey(k));
        });
    }
    clearAllData() {
        [...this.keyVsSerializableInfo.keys()].forEach(k => this.clearData(k));
    }
    unregisterAll() {
        [...this.keyVsSerializableInfo.entries()].forEach(([k, v]) => {
            this.unregister(k);
        });
    }
}
class SerializableInfo {
    serializable;
    updatableEvent;
    callback;
    constructor(serializable, updatableEvent, callback) {
        this.serializable = serializable;
        this.updatableEvent = updatableEvent;
        this.callback = callback;
    }
}
