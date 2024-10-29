import Component from "../base/Component.js";
export default class ClickInteractionHandler extends Component {
    afterFocusStarted = [];
    beforeFocusStarted = [];
    active = true;
    focus = false;
    highlightedHolder;
    otherHandlers = [];
    get types() {
        return [...super.types, "IInteractionHandler", "ClickInteractionHandler"];
    }
    _grid;
    get grid() {
        return this._grid ??= this.findObjectOfType("Grid");
    }
    _detector;
    get detector() {
        return this._detector ??= this.getComponent("CellInteractionDetector");
    }
    _transporter;
    get transporter() {
        return this._transporter ??= this.getComponent("ICellTransporter");
    }
    get canInteract() {
        return this.active && this.otherHandlers.every(h => !h.focus);
    }
    awake() {
        super.awake();
        this.detector.clicked.push(this.interactionDetectorOnClicked.bind(this));
        this.otherHandlers.push(...this.getComponents("IInteractionHandler").except([this]));
        this.otherHandlers.forEach(h => {
            h.beforeFocusStarted.push(this.otherHandlerOnFocusStarted.bind(this));
        });
        this.grid.updated.push(this.gridOnUpdated.bind(this));
        this.gridOnUpdated();
    }
    gridOnUpdated() {
        this.highlightedHolder = undefined;
        this.grid.tiles.filter(t => !t.fixedItem).forEach(t => t.clicked.push(this.tileOnClicked.bind(this)));
    }
    tileOnClicked(holder) {
        // console.log('tile on clicked:' + this.canInteract);
        if (!this.canInteract || !holder.active || holder.fixedItem)
            return;
        if (this.highlightedHolder) {
            this.switchFocusHolder(holder);
        }
        else {
            this.focusHolder(holder);
        }
    }
    switchFocusHolder(holder) {
        console.log('switch focus holder');
        this.highlightedHolder.highlight = false;
        this.highlightedHolder = holder;
        holder.highlight = true;
    }
    focusHolder(holder) {
        this.beforeFocusStarted.forEach(f => f(this));
        this.highlightedHolder = holder;
        holder.highlight = true;
        this.focus = true;
        this.detector.detectClickOnPoolCell = true;
    }
    otherHandlerOnFocusStarted(handler) {
        if (!this.focus)
            return;
        this.endFocus();
    }
    interactionDetectorOnClicked(cell) {
        // console.log('interaction detector on clicked', cell);
        if (!this.canInteract)
            return;
        if (cell.holder) {
            this.tileOnClicked(cell.holder);
            return;
        }
        if (!this.highlightedHolder)
            return;
        const existingCell = this.highlightedHolder.item;
        this.highlightedHolder.item = null;
        if (existingCell) {
            existingCell.highlight = false;
            this.transporter.return(existingCell).then();
        }
        this.transporter.addTo(cell, this.highlightedHolder.coordinate, { sound: true }).then();
        this.endFocus();
    }
    endFocus() {
        if (this.highlightedHolder) {
            this.highlightedHolder.highlight = false;
            this.highlightedHolder = undefined;
        }
        this.detector.detectClickOnPoolCell = false;
        this.focus = false;
        this.afterFocusStarted.forEach(f => f(this));
    }
}
