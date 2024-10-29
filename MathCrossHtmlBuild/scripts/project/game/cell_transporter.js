import { AddConfig } from "./i_cell_transporter.js";
import Component from "../base/Component.js";
export class CellTransporter extends Component {
    get types() {
        return [...super.types, "ICellTransporter", "CellTransporter"];
    }
    addTo(cell, to, config) {
        return Promise.resolve(undefined);
    }
    return(cell) {
        return Promise.resolve(undefined);
    }
}
