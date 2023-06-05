import { Point } from "../constants.js";

export default class Bullet{
    public position: Point;
    public destination: Point;

    constructor(position: Point, destination: Point) {
        this.position = position;  
        this.destination = destination;
    };
}