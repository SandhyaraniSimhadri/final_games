import Component from "../base/Component.js";
export default class PoolCellHolder extends Component {
    _cell = null;
    targetCell = null;
    get types() {
        return [...super.types, "PoolCellHolder"];
    }
    get size() {
        return this.gameObject.size;
    }
    set size(value) {
        this.gameObject.size = value;
    }
    get cell() {
        return this._cell;
    }
    set cell(value) {
        this._cell = value;
        if (value) {
            value.zElevation = 0.0001;
        }
        this.targetCell = value ? value : this.targetCell;
    }
}
