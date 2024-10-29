import SpriteInstance from "../base/SpriteInstance.js";
import Vector from "../Vector.js";
import { addDefaultChild } from "../utils/game_utils.js";
import { valuePresets } from "../Main.js";
export const MAX_TILE_SIZE = 120;
export default class Grid extends SpriteInstance {
    updated = [];
    tiles = [];
    gridSize = new Vector(6, 7);
    tileWidth = 100;
    padding;
    spacing;
    originalPosition;
    constructor() {
        super();
        // @ts-ignore
        this.padding = new Vector(this.instVars["paddingX"] ?? 40, this.instVars["paddingY"] ?? 40);
        // @ts-ignore
        this.spacing = valuePresets['GRID_SPACING'] ?? 3;
        this.resetBoard();
    }
    getTileXY(x, y) {
        return this.tiles[y * this.gridSize.x + x];
    }
    getTile(vec) {
        return this.getTileXY(vec.x, vec.y);
    }
    resetBoard() {
        this.tiles.forEach(t => {
            console.log("Destroying tile:" + t);
            t.destroy();
        });
        this.tiles.clear();
        this.callUpdatedEvent();
    }
    resizeBoard(size) {
        this.gridSize = size;
        this.resetBoard();
        const tileWidthByX = (this.width - 2 * this.padding.x - this.spacing * (this.gridSize.x - 1)) / this.gridSize.x;
        const tileWidthByY = (this.height - 2 * this.padding.y - this.spacing * (this.gridSize.y - 1)) / this.gridSize.y;
        this.tileWidth = Math.min(tileWidthByX, tileWidthByY, MAX_TILE_SIZE);
        this.generateTiles();
    }
    getPositionForCoordinate(coordinate) {
        const topLeft = new Vector(this.x - this.width / 2 + (this.width - this.gridSize.x * this.tileWidth - (this.gridSize.x - 1) * this.spacing - 2 * this.padding.x) / 2, this.y - this.height / 2
            + (this.height - this.gridSize.y * this.tileWidth - (this.gridSize.y - 1) * this.spacing - 2 * this.padding.y) / 2);
        return new Vector(topLeft.x + this.padding.x + (coordinate.x + 0.5) * this.tileWidth + this.spacing * coordinate.x, topLeft.y + this.padding.y + (coordinate.y + 0.5) * this.tileWidth + this.spacing * coordinate.y);
    }
    generateTiles() {
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                this.createGridTile(x, y);
            }
        }
        this.callUpdatedEvent();
    }
    callUpdatedEvent() {
        this.updated.forEach(f => f());
    }
    createGridTile(x, y) {
        const position = this.getPositionForCoordinate(new Vector(x, y));
        // @ts-ignore
        const tile = this.runtime.objects["CellHolder"].createInstance(this.layer.index, position.x, position.y, true);
        tile.size = new Vector(this.tileWidth, this.tileWidth);
        tile.coordinate = new Vector(x, y);
        tile.grid = this;
        addDefaultChild(tile, this);
        // tile.clicked.push(this.onTileClicked.bind(this));
        this.tiles.push(tile);
    }
}
