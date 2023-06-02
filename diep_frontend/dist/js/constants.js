export var Direction;
(function (Direction) {
    Direction["UP"] = "ArrowUp";
    Direction["DOWN"] = "ArrowDown";
    Direction["LEFT"] = "ArrowLeft";
    Direction["RIGHT"] = "ArrowRight";
})(Direction || (Direction = {}));
export const arrows = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
export var Keys;
(function (Keys) {
    Keys["SPACE"] = " ";
})(Keys || (Keys = {}));
export const MOVE_VALUE = 4;
export const allowedKeys = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT, Keys.SPACE];
