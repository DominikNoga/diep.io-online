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

export const startingRadius = 25;

export const startingBarellPosition = {
    left: 50,
    top: 25
}