export var Direction;
(function (Direction) {
    Direction["UP"] = "ArrowUp";
    Direction["DOWN"] = "ArrowDown";
    Direction["LEFT"] = "ArrowLeft";
    Direction["RIGHT"] = "ArrowRight";
})(Direction || (Direction = {}));
export const arrows = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
export const allowedKeys = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
export var ObstacleTypes;
(function (ObstacleTypes) {
    ObstacleTypes["basic"] = "basic";
    ObstacleTypes["medium"] = "medium";
    ObstacleTypes["hard"] = "hard";
})(ObstacleTypes || (ObstacleTypes = {}));
export var ObstacleColors;
(function (ObstacleColors) {
    ObstacleColors["obstacle_advanced_color"] = "rgb(23, 156, 23)";
    ObstacleColors["obstacle_advanced_border_color"] = "rgb(5, 109, 5)";
    ObstacleColors["obstacle_basic_color"] = "rgb(72, 45, 230)";
    ObstacleColors["obstacle_basic_border_color"] = "rgb(46, 20, 196)";
    ObstacleColors["obstacle_medium_color"] = "rgb(175, 19, 110)";
    ObstacleColors["obstacle_medium_border_color"] = "rgb(128, 3, 76)";
})(ObstacleColors || (ObstacleColors = {}));
export const playerColors = [
    {
        bg: 'red',
        border: 'darkred'
    },
    {
        bg: 'green',
        border: 'darkgreen'
    },
    {
        bg: 'lightblue',
        border: 'darkblue'
    }
];
export var MessageTypes;
(function (MessageTypes) {
    MessageTypes["createGame"] = "create";
    MessageTypes["move"] = "move";
    MessageTypes["error"] = "error";
    MessageTypes["collision"] = "collision";
    MessageTypes["newPlayer"] = "new_player";
    MessageTypes["initConnection"] = "init";
    MessageTypes["shoot"] = "shoot";
    MessageTypes["bulletsUpdate"] = "bullets_update";
    MessageTypes["bulletCollision"] = "bullet_collision";
    MessageTypes["playerDead"] = "player_dead";
})(MessageTypes || (MessageTypes = {}));
;
