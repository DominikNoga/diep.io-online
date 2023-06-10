import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys, ObstacleTypes, Keys, MessageTypes } from "./constants.js";
import Obstacle from "./components/obstacle.js";
import Bullet from "./components/bullet.js";
import { throttle, debounce } from "./helper_services/delayRequest.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    public currentPlayer: Player;
    public width: number;
    public height: number;
    public offset: Point;
    public obstacles: Obstacle[] = [];
    public enemies: Player[] = [];
    public obstaclesNumber = 12;
    public firedBullets: Bullet[] = [];
    private shootingInerval: number;
    public mouseDown: boolean = false;

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
                this.sendMoveMessage(websocket);
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        document.addEventListener('mousemove', (e) =>{
            this.currentPlayer.offset = this.gameMechanics.getMousePlayerOffset({x: e.x, y: e.y}, this.currentPlayer.position);
            this.sendBarrelOffset(websocket);
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

    public setCurrentPlayer(player: Player){
        this.currentPlayer = player;
    }

    public update(position: Point, name: string){
        this.updatePlayer(position, name)
        // this.firedBullets.forEach(bullet => {
        //     bullet.update();
        // });
    };

    private updatePlayer(position: Point, name: string){
        if(name === this.currentPlayer.name){
            this.currentPlayer.update(position);
            return;
        }
        try {   
            const index = this.findEnemyIndexByName(name);
            this.enemies[index].position = position;
        } catch (error) {
            alert(`Frontend Error: ${error}`);
        }
        
    }

    public draw(ctx: CanvasRenderingContext2D){
        this.currentPlayer.draw(ctx);
        this.renderEnemies(ctx);
        this.renderObstacles(ctx);
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
        });
    };

    public renderBullets(ctx: CanvasRenderingContext2D){
        this.firedBullets.forEach(bullet => {
            bullet.draw(ctx);
        });
    };

    public findEnemyIndexByName(name: string): number {
        const enemy = this.enemies.find(p => p.name === name);
        const index = this.enemies.indexOf(enemy);
        if(index !== -1) {
            return index;
        }
        else throw new Error(`Player ${name} not found`);
    }

    private sendBarrelOffset = throttle((websocket: WebSocket) =>{
        websocket.send(JSON.stringify({
            barrelPosition: this.currentPlayer.barrelParams.position,
            barrelAngle: this.currentPlayer.barrelParams.angle,
            name: this.currentPlayer.name,
            type: MessageTypes.barrelMoved
        }))
    }, 500);

    private sendMoveMessage = throttle((websocket) => {
        websocket.send(JSON.stringify({
            direction: this.gameMechanics.keysPressed,
            type: MessageTypes.move,
            name: this.currentPlayer.name
        }));
    }, 1000/40)
}