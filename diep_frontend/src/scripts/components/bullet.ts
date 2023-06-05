import { Point } from "../constants.js";
import Player from "./player.js";

export default class Bullet{
    public position: Point;
    public destination: Point;
    public speed: number;
    public player: Player;
    public radius = 8;
    public angle: number;

    constructor(player: Player) {
        this.player = player;
        this.position = {
            x: this.player.barrelParams.position.x,
            y: this.player.barrelParams.position.y
        };  
        this.speed = this.player.speed + 1;
        this.angle = this.player.barrelParams.angle;
    };

    public draw(ctx: CanvasRenderingContext2D): void {
        // draw the inside
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.player.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI*2);
        ctx.strokeStyle = this.player.color.border;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    public update(): void {
        this.position.x += this.speed*Math.cos(this.angle);
        this.position.y += this.speed*Math.sin(this.angle);
    };
}