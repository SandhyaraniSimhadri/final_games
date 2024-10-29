import SpriteInstance from "../base/SpriteInstance.js";
import Vector from "../Vector.js";
import PoolCellHolder from "./pool_cell_holder.js";
import GridUtils from "./grid_utils.js";
import MemberCell, { AestheticsInfo } from "./member_cell.js";
import { MAX_TILE_SIZE } from "./grid.js";
import { addDefaultChild } from "../utils/game_utils.js";
import { animationPresets, valuePresets } from "../Main.js";
import { animationSeries } from "../animation_utils.js";
import Component, { CoroutineInfo } from "../base/Component.js";
export default class CellPool extends SpriteInstance {
    padding;
    spacing;
    holders = [];
    _cellAnimationCoroutine;
    get cellSize() {
        return this.holders.first().size;
    }
    get cells() {
        return this.holders.filter(h => h.cell).map(h => h.cell);
    }
    get component() {
        return this.getComponentSafe("Component") ?? this.addComponentsSafe(new Component()).first();
    }
    constructor() {
        super();
        // @ts-ignore
        this.padding = new Vector(this.instVars["paddingX"] ?? 40, this.instVars["paddingY"] ?? 30);
        // @ts-ignore
        this.spacing = valuePresets["CELL_POOL_SPACING"] ?? 20;
    }
    async setUp(infos) {
        const gridSize = GridUtils.calculateGridSize(infos.length, this.size.sub(this.padding.mul(2)), this.spacing);
        this.generateHolders(infos.length, gridSize);
        infos.forEach((info, index) => {
            this.createCell(info, this.holders[index]);
        });
        const anim = animationPresets['POOL_CELLS_ENTER']?.deepClone();
        if (!anim) {
            return;
        }
        this.holders.filter(h => h.cell).map(h => h.cell).forEach(c => c.translate = new Vector(-1000, 2000));
        if (this._cellAnimationCoroutine)
            this.component.stopCoroutine(this._cellAnimationCoroutine);
        const token = { cancel: false };
        this._cellAnimationCoroutine = this.component.startCoroutine(animationSeries(this.component, this.cells, anim.animation, anim.delay, [], token), () => {
        }, token);
        await this._cellAnimationCoroutine.asPromise();
    }
    resetObject() {
        this.holders.forEach(h => h.gameObject.destroy());
        this.holders.clear();
    }
    createCell(info, holder) {
        // @ts-ignore
        const cell = this.runtime.objects.MemberCell.createInstance(this.layer.index, holder.gameObject.x, holder.gameObject.y, true);
        cell.init(info);
        cell.setAestheticsByName(AestheticsInfo.DEFAULT_FREE);
        cell.size = holder.size;
        holder.cell = cell;
        addDefaultChild(cell, holder.gameObject);
    }
    generateHolders(count, gridSize) {
        const cellSize = this.calculateCellSize(gridSize);
        for (let i = 0; i < count; i++) {
            const x = i % gridSize.x;
            const y = Math.floor(i / gridSize.x);
            const holder = this.instantiateHolder();
            holder.size = Vector.one.mul(cellSize);
            holder.gameObject.position = this.calculatePositionAt(x, y, gridSize);
            this.holders.push(holder);
        }
    }
    instantiateHolder() {
        const sprite = this.runtime.objects.Sprite.createInstance(this.layer.index, 0, 0);
        addDefaultChild(sprite, this);
        return sprite.addComponentsSafe(new PoolCellHolder()).first();
    }
    calculateCellSize(gridSize) {
        return Math.min((this.size.x - this.padding.x * 2 - this.spacing * (gridSize.x - 1)) / gridSize.x, MAX_TILE_SIZE + 10);
    }
    calculatePositionAt(x, y, gridSize) {
        const cellSize = this.calculateCellSize(gridSize);
        const topLeft = new Vector((this.width - (cellSize * gridSize.x + this.spacing * (gridSize.x - 1))) / 2, (this.height - (cellSize * gridSize.y + this.spacing * (gridSize.y - 1))) / 2);
        return new Vector((x + 0.5) * cellSize + x * this.spacing, (y + 0.5) * cellSize + y * this.spacing)
            .add(topLeft)
            .add(this.position.sub(this.size.mul(1 / 2)));
    }
    getPositionFor(cell) {
        return this.getHolderForCell(cell).gameObject.position;
    }
    return(cell) {
        const holder = this.getHolderForCell(cell);
        cell.setAestheticsByName(AestheticsInfo.DEFAULT_FREE);
        cell.position = holder.gameObject.position;
        addDefaultChild(cell, holder.gameObject);
        holder.cell = cell;
    }
    remove(cell) {
        const holder = this.holders.find(h => cell && h.cell === cell);
        if (holder) {
            cell.removeFromParent();
            holder.cell = null;
        }
    }
    getHolderForCell(cell) {
        const holder = this.holders.find(h => h.targetCell === cell);
        return holder ?? this.holders.find(h => !h.cell);
    }
}
