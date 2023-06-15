import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys, ObstacleTypes, MessageTypes } from "./constants.js";
import Obstacle from "./components/obstacle.js";
import Bullet from "./components/bullet.js";
import { throttle } from "./helper_services/delayRequest.js";

export default class Game{
    private gameMechanics: GameMechanics
    public currentPlayer: Player;
    public width: number;
    public height: number;
    public obstacles: Obstacle[] = [];
    public enemies: Player[] = [];
    public firedBullets: Bullet[] = [];
    private shootingInerval: number;
    public clientId: string;

    constructor(width: number, height: number, clientId: string){
        this.width = width;
        this.height = height;
        this.gameMechanics = new GameMechanics();
        this.clientId = clientId;
    };

    public initHandlers(websocket: WebSocket){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
                // this.sendMoveMessage(websocket);
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        document.addEventListener('mousemove', (e) =>{
            this.currentPlayer.offset = this.gameMechanics.getMousePlayerOffset({x: e.x, y: e.y}, this.currentPlayer.position);
         });

        document.addEventListener('mousedown', (e) =>{
            if(e.button == 0){
                if(this.currentPlayer.canShoot)
                    this.currentPlayer.shoot(websocket);
                this.shootingInerval = setInterval(() =>{
                    this.currentPlayer.shoot(websocket);
                }, this.currentPlayer.shootCooldown);
            }
        });

        document.addEventListener('mouseup', () => {
            clearInterval(this.shootingInerval);
        })
    }

    public setCurrentPlayer(player: Player){
        this.currentPlayer = player;
    }

    public updateCurrentPlayer(websocket: WebSocket){
        this.currentPlayer.update(this.gameMechanics.keysPressed, websocket, this.clientId);
    };

    public updateEnemies(position: Point, name: string){
        try {   
            const index = this.findEnemyIndexByName(name);
            this.enemies[index].position = position;
        } catch (error) {
            alert(`Frontend Error: ${error}`);
        }
    }

    public updateBullets(websocket: WebSocket){
        const bulletsToDelete: string[] = [];
        this.firedBullets.forEach(bullet => {
            this.objectInMap(bullet) ? bullet.update() : bulletsToDelete.push(bullet.id);
        });
        const updatedBullets = this.firedBullets.map(bullet => ({
            id: bullet.id,
            position: bullet.position
        }));
        websocket.send(JSON.stringify({
            updatedBullets: updatedBullets,
            type: MessageTypes.bulletsUpdate
        }));
        this.firedBullets = this.firedBullets.filter(bullet => !bulletsToDelete.includes(bullet.id));
    }

    public draw(ctx: CanvasRenderingContext2D){
        this.currentPlayer.draw(ctx);
        this.renderEnemies(ctx);
        this.renderObstacles(ctx);
        this.renderBullets(ctx);
    };

    private renderObstacles(ctx: CanvasRenderingContext2D){
        this.obstacles.forEach(obstacle =>{
            obstacle.draw(ctx);
        });
    };

    private renderEnemies(ctx: CanvasRenderingContext2D){
        this.enemies.forEach(enemy=>{
            enemy.draw(ctx);
        });
    };

    private renderBullets(ctx: CanvasRenderingContext2D){
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
    };

    private sendMoveMessage = throttle((websocket) => {
        websocket.send(JSON.stringify({
            position: this.currentPlayer.position,
            type: MessageTypes.move,
            name: this.currentPlayer.name,
            clientId: this.clientId
        }));
    }, 1000/60);
    
    public gameOver(){
        location.reload()
    };

    private objectInMap = (object: Bullet | Player) =>{
        return object.position.x < (this.width + object.radius*2)  
        && object.position.y < (this.height + object.radius*2) 
        && object.position.x > -object.radius*2 
        && object.position.y > -object.radius*2;
    }
}