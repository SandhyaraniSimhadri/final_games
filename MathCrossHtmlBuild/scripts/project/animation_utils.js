import Animator from "./Animator.js";
import { curves } from "./Curves.js";
import { WaitForSeconds, WaitUntil, YieldInstruction } from "./base/YieldInstruction.js";
import Vector from "./Vector.js";
import { randFloat } from "./Utils.js";
import { findObjectOfType, findObjectsAuto } from "./utils/game_utils.js";
function applyValues(values, instance, others, isEnd = false) {
    [...values.keys()].forEach(key => {
        if (keySetters.has(key)) {
            keySetters.get(key)?.(instance, getValue(values.get(key), others), isEnd);
        }
        else { // @ts-ignore
            instance[key] = getValue(values.get(key), others);
        }
    });
}
export function animationSingle(provider, instance, animation, others, token = undefined) {
    return animateValues(provider, animation, others, (values) => {
        applyValues(values, instance, others);
    }, values => {
        applyValues(values, instance, others, true);
    }, token);
}
function animationAuto(provider, animationInfo, instances, others, token = undefined) {
    if (animationInfo['groupType'] === 'SERIES_ITEMS') {
        return YieldInstruction.fromGenerator(animationSeries(provider, instances, animationInfo.animation, animationInfo.delay, others, token, animationInfo.reverse, animationInfo.start, animationInfo.end), token);
    }
    console.log('running_animation_auto', provider, instances, animationInfo, others, token);
    return animation(provider, instances && Array.isArray(instances) ? instances.firstOrDefault() : instances, animationInfo, others, token);
}
export function animation(provider, instance, animationInfo, others, token = undefined) {
    console.log('running_animation_' + instance?.objectType?.name, provider, instance, animationInfo, others, token);
    if (animationInfo['groupType'] === 'COMPLEX') {
        return YieldInstruction.parallel(...animationInfo.animation.map((a) => () => animationAuto(provider, a, undefined, undefined, token)));
    }
    if (!instance)
        console.log('running_animation_target', findObjectsAuto(window.gRuntime, animationInfo.target));
    instance ??= findObjectsAuto(window.gRuntime, animationInfo.target).firstOrDefault();
    animationInfo = resolveAnimationInfo(animationInfo, others, instance);
    let anim = undefined;
    // console.log("animation" + instance.objectType.name, animationInfo, others);
    if (!animationInfo["groupType"]) {
        anim = animationSingle(provider, instance, animationInfo, others, token);
    }
    else {
        if (animationInfo["groupType"] === "PARALLEL") {
            anim = YieldInstruction.parallel(...animationInfo["animation"].map((a) => () => animation(provider, instance, a, others, token)));
        }
        else {
            anim = YieldInstruction.series(...animationInfo["animation"].map((a) => () => animation(provider, instance, a, others, token)));
        }
    }
    if (animationInfo.children) {
        anim = YieldInstruction.parallel(() => anim, ...animationInfo.children.map((c) => {
            const instances = instance.findChildrenAuto(c.target);
            return () => animationAuto(provider, c, instances, undefined, token);
        }));
    }
    return anim;
}
export function* animationSeries(provider, instances, animationInfo, delay, others, token = undefined, reverse, start, end) {
    let count = 0;
    if (reverse)
        instances = instances.reverse();
    if (start)
        yield animation(provider, instances, start, others, token);
    for (let i = 0; i < instances.length; i++) {
        const info = resolveAnimationInfo(animationInfo.deepClone(), others?.[i], instances[i]);
        const yieldInstruction = animation(provider, instances[i], info, others?.[i], token);
        yieldInstruction.asPromise().then(() => {
            count += 1;
        });
        yield new WaitForSeconds(delay, provider);
        console.log('series :' + i);
    }
    yield new WaitUntil(() => count >= instances.length, provider);
    if (end)
        yield animation(provider, instances, end, others, token);
}
function resolveAnimationInfo(animationInfo, others, object) {
    if (animationInfo['groupType'])
        return animationInfo;
    if (animationInfo['duration'] === undefined) {
        animationInfo['duration'] = 1;
    }
    if (animationInfo['curve'] === undefined) {
        animationInfo['curve'] = "LINEAR";
    }
    if (animationInfo['to'] !== undefined) {
        others = others ?? { target: {} };
        others.target ??= {};
        others.target = Object.assign(others.target, animationInfo['to']);
    }
    if (others === undefined || others.target === undefined)
        return animationInfo;
    if (others.start === undefined) {
        others.start = {};
        Object.keys(others.target).forEach(key => others.start[key] = object[key]);
    }
    if (animationInfo['from'] !== undefined) {
        others.start = Object.assign(others.start, animationInfo['from']);
    }
    if (animationInfo.points !== undefined)
        return animationInfo;
    // const propertyPoints = animationInfo['points'] !== undefined ? toPropertyPoints(animationInfo.points) : new Map();
    let missingStartEndProperties = [...Object.keys(others.start)];
    if (!missingStartEndProperties.length)
        return animationInfo;
    const startPoint = { time: 0 };
    const endPoint = { time: animationInfo.duration };
    missingStartEndProperties.forEach(key => {
        // @ts-ignore
        startPoint[key] = typeof others.start[key] !== "number" ?
            others.start[key].with((item) => item.type = "ABSOLUTE") :
            keySetters.has(key) ?
                {
                    type: "ABSOLUTE",
                    value: others.start[key]
                } : others.start[key];
        // @ts-ignore
        endPoint[key] = typeof others.target[key] !== "number" ? others.target[key].with((item) => item.type = "ABSOLUTE") : keySetters.has(key) ? {
            type: "ABSOLUTE",
            value: others.target[key]
        } : others.target[key];
    });
    animationInfo.points = animationInfo.points ? [startPoint, ...animationInfo.points, endPoint] : [startPoint, endPoint];
    animationInfo.points = animationInfo.points.sort((p1, p2) => p1.time - p2.time);
    const map = animationInfo.points.groupBy((p) => p.time + "");
    animationInfo.points = [...map.keys()].flatMap((key) => Object.assign(map.get(key).first(), ...map.get(key).skip(1)));
    // console.log("points:", animationInfo.points, propertyPoints);
    return animationInfo;
}
function animateValues(provider, animation, others, onUpdate, onBeforeComplete, token = undefined) {
    const propertyPoints = toPropertyPoints(animation.points ?? []);
    console.log("propertyPoints", propertyPoints);
    animation.duration = animation.duration ?? 1;
    return Animator.curveAnimFuncYield(provider, curves[animation.curve], animation.duration / (animation.speed !== undefined ? animation.speed : 1), (r) => {
        const t = r * animation.duration;
        const values = [...propertyPoints.keys()].map(key => [key,
            valueToProperty(t, propertyPoints.get(key), others)
        ]).filter(([_, value]) => value).toMap(([key]) => key, ([_, value]) => value);
        onUpdate(values, r);
        console.log("onUpdate:", r, values);
    }, () => {
        const values = [...propertyPoints.keys()].toMap(key => key, key => propertyPoints.get(key).maxItem(p => p.time).value);
        console.log("on_before_end:", values, propertyPoints);
        onUpdate?.(values);
    }, token);
}
function valueToProperty(t, points, others) {
    let baseIndex = points.findBaseIndex(t, item => item.time);
    if (baseIndex === -1)
        return;
    if (baseIndex === points.length - 1)
        baseIndex -= 1;
    return lerp(getValue(points[baseIndex].value, others), getValue(points[baseIndex + 1].value, others), Math.min((t - points[baseIndex].time) / (points[baseIndex + 1].time - points[baseIndex].time)));
}
const keySetters = new Map();
// map => {
keySetters.set("position", (instance, value, isEnd = false) => {
    if (instance.__originalPosition === undefined) {
        instance.__originalPosition = new Vector(instance.x, instance.y);
    }
    instance.x = value.x !== undefined ? value.x + (value.type === undefined || value.type === "RELATIVE" ? instance.__originalPosition.x : 0) : instance.x;
    instance.y = value.y !== undefined ? value.y + (value.type === undefined || value.type === "RELATIVE" ? instance.__originalPosition.y : 0) : instance.y;
    if (isEnd)
        delete instance.__originalPosition;
});
keySetters.set("translate", (instance, value, isEnd = false) => {
    instance.translate = new Vector(value.x ?? instance.translate.x, value.y ?? instance.translate.y);
});
keySetters.set("scale", (instance, value, isEnd = false) => {
    if (instance.__originalScale === undefined) {
        instance.__originalScale = new Vector(instance.scale.x, instance.scale.y);
    }
    if (typeof value === 'number') {
        value = { x: value, y: value };
    }
    console.log("set scale", value, instance.__originalScale, instance.scale, value.x !== undefined ? value.x * (value.type === undefined || value.type === "RELATIVE" ? instance.__originalScale.x : 1) : instance.scale.x);
    instance.scale = new Vector(value.x !== undefined ? value.x * (value.type === undefined || value.type === "RELATIVE" ? instance.__originalScale.x : 1)
        : instance.scale.x, value.y !== undefined ? value.y * (value.type === undefined || value.type === "RELATIVE" ? instance.__originalScale.y : 1) : instance.scale.y);
    if (isEnd)
        delete instance.__originalScale;
});
keySetters.set('angle', (instance, value, isEnd = false) => {
    if (instance.__originalAngle === undefined) {
        instance.__originalAngle = instance.angleDegrees;
        console.log("original angle", instance, instance.__originalAngle, instance.angleDegrees, value);
    }
    // if (value.type !== undefined) {
    //     value.x = value.value.x;
    //     value.y = value.value.y;
    // }
    instance.angleDegrees = (value.type !== undefined ? value.value : value) + (value.type === undefined || value.type === "RELATIVE" ? instance.__originalAngle : 0);
    if (isEnd) {
        console.log("delete original angle", instance, instance.__originalAngle, instance.angleDegrees, value);
        delete instance.__originalAngle;
    }
});
keySetters.set('size', (instance, value, isEnd = false) => {
    if (instance.__originalSize === undefined) {
        instance.__originalSize = new Vector(instance.width, instance.height);
    }
    //
    // if (value.type !== undefined) {
    //     value.x = value.value.x;
    //     value.y = value.value.y;
    // }
    instance.width = value.x !== undefined ? value.x + (value.type === undefined || value.type === "RELATIVE" ? instance.__originalSize.x : 0) : instance.width;
    instance.height = value.y !== undefined ? value.y + (value.type === undefined || value.type === "RELATIVE" ? instance.__originalSize.y : 0) : instance.height;
    if (isEnd)
        delete instance.__originalSize;
});
keySetters.set('opacity', (instance, value, isEnd) => {
    if (instance.__originalOpacity === undefined) {
        instance.__originalOpacity = instance.opacity;
    }
    instance.opacity = (value.type !== undefined ? value.value : value) + (value.type === undefined || value.type === "RELATIVE" ? instance.__originalOpacity : 0);
    if (isEnd)
        delete instance.__originalOpacity;
});
keySetters.set('groupOpacity', (instance, value, isEnd) => {
    if (instance.__originalGroupOpacity === undefined) {
        instance.__originalGroupOpacity = instance.groupOpacity;
    }
    instance.groupOpacity = (value.type !== undefined ? value.value : value) * (value.type === undefined || value.type === "RELATIVE" ? instance.__originalGroupOpacity : 1);
    if (isEnd)
        delete instance.__originalGroupOpacity;
});
// });
function toPropertyPoints(points) {
    const propertyPoints = new Map();
    points = points.sort((p1, p2) => p1.time - p2.time);
    const map = points.groupBy((p) => p.time + "");
    // map.forEach((value, key) => {
    //     map.set(key, value.sort((p1: any, p2: any) => p1.time - p2.time))
    // });
    points = [...map.keys()].flatMap((key) => map.get(key));
    points.forEach((p) => {
        const map = pointToMap(p);
        [...map.keys()].forEach(key => {
            if (!propertyPoints.has(key)) {
                propertyPoints.set(key, []);
            }
            propertyPoints.get(key).push({ time: p.time, value: map.get(key) });
        });
    });
    propertyPoints.forEach((value, key) => {
        propertyPoints.set(key, value.sort((p1, p2) => p1.time - p2.time));
    });
    return propertyPoints;
}
function pointToMap(point) {
    let map = new Map();
    Object.keys(point).forEach(key => {
        if (key === 'time')
            return;
        map.set(key, point[key]);
    });
    return map;
}
function lerp(a, b, t) {
    if (typeof a !== 'number') {
        const object = {};
        // @ts-ignore
        Object.keys(a).forEach(key => {
            if (typeof a[key] === 'number') { // @ts-ignore
                object[key] = lerp(a[key], b[key], t);
            }
            else { // @ts-ignore
                object[key] = a[key];
            }
        });
        return object;
    }
    return a + (b - a) * t;
}
function negative(value) {
    if (typeof value !== 'number') {
        const object = {};
        // @ts-ignore
        Object.keys(value).forEach(key => object[key] = negative(value[key]));
        return object;
    }
    return -value;
}
function getValue(value, others) {
    if (!value["functionType"])
        return value;
    if (value["_return"])
        return value["_return"];
    if (value["functionType"] === "RANDOM") {
        value._return = value.value.getRandom();
    }
    else if (value["functionType"] === "RANGE") {
        const delta = 1 / value.value.length;
        const rand = randFloat(0, 1);
        const baseIndex = value.value.findBaseIndex(rand, (item, i) => i * delta);
        value._return = baseIndex === value.value.length - 1 ? value.value[baseIndex] :
            lerp(value.value[baseIndex], value.value[baseIndex + 1], (rand - baseIndex * delta) / delta);
    }
    else if (value["functionType"] === "DIRECTIONAL") {
        value._return = others ? (others["positive"] ? value.value : negative(value.value)) : value.value;
        console.log("directional", value._return, others, others && others["positive"] ? value.value : -value.value, value);
    }
    else if (value["functionType"] === "EVALUATE") {
        const isObject = value.value.startsWith("{");
        const evString = value.value.replaceAll("start", "others.start").replaceAll("target", "others.target").replaceAll("{", "").replaceAll("}", "");
        const evs = evString.split(",");
        value._return = {};
        if (isObject) {
            evs.forEach((ev) => {
                const [key, val] = ev.split(":");
                value._return[key] = eval(val);
            });
        }
        else {
            value._return = eval(evString);
            console.log("evaluating", evString, value._return);
        }
        // value._return = eval(evString);
    }
    value._return = value.type ? { ...value._return, type: value.type } : value._return;
    return value._return;
}
