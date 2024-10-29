import Scene from "./Scene.js";
import LevelGenerator from "./editor/level_generator.js";
export class LevelEditorScene extends Scene {
    constructor(runtime, data = undefined) {
        super(runtime);
        const levelGenerator = new LevelGenerator();
        this.findObjectsOfType("Grid").forEach(g => g.addComponentsSafe(levelGenerator));
        if (data?.level ?? false)
            levelGenerator.loadLevel(data.level);
    }
}
