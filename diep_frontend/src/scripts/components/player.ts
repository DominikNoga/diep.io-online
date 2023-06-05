import PlayerInterface from "../interfaces/player.interface";
import { Point, Direction, Keys, GameObjectColor } from "../constants.js";
import Game from "../game.js";

export default class Player implements PlayerInterface {
    public game: Game;
    public barrelParams = {
        length: 3,
        width: 30,
        color: 'darkgray',
        angle: Math.PI / 2,
    }
    private _radius: number;
    public color: GameObjectColor;
    private _lifeLeft: number;
    public _name: string;
    private _score: number;
    private _angle: number;
    private _speed: number;
    public position: Point;

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

    public draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        const newOffset = this.calculateOffset(offsetX, offsetY) 
        this.drawBarrel(newOffset.x, newOffset.y, ctx);
        this.drawPlayerObject(ctx);
    }

    private drawPlayerObject(ctx: CanvasRenderingContext2D): void {
        // draw the inside
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI*2);
        ctx.strokeStyle = this.color.border;
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    private drawBarrel(x: number, y: number,ctx: CanvasRenderingContext2D){
        // border
        ctx.beginPath()
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.barrelParams.width + 6;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath(); 
        
        // inside
        ctx.beginPath()
        ctx.lineWidth = this.barrelParams.width;
        ctx.strokeStyle = this.barrelParams.color;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath(); 
    };

    private calculateOffset(offsetX: number, offsetY: number): Point {
        this.barrelParams.angle = Math.atan2(offsetY, offsetX);
        const x = this.radius * this.barrelParams.length * Math.cos(this.barrelParams.angle) + this.position.x
        const y = this.radius * this.barrelParams.length * Math.sin(this.barrelParams.angle) + this.position.y
        return {x, y};
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