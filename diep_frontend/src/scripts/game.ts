import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys, ObstacleTypes } from "./constants.js";
import Obstacle from "./components/obstacle.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    private currentPlayer: Player;
    public width: number;
    public height: number;
    public offset: Point;
    public obstacles: Obstacle[] = [];
    public obstaclesNumber = 12;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.currentPlayer = new Player(this, 'Domin', {bg: 'red', border: 'darkred'}, {x: 100, y: 100});
        this.gameMechanics = new GameMechanics(this.currentPlayer);
        this.offset ={
            x: 0,
            y: 0
        };
        this.generateObstacles();
    };

    public initHandlers(){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        document.addEventListener('mousemove', (e) =>{
            this.offset = this.gameMechanics.getMousePlayerOffset({x: e.x, y: e.y}, this.currentPlayer.position);
        });
    }

    public generateObstacles(){
        const allowedTypes = [ObstacleTypes.basic, ObstacleTypes.medium, ObstacleTypes.hard]

        for(let i = 0; i < this.obstaclesNumber; i++){
            const position = {
                x: this.randomNumber(0, this.width),
                y: this.randomNumber(0, this.height)
            }
            this.obstacles.push(new Obstacle(allowedTypes[this.randomNumber(0, allowedTypes.length)], position))
        }
    };

    public update(ctx: CanvasRenderingContext2D){
        this.currentPlayer.update(this.gameMechanics.keysPressed);
    };

    public draw(ctx: CanvasRenderingContext2D){
        this.currentPlayer.draw(ctx, this.offset.x, this.offset.y);
        this.renderObstacles(ctx);
    }

    public renderObstacles(ctx: CanvasRenderingContext2D){
        this.obstacles.forEach(obstacle =>{
            obstacle.draw(ctx)
        })
    }

    public randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
}