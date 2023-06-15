import { ObstacleColors, ObstacleTypes } from "../constants.js";
import { drawObstacleLifeBar } from "../helper_services/playerDrawingHelperFunctions.js";
const bulletDamage = 20;
export default class Obstacle {
    constructor(type, position, id) {
        this.color = {
            bg: "",
            border: ""
        };
        switch (type) {
            case ObstacleTypes.basic:
                this.edges = 3;
                this.color.bg = ObstacleColors.obstacle_basic_color;
                this.color.border = ObstacleColors.obstacle_basic_border_color;
                this.maxLife = bulletDamage;
                break;
            case ObstacleTypes.medium:
                this.edges = 4;
                this.color.bg = ObstacleColors.obstacle_medium_color;
                this.color.border = ObstacleColors.obstacle_medium_border_color;
                this.maxLife = bulletDamage * 2;
                break;
            case ObstacleTypes.hard:
                this.color.bg = ObstacleColors.obstacle_advanced_color;
                this.color.border = ObstacleColors.obstacle_advanced_border_color;
                this.edges = 5;
                this.maxLife = bulletDamage * 3;
                break;
            default:
                console.log(`No such obstacle type: ${type}`);
                break;
        }
        this.type = type;
        this.position = position;
        this.radius = 25;
        this.lifeLeft = this.maxLife;
        this.id = id;
    }
    draw(ctx) {
        this.drawPolygon(ctx, this.color.border, this.radius + 10);
        this.drawPolygon(ctx, this.color.bg, this.radius);
        drawObstacleLifeBar(ctx, this);
    }
    drawPolygon(ctx, color, radius) {
        const angle = 2 * Math.PI / this.edges;
        ctx.beginPath();
        ctx.moveTo(this.position.x + radius * Math.cos(0), this.position.y + radius * Math.sin(0));
        for (let i = 1; i <= this.edges; i++) {
            ctx.lineTo(this.position.x + radius * Math.cos(i * angle), this.position.y + radius * Math.sin(i * angle));
        }
        ctx.fillStyle = color;
        ctx.fill();
    }
}
