import Component from "../base/Component.js";
import Vector from "../Vector.js";
export default class ImageFit extends Component {
    type;
    canvas;
    constructor(type = FitType.Fill) {
        super();
        this.type = type;
    }
    awake() {
        super.awake();
        this.canvas = document.querySelector("canvas");
    }
    updateFit() {
        const [imageWidth, imageHeight] = this.gameObject.getImageSize();
        const windowSize = this.getWindowsSize();
        if (this.type === FitType.NoAspect) {
            this.gameObject.width = windowSize.x;
            this.gameObject.height = windowSize.y;
            return;
        }
        const scaleRate = this.type === FitType.Fill ? Math.max(windowSize.x / imageWidth, windowSize.y / imageHeight) :
            Math.min(windowSize.x / imageWidth, windowSize.y / imageHeight);
        this.gameObject.width = imageWidth * scaleRate;
        this.gameObject.height = imageHeight * scaleRate;
    }
    getWindowsSize() {
        const [startX, startY] = this.gameObject.layer.layerToCssPx(0, 0);
        const [endX, endY] = this.gameObject.layer.layerToCssPx(this.gameObject.layout.width, this.gameObject.layout.height);
        const multiplexer = this.gameObject.layout.width / (endX - startX);
        // this.gameObject.width = x;
        return new Vector(this.canvas.width * multiplexer, this.canvas.height * multiplexer);
    }
    update() {
        super.update();
        this.updateFit();
    }
    get types() {
        return [...super.types, 'ImageFit'];
    }
}
export var FitType;
(function (FitType) {
    FitType["Contain"] = "contain";
    FitType["Fill"] = "fill";
    FitType["NoAspect"] = "no-aspect";
})(FitType || (FitType = {}));
