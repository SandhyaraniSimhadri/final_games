// noinspection ES6UnusedImports
import MainScene from "./MainScene.js";
// import Shape from "./Shape.js";
import Animator from './Animator.js';
import PrefManager from './PrefManager.js';
// import NextShapeViewerTile from './NextShapeViewerTile.js';
// import BoardNextShapeViewer from './BoardNextShapeViewer.js';
import * as ex from './import_extensions.js';
import HighlightButton from "./HighlightButton.js";
import TutorialScene from "./TutorialScene.js";
import HandEffect from "./HandEffect.js";
import Levels from "./levels.js";
import Grid from "./game/grid.js";
import MemberCell from "./game/member_cell.js";
import CellPool from "./game/cell_pool.js";
import CellHolder from "./game/cellHolder.js";
import PointerEventSystem from "./PointerEventSystem.js";
import { findObjectOfType, registerInstanceClass } from "./utils/game_utils.js";
import { LevelEditorScene } from "./LevelEditorScene.js";
import Button from "./editor/button.js";
import Presets from "./presets/presets.js";
import ToastEffect from "./ToastEffect.js";
import { loadJsonFileFromPath } from "./FileUtils.js";
import { loadPresets } from "./PresetsLoader.js";
import AdsManager from "./adsmanager/ads_manager.js";
import HorizontalLayout from "./Entities/horizontal_layout.js";
import { animation } from "./animation_utils.js";
import WinParticle from "./game/win_particle.js";
import WinParticles from "./game/win_particles.js";
export let scene = null;
export let prefs = null;
export let loadGameData;
export let colorPresets;
export let gradientPresets;
export let animationPresets;
export let spritePresets;
export let audioPresets;
export let tweenPresets;
export let valuePresets;
export let boolPresets;
export let settings;
export function levels() {
    return Levels.default.levels;
}
const readyBeforeProjectStart = [];
runOnStartup(async (runtime) => {
    // Code to run on the loading screen.
    // Note layouts, objects etc. are not yet available.
    window.gRuntime = runtime;
    registerObjects(runtime);
    runtime.getLayout("Game").addEventListener("beforelayoutstart", () => {
        scene = new MainScene(runtime, loadGameData);
    });
    runtime.getLayout("Editor").addEventListener("beforelayoutstart", () => {
        scene = new LevelEditorScene(runtime, loadGameData);
    });
    runtime.getLayout("Tutorial").addEventListener("beforelayoutstart", () => {
        console.log("Tutorial layout start");
        scene = new TutorialScene(runtime);
    });
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
function registerObjects(runtime) {
    runtime.objects.Animator.setInstanceClass(Animator);
    runtime.objects.TutorialAddButton.setInstanceClass(HighlightButton);
    runtime.objects.HandEffect.setInstanceClass(HandEffect);
    runtime.objects.Grid.setInstanceClass(Grid);
    runtime.objects.MemberCell.setInstanceClass(MemberCell);
    registerInstanceClass(runtime, 'CellPool', CellPool);
    registerInstanceClass(runtime, 'CellHolder', CellHolder);
    registerInstanceClass(runtime, 'Button', Button);
    registerInstanceClass(runtime, 'ToastEffect', ToastEffect);
    registerInstanceClass(runtime, 'AnimatorGlobal', Animator);
    registerInstanceClass(runtime, "HorizontalLayout", HorizontalLayout);
    registerInstanceClass(runtime, "WinParticle", WinParticle);
    registerInstanceClass(runtime, "WinParticles", WinParticles);
}
export async function refreshTheme(runtime) {
    console.log("refresh theme", prefs.getItem('theme', settings["theme"]));
    const presets = await loadPresets(runtime, prefs.getItem('theme', settings["theme"]));
    colorPresets = presets.colorPresets;
    gradientPresets = presets.gradientPresets;
    spritePresets = presets.spritePresets;
    audioPresets = presets.audioPresets;
    tweenPresets = presets.tweenPresets;
    valuePresets = presets.valuePresets;
    boolPresets = presets.boolPresets;
    animationPresets = presets.animationPresets;
}
async function OnBeforeProjectStart(runtime) {
    runtime.addEventListener("tick", () => Tick(runtime));
    PointerEventSystem.instance;
    await loadSettings(runtime);
    prefs = new PrefManager(runtime);
    prefs.load().then();
    readyBeforeProjectStart.push(prefs);
    readyBeforeProjectStart.push(Levels.default);
    console.log("themes", prefs.getItem('theme', settings["theme"]));
    await waitUntilReady();
    await refreshTheme(runtime);
    // const box = runtime.objects.box.getFirstInstance()!;
    // box.effects.forEach(e => console.log(e.name));
    await AdsManager.instance.init();
}
function waitUntilReady() {
    readyBeforeProjectStart.removeAll(r => r.isReady);
    return new Promise((resolve, reject) => {
        const onReady = (r) => {
            r.ready.remove(onReady);
            readyBeforeProjectStart.remove(r);
            if (readyBeforeProjectStart.length === 0)
                resolve();
        };
        readyBeforeProjectStart.filter(r => !r.isReady).forEach(r => r.ready.push(onReady));
    });
}
function wait() {
    return new Promise(() => {
    });
}
function Tick(runtime) {
    if (scene) {
        scene.update(runtime.dt);
    }
}
async function loadSettings(runtime) {
    settings = await loadJsonFileFromPath(runtime, "settings.json");
}
export function loadGame(runtime, data) {
    loadGameData = data;
    runtime.goToLayout("Game");
}
export function loadLevelEdit(runtime, data) {
    loadGameData = data;
    runtime.goToLayout('Editor');
}
export async function loadOut(runtime, func) {
    const layer = runtime.layout.getLayer('Loading');
    if (!layer) {
        func();
        return;
    }
    layer.isVisible = true;
    const instance = findObjectOfType(runtime, 'LoadingBg');
    const anim = {
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        }
    };
    await animation(Animator.create(runtime), instance, anim).asPromise();
    func();
    // layer!.isVisible = false;
}
