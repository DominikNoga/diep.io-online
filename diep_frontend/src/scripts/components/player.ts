import PlayerInterface from "../interfaces/player.interface";
import { Point, Direction, Keys, GameObjectColor } from "../constants.js";
import { setHtmlElementPosition } from "../helperFunctions/htmlHelperFunctions.js";
import Game from "../game.js";

export default class Player implements PlayerInterface {
    private _top: number;
    private _left: number;
    private centerX: number;
    private centerY: number;
    public game: Game;
    private _tank: HTMLElement;
    public barrel: HTMLElement;
    public barrelSize = {
        length: 18,
        width: 24
    }
    private clientRect: DOMRect;
    private _radius: number;
    public color: GameObjectColor;
    private _lifeLeft: number;
    private _name: string;
    private _score: number;
    private _angle: number;
    private _speed: number;
    private position: Point;

    public constructor(game: Game, name: string, color: GameObjectColor, startingPosition: Point) {
        this.game = game;
        this._name = name;
        this.color = color;
        this.position = startingPosition;
        this._speed = 3;
        this._score = 0;
        this._lifeLeft = 100;
        this._radius = 25;
    };

    public shoot(): void {

    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // draw the inside
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 2*Math.PI)
        // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI*2);
        ctx.strokeStyle = this.color.border;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    public update(keysPressed: any): void {
        if(keysPressed[Direction.UP]){
            this.position.y -= this.speed;
        }
        if(keysPressed[Direction.DOWN]){
            this.position.y += this.speed;
        }
        if(keysPressed[Direction.LEFT]){
            this.position.x -= this.speed;
        }
        if(keysPressed[Direction.RIGHT]){
            this.position.x += this.speed;
        }
        if(keysPressed[Keys.SPACE]){
            console.log("Implement shooting")
        }
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