import Color from "../game/color.js";
import Gradient from "../game/gradient.js";
import { loadTextFileFromPath } from "../FileUtils.js";
export default class Presets {
    keyVsValues = new Map();
    childPresets = [];
    keyAndValues = [];
    get allKeyValues() {
        return [...this.childPresets.reverse().flatMap(c => c.allKeyValues), ...this.keyAndValues].distinctBy(c => c.key);
    }
    static async load(runtime, type, files) {
        const json = await Presets.toJson(runtime, files);
        return json ? this.create(type, json) : new Presets();
    }
    static create(type, json) {
        return new Presets().with(p => {
            p.keyAndValues = JSON.parse(json.value).keyAndValues.map((d) => KeyAndValue.create(type, d.key, d.value, d["useAnotherPreset"], d["sourcePresetKey"], d["overrides"]));
            p.childPresets = json.children.map(c => Presets.create(type, c));
            p.keyVsValues = new Map(p.allKeyValues.filter(kv => kv.isValid(p.allKeyValues)).map(c => [c.key, c.getValue(p.allKeyValues, undefined)]));
            p.keyVsValues.forEach((v, k) => p[k] = v);
        });
    }
    static async toJson(runtime, files) {
        const children = (await Promise.all(files.children.map(async (c) => await Presets.toJson(runtime, c)))).filter(c => !!c);
        const value = await this.getFileContent(runtime, files.value);
        return value ? new ParentChildrenStructure(value, children) : undefined;
    }
    static async getFileContent(runtime, path) {
        try {
            return await loadTextFileFromPath(runtime, path);
        }
        catch (e) {
            // console.error("catch:", e);
        }
        return undefined;
    }
    hasKey(key) {
        return this.keyVsValues.has(key);
    }
    get(key, defaultValue = undefined) {
        return this.keyVsValues.get(key) ?? null;
    }
}
class ParentChildrenStructure {
    value;
    children;
    constructor(value, children = []) {
        this.value = value;
        this.children = children;
    }
}
class KeyAndValue {
    key;
    value;
    useAnotherPreset;
    sourcePresetKey;
    overrides;
    constructor(key, value, useAnotherPreset, sourcePresetKey, overrides) {
        this.key = key;
        this.value = value;
        this.useAnotherPreset = useAnotherPreset;
        this.sourcePresetKey = sourcePresetKey;
        this.overrides = overrides;
    }
    static create(type, key, value, useAnotherPreset, sourcePresetKey, overrides) {
        switch (type) {
            case "Color":
                return new ColorKeyAndValue(key, value, useAnotherPreset, sourcePresetKey, overrides);
            case "Gradient":
                return new GradientKeyAndValue(key, value, useAnotherPreset, sourcePresetKey, overrides);
            case "Animation":
                return new AnimationKeyAndValue(key, value, useAnotherPreset, sourcePresetKey, overrides);
            default:
                return new DirectKeyAndValue(key, value, useAnotherPreset, sourcePresetKey, overrides);
        }
    }
    isValid(values) {
        return true;
    }
    getValue(values, keys = null) {
        keys ??= new Set();
        if (!this.useAnotherPreset) {
            return !!this.key ? this.convertToValue(this.value) : null;
        }
        if (keys.has(this.key)) {
            throw new Error("Circular reference detected");
        }
        keys.add(this.key);
        const item = values.find(c => c.key === this.sourcePresetKey);
        let value = item?.getValue(values, keys);
        if (value && Object.keys(value).length && this.overrides)
            value = Object.assign({ ...value }, this.overrides);
        return value;
    }
    convertToValue(value) {
        throw new Error("Not implemented");
    }
}
class DirectKeyAndValue extends KeyAndValue {
    convertToValue(value) {
        return value;
    }
}
class AnimationKeyAndValue extends KeyAndValue {
    isValid(values) {
        const value = this.getValue(values);
        return super.isValid(values) && !!value && Object.keys(value).length > 0;
    }
    convertToValue(value) {
        return value;
    }
}
class ColorKeyAndValue extends KeyAndValue {
    convertToValue(value) {
        console.log('convert_color', value);
        return Object.keys(value).some(k => k === "r") ? new Color(value.r, value.g, value.b, value.a) :
            typeof value === "string" ? Color.fromHex(value) :
                Color.fromHex(value["hex"], value["a"]);
    }
}
class GradientKeyAndValue extends KeyAndValue {
    convertToValue(value) {
        return new Gradient(new Color(value.start.r, value.start.g, value.start.b, value.start.a), new Color(value.end.r, value.end.g, value.end.b, value.end.a));
    }
}
