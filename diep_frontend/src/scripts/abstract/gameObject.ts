import { Point } from "../constants.js";

export default class GameObject extends HTMLElement{
    public position: Point;
    public object: HTMLElement;


    constructor(){
        super();
        this.position.x = Number(this.style.left);
        this.position.y = Number(this.style.top);
    }
}