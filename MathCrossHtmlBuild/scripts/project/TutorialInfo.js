import Vector from "./Vector.js";
import { PuzzleInfo } from "./common_models.js";
export var ActionType;
(function (ActionType) {
    ActionType[ActionType["Click"] = 0] = "Click";
    ActionType[ActionType["Drag"] = 1] = "Drag";
})(ActionType || (ActionType = {}));
