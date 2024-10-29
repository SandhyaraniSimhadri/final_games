import Vector from "../Vector.js";
export default class GridUtils {
    static calculateGridSize(count, contentSize, spacing) {
        const countRatio = (contentSize.y + spacing) / (contentSize.x + spacing);
        const countValue = Math.sqrt(count / countRatio);
        let columns = Math.ceil(countValue);
        let rows = Math.floor(columns * countRatio);
        while (columns * rows < count) {
            columns++;
            rows = Math.floor(columns * countRatio);
        }
        return new Vector(columns, rows);
    }
}
