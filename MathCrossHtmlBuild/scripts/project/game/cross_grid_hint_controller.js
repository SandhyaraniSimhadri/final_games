import Component from "../base/Component.js";
import Animator from "../Animator.js";
export default class CrossGridHintController extends Component {
    holderInfos = new Map();
    _pool;
    isHinting = false;
    get types() {
        return [...super.types, "CrossGridHintController"];
    }
    get pool() {
        return this._pool ??= this.findObjectOfType("CellPool");
    }
    _transporter;
    get transporter() {
        return this._transporter ??= this.getComponent("ICellTransporter");
    }
    get grid() {
        return this.gameObject;
    }
    getTargetCoordinate() {
        return (this.grid.tiles.find(c => c.active && !c.item) ??
            this.grid.tiles
                .find(c => c.active && c.item && !c.fixedItem && this.holderInfos.get(c.coordinate.getHashCode()).value !== c.item.value)).coordinate;
    }
    async showHint() {
        if (this.isHinting) {
            return;
        }
        this.isHinting = true;
        const targetCoordinate = this.getTargetCoordinate();
        const item = this.grid.getTile(targetCoordinate).item;
        if (item) {
            this.grid.getTile(targetCoordinate).item = null;
            await this.transporter.return(item);
            await Animator.delayFunc(this, 0.3);
        }
        const targetValue = this.holderInfos.get(targetCoordinate.getHashCode()).value;
        let cell = this.pool.cells.cast().find(c => c.value === targetValue);
        if (!cell) {
            const holder = this.grid.tiles.find(h => h.item
                && !h.fixedItem
                && h.item.value === targetValue
                && this.holderInfos.get(h.coordinate.getHashCode()).value !== targetValue);
            const holderItem = holder.item;
            holder.item = null;
            await this.transporter.return(holderItem);
            await Animator.delayFunc(this, 0.3);
            cell = holderItem;
        }
        this.pool.remove(cell);
        await this.transporter.addTo(cell, targetCoordinate, { sound: true });
        this.isHinting = false;
    }
    setUp(infos) {
        infos.forEach(i => this.holderInfos.set(i.coordinate.getHashCode(), i));
    }
}
