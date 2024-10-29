//make class singleton
import Vector from "./Vector.js";
import InputController from "./input_controller.js";
export default class PointerEventSystem {
    runtime;
    pointerDownPosition = null;
    pointerCurrentPosition = new Vector(0, 0);
    isPointerDown = false;
    pointerDownItem = null;
    constructor(runtime) {
        this.runtime = runtime;
        runtime.addEventListener('tick', () => this.update());
        InputController.instance.pointerDown.push((e) => this.onPointerDown(e));
        InputController.instance.pointerMove.push((e) => this.onPointerMove(e));
        InputController.instance.pointerUp.push((e) => this.onPointerUp(e));
        InputController.instance.pointerCancel.push((e) => this.onPointerCancel(e));
    }
    static _instance;
    static get instance() {
        if (!PointerEventSystem._instance) {
            PointerEventSystem._instance = new PointerEventSystem(window.gRuntime);
        }
        return PointerEventSystem._instance;
    }
    findTopItem(cssX, cssY) {
        const items = this.findItemInOrder(cssX, cssY);
        return items.length ? items.first() : undefined;
    }
    findItemInOrder(cssX, cssY) {
        const items = [...this.runtime.objects.RayCasts.instances()].filter((item) => {
            const [x, y] = item.layer.cssPxToLayer(cssX, cssY);
            return item.isVisible
                && item.layer.isSelfAndParentsVisible
                && item.instVars["rayCastTarget"]
                && (item.instVars["intractable"] === undefined || item.instVars["intractable"])
                && item.containsPoint(x, y);
        });
        if (items.length == 0)
            return [];
        const layerVsObjects = items.groupBy((item) => item.layer.index);
        const layerInOrder = [...layerVsObjects.keys()].orderBy((x) => x, true);
        return layerInOrder.map(layer => layerVsObjects.get(layer).orderBy((x) => x.zIndex, true)).flat();
    }
    onPointerCancel(e) {
        this.isPointerDown = false;
        if (this.pointerDownItem) {
            this.callFunctionOnItem(this.pointerDownItem, 'onPointerCancel', e);
            this.pointerDownItem = null;
        }
    }
    onPointerMove(e) {
        this.pointerCurrentPosition = new Vector(e.clientX, e.clientY);
        if (!this.isPointerDown)
            return;
        if (this.pointerDownItem) {
            this.callFunctionOnItem(this.pointerDownItem, 'onPointerMove', e);
            return;
        }
        let items = this.findItemInOrder(e.clientX, e.clientY);
        if (this.pointerDownItem)
            items = items.except([this.pointerDownItem]);
        if (!items.length)
            return;
        for (let item of items) {
            if (item.onPointerMove) {
                this.callFunctionOnItem(item, 'onPointerMove', e);
                return;
            }
        }
    }
    onPointerUp(e) {
        this.isPointerDown = false;
        if (this.pointerDownItem) {
            this.callFunctionOnItem(this.pointerDownItem, 'onPointerUp', e);
            this.pointerDownItem = null;
        }
        const items = this.findItemInOrder(e.clientX, e.clientY);
        if (!items.length) {
            this.pointerDownPosition = null;
            return;
        }
        if (items.first().onClicked && this.pointerDownPosition.sub(new Vector(e.clientX, e.clientY)).mag() < 5) {
            const item = items.first();
            this.callFunctionOnItem(item, 'onClicked', item);
        }
        this.pointerDownPosition = null;
        for (let item of items) {
            if (item.onPointerUp) {
                const info = {
                    ...e,
                    x: item.layer.cssPxToLayer(e.clientX, e.clientY)[0],
                    y: item.layer.cssPxToLayer(e.clientX, e.clientY)[1]
                };
                this.callFunctionOnItem(item, 'onPointerUp', info);
                return;
            }
        }
    }
    callFunctionOnItem(item, funcName, info) {
        // @ts-ignore
        if (!item[funcName])
            return;
        // @ts-ignore
        if (item[funcName] instanceof Array) {
            // @ts-ignore
            item[funcName].forEach((f) => f(info));
        }
        else {
            // @ts-ignore
            item[funcName](info);
        }
    }
    onPointerDown(e) {
        this.pointerDownPosition = new Vector(e.clientX, e.clientY);
        this.pointerCurrentPosition = this.pointerDownPosition.clone();
        this.isPointerDown = true;
        const items = this.findItemInOrder(e.clientX, e.clientY);
        if (!items.length)
            return;
        // console.log('onPointerDown', e);
        //
        // if (items.first().onTouched) {
        //     const item = items.first();
        //     if (item.onTouched instanceof Array)
        //         item.onTouched.forEach((f: Function) => f(item));
        //     else
        //         item.onTouched(item);
        // }
        const item = items.first();
        console.log('onPointerDown', item);
        if (item.onPointerDown) {
            // console.log('onPointerDown', items.first());
            this.pointerDownItem = item;
            const info = {
                ...e,
                x: item.layer.cssPxToLayer(e.clientX, e.clientY)[0],
                y: item.layer.cssPxToLayer(e.clientX, e.clientY)[1]
            };
            item.onPointerDown(info);
            return;
        }
        // for (let item of items) {
        //     // console.log('onPointerDown', item);
        //     if (item.onPointerDown) {
        //
        //         // console.log('onPointerDown', items.first());
        //         this.pointerDownItem = item;
        //         const info = {
        //             ...e,
        //             x: item.layer.cssPxToLayer(e.clientX, e.clientY)[0],
        //             y: item.layer.cssPxToLayer(e.clientX, e.clientY)[1]
        //         }
        //         item.onPointerDown(info);
        //
        //         return;
        //     }
        // }
    }
    update() {
        // this.processEvent();
        const item = this.findTopItem(this.pointerCurrentPosition.x, this.pointerCurrentPosition.y);
        if (item && item.onHover) {
            // noinspection SuspiciousTypeOfGuard
            if (item.onHover instanceof Array)
                item.onHover.forEach((f) => f(item));
            else
                item.onHover(item);
        }
    }
}
