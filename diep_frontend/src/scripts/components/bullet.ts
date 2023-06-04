import { Point } from "../constants.js";

export default class Bullet{
    private position: Point;

    constructor(position: Point) {
        this.position = position;  
    };
}