import { Point, GameObjectColor, MessageTypes } from "../constants.js";
import Game from "../game.js";
import Bullet from "./bullet.js";
import { drawBarrel, drawLifeBar, drawNameBar, drawPlayerObject } from "../helper_services/playerDrawingHelperFunctions.js";
import { deepCopy } from "../helper_services/deepCopy.js";

export default class Player {
    public game: Game;
    public barrelParams = {
        length: 3,
        width: 30,
        color: 'darkgray',
        angle: Math.PI / 2,
        position: {
            x: 0,
            y: 0
        }
    }
    private _radius: number;
    public color: GameObjectColor;
    private _lifeLeft: number;
    private _name: string;
    private _score: number;
    private _angle: number;
    private _speed: number;
    public position: Point;
    public canShoot: boolean = true;
    public shootCooldown: number;
    public offset: Point;

    public constructor(game: Game, name: string, color: GameObjectColor, startingPosition: Point) {
        this.game = game;
        this._name = name;
        this.color = color;
        this.position = startingPosition;
        this._score = 0;
        this._lifeLeft = 100;
        this._radius = 25;
        this._speed = 5
        this.shootCooldown = 700; // value in miliseconds
        this.offset = {
            x: 0,
            y: 0,
        }
    };
    
    public draw(ctx: CanvasRenderingContext2D): void {
        this.calculateOffset(this.offset.x, this.offset.y); 
        this.drawNameBar(ctx);
        this.drawLifeBar(ctx);
        this.drawBarrel(ctx);
        this.drawPlayerObject(ctx);
    }

    private drawPlayerObject(ctx: CanvasRenderingContext2D): void {
        drawPlayerObject(ctx, this);
    };

    private drawBarrel(ctx: CanvasRenderingContext2D){
        drawBarrel(ctx, this);
    };

    private drawNameBar(ctx: CanvasRenderingContext2D){
        drawNameBar(ctx, this);
    }

    private drawLifeBar(ctx: CanvasRenderingContext2D){
        drawLifeBar(ctx, this);
    }

    public calculateOffset(offsetX: number, offsetY: number): void {
        this.barrelParams.angle = Math.atan2(offsetY, offsetX);
        this.barrelParams.position.x = this.radius * this.barrelParams.length * Math.cos(this.barrelParams.angle) + this.position.x
        this.barrelParams.position.y = this.radius * this.barrelParams.length * Math.sin(this.barrelParams.angle) + this.position.y
    }

    public update(position: Point)
    {
        this.position = position;
    }
    public shoot(websocket: WebSocket): void{
        const barrelCopy = deepCopy(this.barrelParams);
        const bullet = new Bullet(barrelCopy.position, barrelCopy.angle, this.color, (Math.random()*10e9).toString());
        this.game.firedBullets.push(bullet)
        JSON.stringify({
            playerName: this.name,
            bulletPosition: bullet.position,
            type: MessageTypes.shoot,
            bulletColor: bullet.color,
            bulletId : bullet.id,
            clientId: this.game.clientId
        })
        this.canShoot = false;
        setTimeout(() =>{
            this.canShoot = true;   
        }, this.shootCooldown);
    }

    public setBarrelParams(barrelAngle: number, barrelPosition: Point){
        this.barrelParams.angle = barrelAngle;
        this.barrelParams.position = barrelPosition
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