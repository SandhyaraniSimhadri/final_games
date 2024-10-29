import Scene from "./Scene.js";
import PointerHighlightPanel from "./PointerHighlightPanel.js";
import { playSound } from "./GameUtils.js";
import { ActionType } from "./TutorialInfo.js";
import { PuzzleInfo } from "./common_models.js";
import CrossGridController from "./game/cross_grid_controller.js";
import CellInteractionDetector from "./game/cell_interaction_detector.js";
import MoveCellTransporter from "./game/move_cell_transporter.js";
import DragInteractionHandler from "./game/drag_interaction_handler.js";
import ClickInteractionHandler from "./game/click_interaction_handler.js";
import CrossGridEquationController from "./game/cross_grid_equation_controller.js";
import GameController from "./game/game_controller.js";
import CellInfo from "./game/cell_info.js";
import ImageFit from "./img-utls/ImageFit.js";
import { YieldInstruction } from "./base/YieldInstruction.js";
export default class TutorialScene extends Scene {
    runtime;
    titleText;
    messageText;
    grid;
    info = null;
    highlightPanel;
    controller;
    equationController;
    detector;
    constructor(runtime) {
        super(runtime);
        this.runtime = runtime;
        // @ts-ignore
        this.findObjectOfType("background")?.addComponentsSafe(new ImageFit());
        this.findObjectOfType("TutorialCompleteBG")?.addComponentsSafe(new ImageFit());
        this.grid = runtime.objects.Grid.getFirstInstance();
        this.grid.addComponentsSafe(new CrossGridController(), new CellInteractionDetector(), new MoveCellTransporter(), new DragInteractionHandler(), new ClickInteractionHandler(), new CrossGridEquationController(), new GameController());
        this.controller = this.grid.getComponentSafe("CrossGridController");
        this.equationController = this.grid.getComponentSafe("CrossGridEquationController");
        this.detector = this.grid.getComponentSafe("CellInteractionDetector");
        this.highlightPanel = new PointerHighlightPanel(this.runtime);
        this.titleText = runtime.objects.TutorialTitleText.getFirstInstance();
        this.messageText = runtime.objects.TutorialMessageText.getFirstInstance();
        this.loadTutorial().then(async () => {
            await this.show();
            playSound(this.runtime, "tutorial_complete");
            runtime.layout.getLayer("CompletedPanel").isVisible = true;
        });
    }
    _pool;
    get pool() {
        return this._pool ??= this.findObjectOfType("CellPool");
    }
    async loadTutorial() {
        console.log('load tutorial');
        const url = await this.runtime.assets.getProjectFileUrl("tutorialInfo.json");
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        // console.log(data.steps.map(s => s));
        this.info = data.with(info => info.puzzleInfo = PuzzleInfo.create(info.puzzleInfo));
    }
    async show() {
        console.log('show tutorial');
        const puzzleInfo = this.info.puzzleInfo;
        const controllerSetup = this.controller.setUp(puzzleInfo.gridSize, puzzleInfo.holders.toMap(h => h.coordinate, h => new CellInfo(h.isFixed ? h.value : "")));
        const poolSetup = this.pool.setUp(puzzleInfo.cells.map(c => new CellInfo(c)));
        await Promise.all([controllerSetup, poolSetup]);
        this.equationController.setUp(puzzleInfo.equations);
        this.detector.setUp(this.pool.cells);
        this.highlightPanel.clear();
        for (const step of this.info.steps) {
            const promises = [
                async () => await this.animator.linearAnim(8, n => {
                    this.titleText.opacity = 1 - n;
                    this.messageText.opacity = 1 - n;
                }, () => {
                    this.titleText.text = step.title;
                    this.messageText.text = step.message;
                }).asPromise(),
                async () => await this.animator.linearAnim(8, n => {
                    this.titleText.opacity = n;
                    this.messageText.opacity = n;
                }).asPromise()
            ];
            for (const p of promises) {
                await p();
            }
            for (const action of step.actions) {
                await this.performAction(action);
                await this.animator.delay(0.1).asPromise();
            }
        }
    }
    async performAction(action) {
        if (action.actionType === ActionType.Click) {
            const holder = this.controller.grid.getTile(action.target);
            await this.highlightPanel.highlightClick(holder.position, () => holder.highlight);
            const cell = this.pool.cells.find(c => c.value === action.value);
            await this.highlightPanel.highlightClick(cell.position, () => !!cell.holder);
            await this.animator.delay(0.2).asPromise();
        }
        else if (action.actionType === ActionType.Drag) {
            const holder = this.controller.grid.getTile(action.target);
            const cell = this.pool.cells.find(c => c.value === action.value);
            await this.highlightPanel.highlightDrag(cell.position, holder.position, () => !!holder.item);
            await this.animator.delay(0.2).asPromise();
        }
    }
    onClickSkip() {
        this.runtime.goToLayout("Game");
    }
    onLayoutEnded() {
        super.onLayoutEnded();
        this.highlightPanel.clear();
    }
}
