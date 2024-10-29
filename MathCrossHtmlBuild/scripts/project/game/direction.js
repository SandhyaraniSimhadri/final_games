import Vector from "../Vector.js";
export var Direction;
(function (Direction) {
    Direction[Direction["Right"] = 0] = "Right";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Up"] = 3] = "Up";
})(Direction || (Direction = {}));
export function toVector(direction) {
    switch (direction) {
        case Direction.Right:
            return new Vector(1, 0);
        case Direction.Down:
            return new Vector(0, 1);
        case Direction.Left:
            return new Vector(-1, 0);
        case Direction.Up:
            return new Vector(0, -1);
    }
}
