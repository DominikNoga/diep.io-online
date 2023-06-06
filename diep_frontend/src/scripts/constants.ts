export enum Direction {
    UP = 'ArrowUp',
    DOWN = 'ArrowDown',
    LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight'
}

export const arrows = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];

export enum Keys{
    SPACE = ' ',
}

export type Point = {
    x: number,
    y: number
}

export const allowedKeys = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT, Keys.SPACE]

export type GameObjectColor = {
    bg: string,
    border: string
}

export enum ObstacleTypes{
    basic = 'basic',
    medium = 'medium',
    hard = 'hard'
}

export enum ObstacleColors{
    obstacle_advanced_color = 'rgb(23, 156, 23)',
    obstacle_advanced_border_color = 'rgb(5, 109, 5)',
    obstacle_basic_color = 'rgb(72, 45, 230)',
    obstacle_basic_border_color = 'rgb(46, 20, 196)',
    obstacle_medium_color = 'rgb(175, 19, 110)',
    obstacle_medium_border_color = 'rgb(128, 3, 76)',
}

export type ObstacleTypeString = ObstacleTypes.basic | ObstacleTypes.medium | ObstacleTypes.hard;

export enum MessageTypes {
    createGame = 'create',
    move = 'move',
    error = 'error',
    collision = 'collision'
};