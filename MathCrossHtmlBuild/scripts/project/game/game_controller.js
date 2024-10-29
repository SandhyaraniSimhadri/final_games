import Component from "../base/Component.js";
import CellInfo from "./cell_info.js";
export default class GameController extends Component {
    completed = [];
    detector;
    gridEquationController;
    pool;
    hintController;
    gridController;
    get types() {
        return [...super.types, "GameController"];
    }
    get grid() {
        return this.gameObject;
    }
    awake() {
        super.awake();
        this.detector = this.getComponent("CellInteractionDetector");
        this.gridController = this.getComponent("CrossGridController");
        this.gridEquationController = this.getComponent("CrossGridEquationController");
        this.pool = this.findObjectOfType('CellPool');
        this.hintController = this.getComponent("CrossGridHintController");
        this.gridEquationController.completed.push(() => this.completed.forEach(a => a()));
    }
    startGame(info, others = undefined) {
        this.gridController.resetObject();
        this.gridController.setUp(info.gridSize, info.holders.toMap(h => h.coordinate, h => new CellInfo(h.isFixed ? h.value : '')), others).then();
        this.gridEquationController.resetObject();
        this.gridEquationController.setUp(info.equations);
        this.pool.resetObject();
        this.pool.setUp(info.cells.map(c => new CellInfo(c)));
        this.detector.resetObject();
        this.detector.setUp(this.pool.cells);
        this.hintController.setUp(info.holders);
    }
}
