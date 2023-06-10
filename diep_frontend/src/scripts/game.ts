import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys, ObstacleTypes, Keys, MessageTypes } from "./constants.js";
import Obstacle from "./components/obstacle.js";
import Bullet from "./components/bullet.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    private currentPlayer: Player;
    public width: number;
    public height: number;
    public offset: Point;
    public obstacles: Obstacle[] = [];
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
        const position = {
            x: 100,
            y: 100
        }
        this.obstacles.push(new Obstacle(ObstacleTypes.hard,position))
        this.gameMechanics = new GameMechanics();
    };

    public initHandlers(websocket: WebSocket){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
                websocket.send(JSON.stringify({
                    direction: this.gameMechanics.keysPressed,
                    type: MessageTypes.move,
                    name: this.currentPlayer.name
                }));
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        document.addEventListener('mousemove', (e) =>{
            websocket.send(JSON.stringify({
                offset: this.gameMechanics.getMousePlayerOffset({x: e.x, y: e.y}, this.currentPlayer.position),
                name: this.currentPlayer.name,
                type: MessageTypes.barrelMoved
            }))
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

    public update(position: Point, name: string){
        this.updatePlayers(position, name)
        // this.firedBullets.forEach(bullet => {
        //     bullet.update();
        // });
    };

    private updatePlayers(position: Point, name: string){
        try {   
            const index = this.findIndexPlayerByName(name);
            this.players[index].position = position;
        } catch (error) {
            alert(`Frontend Error: ${error}`);
        }
        
    }

    public draw(ctx: CanvasRenderingContext2D){
        this.renderPlayers(ctx);
        this.renderObstacles(ctx);
        this.renderBullets(ctx);
    };

    public renderObstacles(ctx: CanvasRenderingContext2D){
        this.obstacles.forEach(obstacle =>{
            obstacle.draw(ctx);
        });
    };

    public renderPlayers(ctx: CanvasRenderingContext2D){
        this.players.forEach(player=>{
            player.draw(ctx);
        });
    };

    public renderBullets(ctx: CanvasRenderingContext2D){
        this.firedBullets.forEach(bullet => {
            bullet.draw(ctx);
        });
    };

    public set players(players: Player[]){
        this._players = players;
    };

    public get players(): Player[] {
        return this._players;
    };

    public randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

    public getCurrentPlayer(): Player { 
        return this.currentPlayer;
    };

    public findIndexPlayerByName(name: string): number {
        const player = this.players.find(p => p.name === name);
        const index = this.players.indexOf(player);
        if(index !== -1) {
            return index;
        }
        else throw new Error(`Player ${name} not found`);
    }
}