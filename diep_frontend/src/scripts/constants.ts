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

export const MOVE_VALUE = 4;

export type Point = {
    x: number,
    y: number
}

export const allowedKeys = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT, Keys.SPACE]
