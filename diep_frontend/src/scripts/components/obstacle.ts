import { Point, ObstacleColors, ObstacleTypes, ObstacleTypeString } from "../constants.js";
import Game from "../game.js";
import { drawObstacleLifeBar } from "../helper_services/playerDrawingHelperFunctions.js";


export default class Obstacle{
    public position: Point;
    public lifeLeft: number;
    public edges: number;
    public radius: number;
    public type: ObstacleTypeString;
    public maxLife: number;
    public id;
    public color = {
        bg: "",
        border: ""
    };

    constructor(type: ObstacleTypeString, position: Point,id:number){
        switch (type) {
            case ObstacleTypes.basic:
              this.edges = 3;
              this.color.bg = ObstacleColors.obstacle_basic_color;
              this.color.border = ObstacleColors.obstacle_basic_border_color;
              this.maxLife=5;
              break;
            case ObstacleTypes.medium:
              this.edges = 4;
              this.color.bg = ObstacleColors.obstacle_medium_color;
              this.color.border = ObstacleColors.obstacle_medium_border_color;
              this.maxLife=10;
              break;
            case ObstacleTypes.hard:
              this.color.bg = ObstacleColors.obstacle_advanced_color;
              this.color.border = ObstacleColors.obstacle_advanced_border_color
              this.edges = 5;
              this.maxLife=15;
              break;
            default:
              console.log(`No such obstacle type: ${type}`);
              break;
        }
        this.type=type;
        this.position = position;
        this.radius = 25;
        this.lifeLeft=this.maxLife;
        this.id=id;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.drawPolygon(ctx, this.color.border, this.radius + 10);
        this.drawPolygon(ctx, this.color.bg, this.radius);
        drawObstacleLifeBar(ctx,this);
        
    }

    public drawPolygon(ctx: CanvasRenderingContext2D, color: string, radius: number): void {
		const angle = 2*Math.PI/this.edges;
 		ctx.beginPath();
		ctx.moveTo (this.position.x +  radius*Math.cos(0), this.position.y +  radius*Math.sin(0));          
 		for (let i = 1; i <= this.edges; i++) {
			 ctx.lineTo (this.position.x + radius*Math.cos(i * angle), this.position.y + radius*Math.sin(i * angle));
		}
        ctx.fillStyle = color;
 		ctx.fill();
    }
}