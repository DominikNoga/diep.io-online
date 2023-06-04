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
export const allowedKeys = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT, Keys.SPACE];
export const startingRadius = 25;
export const startingBarellPosition = {
    left: 50,
    top: 25
};
