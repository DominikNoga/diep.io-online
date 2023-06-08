import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys, ObstacleTypes, Keys } from "./constants.js";
import Obstacle from "./components/obstacle.js";
import Bullet from "./components/bullet.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    private currentPlayer: Player;
    public width: number;
    public height: number;
    public offset: Point;
    public obstacles: Obstacle[] = [];
    public enemies: Player[] = [];
    public obstaclesNumber = 12;
    public firedBullets: Bullet[] = [];
    private shootingInerval: number;
    public mouseDown: boolean = false;
    private _players: Player[] = [];

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.offset ={
            x: 0,
            y: 0
        };
        this.gameMechanics = new GameMechanics();
    };

    public initHandlers(websocket: WebSocket){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
                websocket.send(JSON.stringify({
                    direction: e.key,
                    type: 'move',
                    name: this.currentPlayer.name
                }));
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        document.addEventListener('mousemove', (e) =>{
            this.offset = this.gameMechanics.getMousePlayerOffset({x: e.x, y: e.y}, this.currentPlayer.position);
            this.currentPlayer.calculateOffset(this.offset.x, this.offset.y); 
        });

        document.addEventListener('mousedown', (e) =>{
            if(!this.gameMechanics.keysPressed[Keys.SPACE]){
                this.mouseDown = true;
                if(this.currentPlayer.canShoot)
                    this.currentPlayer.shoot();
                this.shootingInerval = setInterval(() =>{
                    this.currentPlayer.shoot();
                }, this.currentPlayer.shootCooldown);
            }
        });

        document.addEventListener('mouseup', () => {
            this.mouseDown = false;
            clearInterval(this.shootingInerval);
        })
    }

    public generateObstacles(){
        const allowedTypes = [ObstacleTypes.basic, ObstacleTypes.medium, ObstacleTypes.hard]

        for(let i = 0; i < this.obstaclesNumber; i++){
            const position = {
                x: this.randomNumber(0, this.width),
                y: this.randomNumber(0, this.height)
            }
            const randIndex = this.randomNumber(0, allowedTypes.length);
            this.obstacles.push(new Obstacle(allowedTypes[randIndex], position))
        }
    };

    public setCurrentPlayer(player: Player){
        this.currentPlayer = player;
    }

    public update(pos: Point){
        this.currentPlayer.update(pos);
        // this.firedBullets.forEach(bullet => {
        //     bullet.update();
        // });
    };

    public draw(ctx: CanvasRenderingContext2D){
        this.currentPlayer.draw(ctx);
        this.renderObstacles(ctx);
        this.renderEnemies(ctx);
        this.renderBullets(ctx);
    };

    public renderObstacles(ctx: CanvasRenderingContext2D){
        this.obstacles.forEach(obstacle =>{
            obstacle.draw(ctx);
        });
    };

    public renderEnemies(ctx: CanvasRenderingContext2D){
        this.enemies.forEach(enemy=>{
            enemy.draw(ctx);
        })
    }

    public renderBullets(ctx: CanvasRenderingContext2D){
        this.firedBullets.forEach(bullet => {
            bullet.draw(ctx);
        });
    };

    public set players(players: Player[]){
        this._players = players;
    }
    public get players(): Player[] {
        return this._players;
    }

    public randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
}