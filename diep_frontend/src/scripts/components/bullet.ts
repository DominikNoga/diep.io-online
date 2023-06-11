import { GameObjectColor, MessageTypes, Point, playerColors } from "../constants.js";

export default class Bullet{
    public position: Point;
    public destination: Point;
    public speed: number;
    public radius = 8;
    public angle: number;
    public id: string;

    constructor(position: Point, angle: number, public color: GameObjectColor, id: string) {
        this.position = position  
        this.speed = 5;
        this.angle = angle;
        this.id = id;
    };

    public draw(ctx: CanvasRenderingContext2D): void {
        // draw the inside
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle =this.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI*2);
        ctx.strokeStyle = this.color.border;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    public update(): void {
        this.position.x += this.speed*Math.cos(this.angle);
        this.position.y += this.speed*Math.sin(this.angle);
    };
}