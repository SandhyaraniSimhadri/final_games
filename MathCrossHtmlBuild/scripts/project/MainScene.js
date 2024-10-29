import { animationPresets, audioPresets, boolPresets, prefs, valuePresets } from './Main.js';
import { hintSettings } from './Settings.js';
import Scene from './Scene.js';
import GameController from "./game/game_controller.js";
import Component, { CoroutineInfo } from "./base/Component.js";
import Levels from "./levels.js";
import { GameState } from "./common_enums.js";
import CellInteractionDetector from "./game/cell_interaction_detector.js";
import MoveCellTransporter from "./game/move_cell_transporter.js";
import CrossGridController from "./game/cross_grid_controller.js";
import DragInteractionHandler from "./game/drag_interaction_handler.js";
import ClickInteractionHandler from "./game/click_interaction_handler.js";
import CrossGridEquationController from "./game/cross_grid_equation_controller.js";
import CrossGridHintController from "./game/cross_grid_hint_controller.js";
import { addDefaultChild, sendEvent, showEffectToast } from "./utils/game_utils.js";
import ImageFit, { FitType } from "./img-utls/ImageFit.js";
import { randFloat } from "./Utils.js";
import { animation, animationSeries } from "./animation_utils.js";
export default class MainScene extends Scene {
    levelCompleted = [];
    levelDidntExist = [];
    controller;
    grid;
    hintController;
    gridCoroutine = [];
    exitAnimCoroutine = [];
    hasJustPlayedLevelCompleteAnim = false;
    crossGridController;
    loadingLevel = false;
    constructor(runtime, data = undefined) {
        super(runtime);
        const imageFit = new ImageFit();
        const bg = this.findObjectOfType("background");
        bg.addComponentsSafe(imageFit);
        this.grid = this.findObjectOfType('Grid');
        const components = this.grid.addComponentsSafe(new CrossGridController(), new CellInteractionDetector(), new MoveCellTransporter(), new DragInteractionHandler(), new ClickInteractionHandler(), new CrossGridEquationController(), new CrossGridHintController(), new GameController());
        this.grid.originalPosition = this.grid.position.clone();
        this.controller = Component.get("GameController");
        this.crossGridController = this.grid.getComponentSafe("CrossGridController");
        this.hintController = this.grid.getComponentSafe("CrossGridHintController");
        this.level = (data?.level ?? -1) <= 0 ? MainScene.completedLevel + 1 : data.level;
        this.currentState = GameState.Playing;
        this.controller.completed.push(() => this.onLevelCompleted());
        this.loadLevel(this.level, true).then();
    }
    static get completedLevel() {
        return prefs.getItem("completedLevel", 0);
    }
    static set completedLevel(value) {
        prefs.setItem("completedLevel", value);
    }
    static get hintLeft() {
        return prefs.getItem("hintLeft", valuePresets['HINTS_AT_START'] ?? 5);
    }
    static set hintLeft(value) {
        prefs.setItem("hintLeft", value);
    }
    get hasLevelExist() {
        return Levels.default.levels.max(l => l.level) >= this.level;
    }
    get currentState() {
        return this.runtime.globalVars.GameState;
    }
    set currentState(value) {
        this.runtime.globalVars.GameState = value;
    }
    get level() {
        return this.runtime.globalVars.Level;
    }
    set level(value) {
        this.runtime.globalVars.Level = value;
    }
    async loadLevel(level, firstTime = false) {
        this.loadingLevel = true;
        const lastLevel = this.level;
        this.level = level;
        if (!this.hasLevelExist) {
            this.processLevelDoestExist();
            return;
        }
        const others = { positive: this.level >= lastLevel };
        if (!firstTime) {
            await this.loadLevelAnim(level, others);
        }
        else {
            const info = Levels.default.getLevel(level).info.trim();
            this.controller.startGame(info, others);
        }
        this.currentState = GameState.Playing;
        this.loadingLevel = false;
        sendEvent(this.runtime, GameState.Playing);
        sendEvent(this.runtime, "LEVEL_LOADED", level);
    }
    async onLevelCompleted() {
        const isNewLevel = Math.max(MainScene.completedLevel, this.level) !== MainScene.completedLevel;
        MainScene.completedLevel = Math.max(MainScene.completedLevel, this.level);
        if (isNewLevel) {
            MainScene.hintLeft += valuePresets['HINT_REWARD_FOR_LEVEL_COMPLETE'] ?? hintSettings.hintForLevel;
        }
        this.currentState = GameState.Over;
        this.playSoundIfCan(audioPresets.COMPLETE);
        sendEvent(this.runtime, GameState.Over);
        this.delay(1, () => this.showWinParticleIfCan()).then();
        await this.completeAnim();
        await showEffectToast(this.runtime, "Level Completed!");
        this.levelCompleted.forEach(a => a());
        await this.loadLevel(this.level + 1);
    }
    showWinParticleIfCan() {
        if (!boolPresets['LC_WIN_PARTICLES'])
            return;
        const particles = this.runtime.objects.WinParticles.createInstance(this.controller.gameObject.layer.index, this.runtime.layout.width / 2, 800, true);
        particles.simulate();
    }
    async showHint() {
        console.log('show_hint', this.currentState);
        if (this.loadingLevel || this.currentState !== GameState.Playing) {
            return;
        }
        if (MainScene.hintLeft === 0)
            return;
        MainScene.hintLeft--;
        await this.hintController.showHint();
    }
    skip() {
        if (this.level - 1 === MainScene.completedLevel) {
            MainScene.completedLevel++;
        }
        this.loadLevel(MainScene.completedLevel + 1).then();
    }
    processLevelDoestExist() {
        this.currentState = GameState.None;
        this.levelDidntExist.forEach(a => a());
        this.loadLevel(Levels.default.levels.max(l => l.level)).then();
    }
    async completeAnim() {
        await this.animator.delay(0.7).asPromise();
        const startAnim = animationPresets['LEVEL_COMPLETE_START']?.deepClone();
        if (startAnim) {
            await animation(this.animator.blankComponent, undefined, startAnim).asPromise();
            this.hasJustPlayedLevelCompleteAnim = true;
        }
    }
    async loadLevelAnim(level, others) {
        const next = others.positive;
        const grid = this.runtime.objects.Grid.createInstance(0, this.grid.x, this.grid.y, true, "main");
        grid.size = this.grid.size;
        this.grid.tiles.forEach(t => {
            t.removeFromParent();
            addDefaultChild(t, grid);
        });
        this.grid.tiles.clear();
        const info = Levels.default.getLevel(level).info.trim();
        this.controller.startGame(info, others);
        // const oldGridStartX = grid.x;
        // this.animator.curveAnim(curves.EASE_IN, 0.2, n => {
        //
        //     // grid.x = oldGridStartX + (!next ? 1 : -1) * 2000 * n;
        // }, () => {
        //     grid.destroy();
        // });
        this.exitAnimation(grid, others).then();
        this.grid.position = this.grid.originalPosition;
        await this.enterAnimation(others);
        // this.gridCoroutine.push(this.controller.startCoroutine(animation(this.controller, this.grid, enterAnim, {positive: next}).toGenerator()));
        // this.grid.position = this.grid.originalPosition!.add(new Vector(!next ? -2000 : 2000, 500));
        // const gridStartPosition = this.grid.position;
        // const startScale = 0.5;
        // this.gridCoroutine.forEach(c => this.controller.stopCoroutine(c));
        // this.gridCoroutine.clear();
        // this.gridCoroutine.push(this.controller.startCoroutine(Animator.curveAnimFuncYield(this.controller, curves.LINEAR, 0.2, n => {
        //     this.grid.x = lerp(gridStartPosition.x, this.grid.originalPosition!.x, n);
        //
        // }).toGenerator()));
        //
        // this.gridCoroutine.push(this.controller.startCoroutine(Animator.curveAnimFuncYield(this.controller, curves.EASE_OUT, 0.2, n => {
        //     this.grid.y = lerp(gridStartPosition.y, this.grid.originalPosition!.y, n);
        //     this.grid.scale = Vector.lerp(new Vector(startScale, startScale), new Vector(1, 1), n);
        // }).toGenerator()));
    }
    async enterAnimation(others) {
        const component = this.animator.blankComponent;
        this.gridCoroutine.forEach(c => component.stopCoroutine(c));
        this.gridCoroutine.clear();
        const boardEnterAnim = animationPresets['BOARD_ENTER']?.deepClone();
        if (boardEnterAnim) {
            this.gridCoroutine.push(component.startCoroutine(animation(component, this.grid, boardEnterAnim, others).toGenerator()));
        }
        await this.animator.waitUntil(() => this.gridCoroutine.every(c => !c.running) && this.crossGridController.hasSetUp).asPromise();
        console.log("enter_anim", this.crossGridController);
        if (!this.hasJustPlayedLevelCompleteAnim)
            return;
        const anim = animationPresets['LEVEL_COMPLETE_RETURN']?.deepClone();
        // await this.animator.delay(10).asPromise();
        if (anim) {
            await animation(component, undefined, anim).asPromise();
        }
        this.hasJustPlayedLevelCompleteAnim = false;
    }
    async exitAnimation(grid, others) {
        const component = this.animator.blankComponent;
        this.exitAnimCoroutine.forEach(c => component.stopCoroutine(c));
        this.exitAnimCoroutine.clear();
        const token = { cancel: false };
        others = others ?? { positive: randFloat(0, 1) > 0.5 };
        // grid.opacity = 0;
        const holders = [...grid.children()].filter(h => h.translate.x === 0 && h.translate.y === 0);
        [...grid.children()].except(holders).forEach(h => h.destroy());
        const cellExitAnim = animationPresets['BOARD_CELLS_EXIT']?.deepClone();
        if (cellExitAnim) {
            console.log("exit anim started", holders, cellExitAnim);
            this.exitAnimCoroutine.push(component.startCoroutine(animationSeries(component, holders, cellExitAnim.animation.deepClone(), cellExitAnim.delay, holders.map(_ => others), token), undefined, token));
        }
        const boardExitAnim = animationPresets['BOARD_EXIT']?.deepClone();
        if (boardExitAnim) {
            this.exitAnimCoroutine.push(this.controller.startCoroutine(animation(component, grid, boardExitAnim, others, token).toGenerator()));
        }
        await Promise.all(this.exitAnimCoroutine.map(c => c.asPromise()));
        // holders.forEach(h => h.destroy());
        grid.destroy();
        console.log("destroying grid");
        // animation(this.animator
        //     , grid, exitAnim, {positive: next}).asPromise().then(() => {
        //     console.log("destroying grid");
        //     grid.destroy();
        // });
    }
}
