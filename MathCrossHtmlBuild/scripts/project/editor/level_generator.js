import Component, { CoroutineInfo } from "../base/Component.js";
import Grid from "../game/algorithm/a_grid.js";
import GameGrid from '../game/grid.js';
import { Equation as GameEquation, PuzzleInfo } from "../common_models.js";
import { loadGame, loadGameData } from "../Main.js";
import Color from "../game/color.js";
import GameCell from "../game/cell.js";
import Vector from "../Vector.js";
import GridEquationGenerator from "../game/algorithm/grid_equation_generator.js";
import SimpleEquationCalculator from "../game/simple_equation_calculator.js";
import Levels from "../levels.js";
import Animator from "../Animator.js";
import { downloadJsonFile } from "../utils/file_utils.js";
function runGenerator(commands) {
    while (true) {
        const command = commands.next();
        if (command.done)
            break;
        console.log(command.value);
        command.value.execute();
    }
}
export default class LevelGenerator extends Component {
    xSizeIF;
    ySizeIF;
    equationCountIF;
    maxValueIF;
    boxCountIF;
    levelIF;
    generateButton;
    generateEquationsButton;
    generatePuzzleButton;
    colorButton;
    levelPreviousButton;
    levelNextButton;
    loadButton;
    saveButton;
    playButton;
    equationCountText;
    boxCountText;
    gridModel = new Grid();
    equations = [];
    plusProbabilitySlider;
    minusProbabilitySlider;
    multiplyProbabilitySlider;
    divideProbabilitySlider;
    runningEffect;
    buttons = [];
    currentCoroutine;
    pickButton;
    fileInput;
    constructor() {
        super();
    }
    _grid;
    get grid() {
        return this._grid ??= this.gameObject;
    }
    get isRunning() {
        return this.runningEffect.isVisible;
    }
    set isRunning(value) {
        this.runningEffect.isVisible = value;
    }
    _runningButton;
    get runningButton() {
        return this._runningButton;
    }
    set runningButton(value) {
        this._runningButton = value;
        this.isRunning = !!value;
    }
    get equationCount() {
        return this.gridModel.equations.some(e => e) ? this.gridModel.equations.length : this.grid.tiles.count(t => !!t.item && t.item.value === '=');
    }
    awake() {
        super.awake();
        this.fileInput = document.getElementById('file-input');
        this.xSizeIF = this.findInputField('x');
        this.ySizeIF = this.findInputField('y');
        this.equationCountIF = this.findInputField('equation_count');
        this.maxValueIF = this.findInputField('max_value');
        this.boxCountIF = this.findInputField('box_count');
        this.levelIF = this.findInputField('level');
        this.generateButton = this.findButton('generate');
        this.pickButton = this.findButton('pick');
        this.generatePuzzleButton = this.findButton('generate_puzzle');
        this.generateEquationsButton = this.findButton('generate_equations');
        this.colorButton = this.findButton('color');
        this.levelPreviousButton = this.findButton('previous');
        this.levelNextButton = this.findButton('next');
        this.loadButton = this.findButton('load');
        this.saveButton = this.findButton('save');
        this.playButton = this.findButton('play');
        this.equationCountText = this.equationCountIF.findChild((c) => c.instVars.Name === 'value');
        this.boxCountText = this.boxCountIF.findChild((c) => c.instVars.Name === 'value');
        this.plusProbabilitySlider = this.findSlider('+');
        this.minusProbabilitySlider = this.findSlider('-');
        this.multiplyProbabilitySlider = this.findSlider('x');
        this.divideProbabilitySlider = this.findSlider('/');
        this.runningEffect = this.findObjectOfType('TextEffect');
        this.saveButton.clicked.push(this.save.bind(this));
        this.loadButton.clicked.push(this.load.bind(this));
        this.playButton.clicked.push(this.play.bind(this));
        this.levelPreviousButton.clicked.push(() => this.loadLevel(parseInt(this.levelIF.text) - 1));
        this.levelNextButton.clicked.push(() => this.loadLevel(parseInt(this.levelIF.text) + 1));
        this.generateButton.clicked.push(this.generateGrid.bind(this));
        this.generatePuzzleButton.clicked.push(this.onClickGeneratePuzzle.bind(this));
        this.generateEquationsButton.clicked.push(this.onClickGenerateEquation.bind(this));
        this.colorButton.clicked.push(this.refreshEquationColors.bind(this));
        this.pickButton.clicked.push(this.pickBoxes.bind(this));
        this.buttons = this.findObjectsOfType('Button');
        this.findButton('download').clicked.push(this.download.bind(this));
        this.findButton('storage').clicked.push(this.loadFromStorage.bind(this));
        this.findButton('game').clicked.push(this.loadFromGame.bind(this));
        this.fileInput.addEventListener('change', async () => {
            if (!this.fileInput.files?.length)
                return;
            const json = await this.fileInput.files[0].text();
            console.log(json);
            Levels.default.loadFromJson(json).then();
            this.load();
        });
    }
    start() {
        super.start();
        this.loadLevelIfFromGame();
    }
    loadLevel(level) {
        console.log('loading level:' + level);
        this.levelIF.text = level.toString();
        this.load();
    }
    load() {
        const level = parseInt(this.levelIF.text);
        const info = Levels.default.getLevel(level)?.info;
        if (!info)
            return;
        this.xSizeIF.text = info.gridSize.x.toString();
        this.ySizeIF.text = info.gridSize.y.toString();
        this.equationCountIF.text = info.equations.length.toString();
        this.boxCountIF.text = info.holders.count(h => !h.isFixed).toString();
        this.generateGrid();
        this.gridModel.reset();
        this.gridModel.resizeGrid(info.gridSize);
        this.gridModel.setEquations(...info.equations);
        this.equations.clear();
        this.equations.push(...info.equations);
        this.refreshEquationColors();
        info.holders.forEach(h => this.createCell(h.coordinate, h.value, h.isFixed));
    }
    play() {
        loadGame(this.runtime, { level: parseInt(this.levelIF.text) });
    }
    loadLevelIfFromGame() {
        const level = loadGameData?.level ?? 0;
        if (level <= 0)
            return;
        this.levelIF.text = level.toString();
        this.load();
    }
    generate() {
        this.generateGrid();
        this.gridModel.resizeGrid(this.grid.gridSize);
        const commands = this.gridModel.generate(parseInt(this.equationCountIF.text));
        runGenerator(commands);
        this.equations.clear();
        this.equations.push(...this.gridModel.equations.map(e => new GameEquation(e.coordinate, e.direction, e.cells.length)));
        this.refreshEquationColors();
    }
    refreshEquationColors() {
        this.equations.forEach(e => {
            const color = new Color(Math.random(), Math.random(), Math.random(), 0.5 + Math.random() * 0.3);
            e.coordinates.forEach(c => this.grid.getTile(c).color = color);
        });
    }
    cellOnPointerDown(cell) {
        cell.highlight = !cell.highlight;
    }
    generateGrid() {
        const size = new Vector(parseInt(this.xSizeIF.text), parseInt(this.ySizeIF.text));
        this.grid.resizeBoard(size);
        this.grid.tiles.forEach(c => {
            c.color = Color.gray.withAlpha(0.05);
            c.outlineColor = Color.clear;
        });
    }
    generateEquations() {
        new GridEquationGenerator(this.gridModel.equations, new Map([
            ["+", this.plusProbabilitySlider.value],
            ["-", this.minusProbabilitySlider.value],
            ["x", this.multiplyProbabilitySlider.value],
            ["/", this.divideProbabilitySlider.value]
        ])).run();
        this.grid.tiles.flatMap(t => t.getAllChildren().filter(c => c.objectType.name === 'MemberCell')).forEach(c => c.destroy());
        this.gridModel.currentCells.forEach(c => {
            this.createCell(c.coordinate, c.value);
        });
    }
    createCell(coordinate, value, isFixed = true) {
        const holder = this.grid.getTile(coordinate);
        // @ts-ignore
        const cell = this.runtime.objects.MemberCell.createInstance(holder.layer.index, holder.x, holder.y, true);
        cell.size = holder.size;
        holder.item = cell;
        cell.bgColor = holder.color;
        cell.textColor = Color.black;
        cell.init({ value });
        cell.pointerDown.push(c => this.cellOnPointerDown(c));
        cell.highlight = !isFixed;
        cell.outlineColor = Color.clear;
    }
    pickBoxes() {
        this.grid.tiles.filter(t => t.item).map(t => t.item).forEach(t => t.highlight = false);
        const equations = [...this.equations];
        let boxesLeft = parseInt(this.boxCountIF.text);
        while (equations.length > 0 && boxesLeft > 0) {
            const equation = equations.getRandom();
            const coordinate = equation.numberCells.getRandom();
            this.grid.getTile(coordinate).item.highlight = true;
            boxesLeft--;
            equations.removeAll(e => e.coordinates.some(c => c.x === coordinate.x && c.y === coordinate.y));
        }
        const availableBoxes = this.gridModel.equations.flatMap(e => e.numberCells.map(n => this.grid.getTile(n.coordinate).item)).filter(c => !c.highlight).distinct();
        const cells = availableBoxes.getRandoms(Math.min(availableBoxes.length, boxesLeft));
        cells.forEach(c => c.highlight = true);
    }
    // noinspection JSUnusedGlobalSymbols
    checkAllEquations() {
        const equations = this.gridModel.equations.filter(e => SimpleEquationCalculator.calculate(e.cells[0].value, e.cells[1].value, e.cells[2].value) !== parseInt(e.cells[4].value));
        equations.forEach(e => console.log('result:' + e.coordinates));
        if (!equations.length)
            alert('All equations are correct!');
    }
    update() {
        super.update();
        this.equationCountText.text = this.equationCount.toString();
        console.log('length:' + this.grid.tiles.filter(h => {
            if (!h.item)
                return false;
            console.log(h.item.value, /^[0-9]*$/.test(h.item.value));
            return /^[0-9]*$/.test(h.item.value);
        }).length);
        this.boxCountText.text = `${this.grid.tiles.count(h => !!h.item && h.item.highlight)}/${this.grid.tiles.filter(h => {
            if (!h.item)
                return false;
            console.log(h.item.value, /^[0-9]*$/.test(h.item.value));
            return /^[0-9]*$/.test(h.item.value);
        }).length}`;
        if (this.isRunning) {
            this.buttons.forEach(b => b.intractable = b === this.runningButton);
            return;
        }
        this.updateButtonIntractability();
    }
    save() {
        const level = parseInt(this.levelIF.text);
        const info = new PuzzleInfo(this.grid.gridSize, this.grid.tiles.filter(t => t.item).map(t => t.item).cast()
            .map(c => ({
            coordinate: c.holder.coordinate,
            value: c.value,
            isFixed: !c.highlight
        })), this.equations);
        Levels.default.addOrUpdate(level, info);
        Levels.default.saveToStorage().then();
        console.log('saving level');
    }
    download() {
        downloadJsonFile({ levels: Levels.default.levels }, 'levels.json');
    }
    async loadFromStorage() {
        await Levels.default.loadFromStorage();
        this.load();
    }
    async loadFromGame() {
        await Levels.default.loadFromFile();
        this.load();
    }
    findButton(name) {
        return this.findObject(name, 'Button');
    }
    findInputField(name) {
        return this.findObject(name, 'TextInput');
    }
    findSlider(name) {
        return this.findObject(name, 'SliderBar');
    }
    findObject(name, type) {
        // @ts-ignore
        return [...this.runtime.objects[type].instances()].find(o => o.instVars.Name === name);
    }
    updateButtonIntractability() {
        this.buttons.forEach(b => b.intractable = true);
        const level = parseInt(this.levelIF.text);
        if (!isNaN(level)) {
            const hasLevelSaved = !!Levels.default.getLevel(level);
            this.loadButton.intractable = hasLevelSaved;
            this.playButton.intractable = hasLevelSaved;
            this.levelNextButton.intractable = !!Levels.default.getLevel(level + 1);
            this.levelPreviousButton.intractable = !!Levels.default.getLevel(level - 1);
        }
        else {
            this.levelNextButton.intractable = false;
            this.levelPreviousButton.intractable = false;
            this.loadButton.intractable = false;
            this.saveButton.intractable = false;
        }
    }
    onClickGenerateEquation() {
        if (this.isRunning) {
            this.stopRunCoroutine();
            return;
        }
        if (!this.runtime.keyboard.isKeyDown('LeftControl')) {
            this.runningButton = this.generatePuzzleButton;
            this.currentCoroutine = this.startCoroutine(this.runCoroutine(this.generateEquations.bind(this), () => this.equations.every(e => e.numberCells.every(c => {
                const holder = this.grid.getTile(c);
                const value = holder.item.value;
                return value === '=' || parseInt(value) <= parseInt(this.maxValueIF.text) && parseInt(value) > 0;
            }))));
        }
        else {
            this.generateEquations();
        }
    }
    onClickGeneratePuzzle() {
        if (this.isRunning) {
            this.stopRunCoroutine();
            console.log('stop generate puzzle');
            return;
        }
        if (!this.runtime.keyboard.isKeyDown('LeftControl')) {
            this.runningButton = this.generatePuzzleButton;
            this.currentCoroutine = this.startCoroutine(this.runCoroutine(this.generate.bind(this), () => this.equationCount >= parseInt(this.equationCountIF.text)));
        }
        else {
            this.generate();
        }
    }
    *runCoroutine(action, until, delay = 1) {
        do {
            action();
            yield Animator.delayFuncYield(this, delay);
        } while (!until());
        this.stopRunCoroutine();
    }
    stopRunCoroutine() {
        this.stopCoroutine(this.currentCoroutine);
        this.runningButton = undefined;
        this.currentCoroutine = undefined;
    }
}
