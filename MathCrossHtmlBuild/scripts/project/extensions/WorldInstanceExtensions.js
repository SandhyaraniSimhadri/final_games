import Component from "../base/Component.js";
import { makeItAsComponentInstanceIfCan } from "../game/component_instance_maker.js";
import Vector from "../Vector.js";
import Animator from "../Animator.js";
import { addDefaultChild } from "../utils/game_utils.js";
export {};
Object.defineProperty(IWorldInstance.prototype, 'stateChanged', {
    get() {
        return this._stateChanged ??= [];
    }
});
Object.defineProperty(IWorldInstance.prototype, 'visible', {
    get() {
        return this.isVisible;
    },
    set(value) {
        this.isVisible = value;
        this.stateChanged.forEach((action) => action(this, {
            name: "visible",
            value: value
        }));
    }
});
Object.defineProperty(IWorldInstance.prototype, 'position', {
    get() {
        return new Vector(this.x - this.translate.x * this.scale.x, this.y - this.translate.y * this.scale.y);
    },
    set(value) {
        this.x = value.x + this.translate.x * this.scale.x;
        this.y = value.y + this.translate.y * this.scale.y;
    }
});
Object.defineProperty(IWorldInstance.prototype, 'animator', {
    get() {
        if (!this["_animator"]) {
            this._animator = Animator.create(this.runtime, false, this.layer.index);
            addDefaultChild(this["_animator"], this);
        }
        return this["_animator"];
    }
});
Object.defineProperty(IWorldInstance.prototype, 'normalSize', {
    get() {
        return this._normalSize ??= new Vector(this.width, this.height);
    },
    set(value) {
        this._normalSize = value;
        this.scale = new Vector(this.size.x / this.normalSize.x, this.size.y / this.normalSize.y);
    }
});
Object.defineProperty(IWorldInstance.prototype, 'scale', {
    get() {
        return new Vector(this.translateScale.x < 0.01 ? this["_scale"].x
            : this.size.x / (this.normalSize.x * Math.max(this.translateScale.x, 0.01)), this.translateScale.y < 0.01 ? this["_scale"].y :
            this.size.y / (this.normalSize.y * Math.max(this.translateScale.y, 0.01)));
    },
    set(value) {
        this.width = this.normalSize.x * value.x * this.translateScale.x;
        this.height = this.normalSize.y * value.y * this.translateScale.y;
        this["_scale"] = value;
        console.log("setting scale", value, this.normalSize, this.size);
    }
});
Object.defineProperty(IWorldInstance.prototype, 'size', {
    get() {
        return new Vector(this.width, this.height);
    },
    set(v) {
        this.scale = new Vector(v.x / this.normalSize.x, v.y / this.normalSize.y);
    }
});
IWorldInstance.prototype.runOnNextFrame = function (action) {
    this.animator.runOnNextFrame(action);
};
IWorldInstance.prototype.getEffect = function (name) {
    return this.effects.find(e => e.name === name);
};
IWorldInstance.prototype.getComponentSafe = function (name) {
    makeItAsComponentInstanceIfCan(this);
    // @ts-ignore
    return this.getComponent(name) ?? null;
};
IWorldInstance.prototype.addComponentsSafe = function (...components) {
    makeItAsComponentInstanceIfCan(this);
    // @ts-ignore
    return this.addComponent(...components);
};
IWorldInstance.prototype.getChild = function (type) {
    // console.log([...this.children()]);
    return this.getChildren(type).firstOrDefault();
};
IWorldInstance.prototype.getChildren = function (type) {
    return [...this.children()].filter(c => (
    // @ts-ignore
    c["types"] ? c['types'].includes(type)
        : c.objectType.name === type));
};
IWorldInstance.prototype.findChildrenAuto = function (value) {
    let items = [...this.children()].filter(c => c.instVars.Name === value).cast();
    if (!items.length)
        items = this.getChildren(value);
    return items;
};
IWorldInstance.prototype.getChildByName = function (name) {
    return [...this.children()].find(c => c.objectType.name === name);
};
IWorldInstance.prototype.getAllChildren = function () {
    return [...this.children(), ...[...this.children()].flatMap(c => c.getAllChildren())];
};
IWorldInstance.prototype.findChild = function (predicate) {
    return [...this.children()].find(predicate);
};
Object.defineProperty(IWorldInstance.prototype, 'groupOpacity', {
    get() {
        return this.opacity;
    },
    set(value) {
        this.children().forEach((c) => {
            if (c._groupOpacityMultiplexer === undefined || this.opacity > 0)
                c._groupOpacityMultiplexer = c.opacity / this.opacity;
            return c.groupOpacity = value * c._groupOpacityMultiplexer;
        });
        this.opacity = value;
    }
});
Object.defineProperty(IWorldInstance.prototype, 'translate', {
    get() {
        return this._translate ??= new Vector(0, 0);
    },
    set(value) {
        const position = this.position;
        this._translate = value;
        this.position = position;
    }
});
Object.defineProperty(IWorldInstance.prototype, 'translateScale', {
    get() {
        return this._translateScale ??= new Vector(1, 1);
    },
    set(value) {
        this._translateScale = value;
        this.scale = this.scale;
    }
});
Object.defineProperty(IWorldInstance.prototype, 'blankComponent', {
    get() {
        // if (this["_blankComponent"])
        //     this.removeComponent(this["_blankComponent"])
        return this._blankComponent ??= this.addComponentsSafe(new Component()).first();
    }
});
