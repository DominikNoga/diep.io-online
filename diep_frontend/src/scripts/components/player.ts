import PlayerInterface from "../interfaces/player.interface";
import { Point } from "../constants.js";
import { setHtmlElementPosition } from "../helperFunctions/htmlHelperFunctions.js";

export default class Player implements PlayerInterface {
    private _top: number;
    private _left: number;
    private centerX: number;
    private centerY: number;
    private _tank: HTMLElement;
    public barrel: HTMLElement;
    public barrelSize = {
        length: 18,
        width: 24
    }
    private clientRect: DOMRect;
    private _radius: number;
    private _color: string;
    private _lifeLeft: number;
    private _name: string;
    private _score: number;
    private _angle: number;
    private _speed: number;

    public constructor(tank: HTMLElement, name: string) {
        this._tank = tank;
        this.barrel = this.tank.querySelector('.barrel');
        this._top = Number(this.tank.style.top.slice(0, -2));
        this._left = Number(this.tank.style.left.slice(0, -2));
        this._name = name;
        this._speed = 3;
        this._score = 0;
        this.clientRect = this.tank.getBoundingClientRect();
        this._lifeLeft = 100;
        this._radius = 25;
    };

    public calculateCenters(): Point{
        const x = this.clientRect.left + this.clientRect.width/2;
        const y = this.clientRect.top + this.clientRect.height/2;
        return {
            x: x,
            y: y
        }
    };

    public shoot(): void {

    }

    public get tank(): HTMLElement {
        return this._tank;
    };

    public set tank(tank: HTMLElement){
        this._tank = tank;
        this.barrel = this.tank.querySelector('.barrel');
    };

    public get top(): number {
        return this._top;
    };

    public set top(top: number){
        this._top = top;
    };

    public get left(): number {
        return this._left;
    };

    public set left(left: number){
        this._left = left;
    };

    public get radius(): number {
        return this._radius;
    };

    public set radius(size: number) {
        this._radius = size;
    };
    
    public set color(color: string) {
        this._color = color;
    };
    
    public get color(): string {
        return this._color;
    };    

    public get lifeLeft(): number {
        return this._lifeLeft;
    };
      
    public set lifeLeft(lifeLeft: number) {
        this._lifeLeft = lifeLeft;
    };
    
    public get name(): string {
        return this._name;
    };
    
    public set name(value: string) {
        this._name = value;
    };
    
    public get score(): number {
        return this._score;
    };
    
    public set score(value: number) {
        this._score = value;
    };

    get angle() {
        return this._angle;
    };
    
    set angle(value) {
        this._angle = value;
    };

    get speed(): number {
        return this._speed;
    };
    
    set speed(value: number) {
        this._speed = value;
    };
}