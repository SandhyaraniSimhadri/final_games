function registerEvents(instance) {
    instance.addEventListener('destroy', instance.onDestroy.bind(instance));
    // instance.runtime.layout.addEventListener('beforelayoutend', instance.beforeLayoutEndCallback);
    instance.runtime.addEventListener("tick", instance.updateCallback);
}
function init(instance) {
    instance.components = [];
}
function addComponent(instance) {
    instance.addComponent = function (...components) {
        this.components.push(...components);
        components.forEach(c => c.gameObject = this);
        this.components.forEach(c => c.awake());
        this.components.forEach(c => c.start());
        return components;
    };
}
function getComponent(instance) {
    instance.getComponent = function (type) {
        return this.getComponents(type).firstOrDefault();
    };
}
function getComponentInChildren(instance) {
    instance.getComponentInChildren = function (type) {
        return this.getComponentsInChildren(type).firstOrDefault();
    };
}
function getComponents(instance) {
    instance.getComponents = function (type) {
        return this.components.filter(c => c.types.includes(type));
    };
}
function getComponentsInChildren(instance) {
    instance.getComponentsInChildren = function (type) {
        return this.getAllChildren().filter(c => c["components"]).flatMap(c => c["components"]).filter(c => c.types.includes(type));
    };
}
function removeComponent(instance) {
    instance.removeComponent = function (component) {
        const index = this.components.indexOf(component);
        if (index != -1) {
            this.components.splice(index, 1);
        }
    };
}
function beforeLayoutEnd(instance) {
    // console.log('before layout end:' + instance.name);
    instance.beforeLayoutEnd = function () {
        this.onDestroy();
    };
}
function onDestroy(instance) {
    const onDestroy = instance.onDestroy;
    instance.onDestroy = function () {
        if (onDestroy)
            onDestroy.bind(this)(); // this.runtime.layout.removeEventListener('beforelayoutend', instance.beforeLayoutEndCallback);
        console.log('destroy:' + instance.objectType.name);
        this.runtime.removeEventListener("tick", instance.updateCallback);
        this.components.forEach(c => c.onDestroy());
    };
}
function update(instance) {
    const update = instance.update;
    instance.update = function () {
        if (update)
            update.bind(this)();
        this.components.filter(c => c.enabled).forEach(c => c.update());
    };
}
function destroy(instance) {
    // instance.destroy = function () {
    //     this.onDestroy();
    //     IWorldInstance.prototype.destroy.call(this);
    //     // this.destroy();
    //     // instance.super.destroy();
    // }
}
function beforeLayoutEndCallback(instance) {
    instance.beforeLayoutEndCallback = instance.beforeLayoutEnd.bind(instance);
}
function updateCallback(instance) {
    instance.updateCallback = (() => {
        if (instance.isVisible && instance.layer.isSelfAndParentsVisible)
            instance.update();
    });
}
export function makeItAsComponentInstanceIfCan(instance) {
    if (instance.components)
        return;
    init(instance);
    update(instance);
    updateCallback(instance);
    beforeLayoutEnd(instance);
    beforeLayoutEndCallback(instance);
    onDestroy(instance);
    registerEvents(instance);
    addComponent(instance);
    getComponent(instance);
    getComponents(instance);
    getComponentInChildren(instance);
    getComponentsInChildren(instance);
    removeComponent(instance);
    destroy(instance);
}
// private readonly beforeLayoutEndCallback = this.beforeLayoutEnd.bind(this);
// private readonly updateCallback = () => {
//     if (this.isVisible && this.layer.isSelfAndParentsVisible) this.update();
// }
//
// public readonly components: Component[] = [];
//
// constructor() {
//     super();
//     this.runtime.layout.addEventListener('afterlayoutend', this.beforeLayoutEndCallback);
//     this.runtime.addEventListener("tick", this.updateCallback);
// }
//
// addComponent(...components: Component[]) {
//     this.components.push(...components);
//     components.forEach(c => c.gameObject = this);
//     this.components.forEach(c => c.awake());
//     this.components.forEach(c => c.start());
// }
//
// getComponent<T extends Component>(name: string): T | null {
//     return this.components.find(c => c.constructor.name == name) as T ?? null;
// }
//
// removeComponent(component: Component) {
//     const index = this.components.indexOf(component);
//     if (index != -1) {
//         this.components.splice(index, 1);
//     }
// }
//
// beforeLayoutEnd() {
//     this.onDestroy();
// }
//
// onDestroy() {
//     this.runtime.layout.removeEventListener('afterlayoutend', this.beforeLayoutEndCallback);
//     this.runtime.removeEventListener("tick", this.updateCallback);
//     this.components.forEach(c => c.onDestroy());
// }
//
//
// update() {
//     this.components.filter(c => c.enabled).forEach(c => c.update());
//
// }
//
// public destroy() {
//     this.onDestroy();
//     super.destroy();
// }
