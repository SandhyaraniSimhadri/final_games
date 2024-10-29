import Component, { CoroutineInfo } from "../base/Component.js";
import Vector from "../Vector.js";
import CellInfo from "./cell_info.js";
import MemberCell, { AestheticsInfo } from "./member_cell.js";
import { addDefaultChild } from "../utils/game_utils.js";
import { animationSeries } from "../animation_utils.js";
import { randFloat } from "../Utils.js";
import { animationPresets } from "../Main.js";
export default class CrossGridController extends Component {
    addedCell = [];
    removedCell = [];
    _cellCoroutine;
    hasSetUp = false;
    get grid() {
        return this.gameObject;
    }
    get types() {
        return [...super.types, "CrossGridController"];
    }
    async setUp(gridSize, coordinateAndCellInfo, others = undefined) {
        this.hasSetUp = false;
        if (this._cellCoroutine)
            this.stopCoroutine(this._cellCoroutine);
        this.grid.resizeBoard(gridSize);
        const coordinates = [...coordinateAndCellInfo.keys()];
        this.handleCoordinatesActiveState(coordinates);
        const fixedCellCoordinates = [...coordinateAndCellInfo.keys()].filter(coordinate => coordinateAndCellInfo.get(coordinate).value);
        fixedCellCoordinates.forEach(coordinate => this.addFixedCell(coordinate, coordinateAndCellInfo.get(coordinate)));
        const anim = animationPresets['BOARD_CELLS_ENTER']?.deepClone();
        if (anim) {
            const holders = this.grid.tiles;
            holders.forEach(holder => {
                holder.translate = new Vector(-1500, -1500);
            });
            const token = { cancel: false };
            others = others ?? { positive: randFloat(0, 1) > 0.5 };
            this._cellCoroutine = this.startCoroutine(animationSeries(this, holders, anim.animation, anim.delay, holders.map(_ => others), token), () => {
            }, token);
            await this._cellCoroutine.asPromise();
        }
        this.hasSetUp = true;
    }
    resetObject() {
        this.grid.tiles.filter(t => t.item).forEach(t => t.destroy());
    }
    addFixedCell(coordinate, cellInfo) {
        const holder = this.grid.getTile(coordinate);
        // @ts-ignore
        const cell = this.runtime.objects["MemberCell"].createInstance(holder.layer.index, holder.x, holder.y, true);
        cell.init(cellInfo);
        cell.setAestheticsByName(AestheticsInfo.DEFAULT_FIXED);
        cell.size = holder.size;
        holder.item = cell;
        holder.fixedItem = true;
    }
    addCell(cell, to) {
        const holder = this.grid.getTile(to);
        addDefaultChild(cell, holder);
        holder.item = cell;
        this.addedCell.forEach(callback => callback(cell));
    }
    removeCell(cell) {
        const holder = cell.holder;
        cell.removeFromParent();
        holder.item = null;
        cell.setAestheticsByName(AestheticsInfo.DEFAULT_FREE);
        this.removedCell.forEach(callback => callback(cell, holder));
    }
    handleCoordinatesActiveState(coordinates) {
        coordinates.forEach(coordinate => {
            const holder = this.grid.getTile(coordinate);
            holder.active = true;
        });
        this.grid.tiles
            .map(t => t.coordinate)
            .except(coordinates)
            .forEach(coordinate => this.grid.getTile(coordinate).active = false);
        coordinates.map(coordinate => this.grid.getTile(coordinate)).forEach(t => t.active = true);
    }
}
