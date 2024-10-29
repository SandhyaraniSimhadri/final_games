// noinspection JSUnusedGlobalSymbols
export default class GameManager {
    static _instance;
    static loadGameData = null;
    constructor() {
        // Initialize the game manager
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }
    loadGame(runtime, score, isNew = true) {
        GameManager.loadGameData = new LoadGameData(score, isNew);
        // [...runtime.objects.MemberCell.instances()].forEach(i => {
        //     console.log("Destroying", i);
        //     i.destroy();
        // });
        runtime.goToLayout("Game");
    }
}
class LoadGameData {
    score;
    isNew;
    constructor(score, isNew = true) {
        this.score = score;
        this.isNew = isNew;
    }
}
