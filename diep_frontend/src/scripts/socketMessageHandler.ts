import { CreateGameMessage, Message, CollisionMessage, ErrorMessage, MoveMessage, NewPlayerMessage, InitConnectionMessage, BarrelMovedMessage, ShootMessage, BulletCollisionMessage } from "./interfaces/message.interfaces";
import { createGameManager, addJoinListener } from "./helper_services/gameStartHandlingFunctions.js";
import { MessageTypes, playerColors } from "./constants.js";
import Player from "./components/player.js";
import GameManager from "./gameManager.js";
import Bullet from "./components/bullet.js";

export default class SocketMessageHandler{
    private gameManager: GameManager;
    private _clientId: string;
    private gameCreated: boolean = false;
    constructor(private websocket: WebSocket){}

    private handleMessage(message: Message){
        switch(message.type){
            case MessageTypes.initConnection:
                this.handleInitConnectionMessage(<InitConnectionMessage>message);
                break;
            case MessageTypes.createGame:
                this.handleCreateGameMessage(<CreateGameMessage>message);
                break;
            case MessageTypes.collision:
                this.handleCollisionMessage(<CollisionMessage>message);
                break;
            case MessageTypes.move:
                this.handleMoveMessage(<MoveMessage>message);
                break;
            case MessageTypes.error:
                this.handleErrorMessage(<ErrorMessage>message);
                break;
            case MessageTypes.newPlayer:
                this.handleNewPlayerMessage(<NewPlayerMessage>message);
                break;
            case MessageTypes.barrelMoved:
                this.handleBarrelMovedMessage(<BarrelMovedMessage>message);
                break;
            case MessageTypes.shoot:
                this.handleShootMessage(<ShootMessage>message);
                break;
            case MessageTypes.bulletCollision:
                this.handleBulletCollisionMessage(<BulletCollisionMessage>message);
                break;
            default: 
                alert("Unknown message type: " + message.type)
        }
    };

    private handleInitConnectionMessage(message: InitConnectionMessage){
        if(typeof message !== undefined && typeof message.clientId !== undefined){
            this._clientId = message.clientId;
            addJoinListener(this.websocket, this.clientId);
            console.log(`Connected and got new id ${this._clientId}`);
        }
    };

    private handleCreateGameMessage(message: CreateGameMessage){
        if(!message.success){
            alert(message.errorMessage);
            return;
        }
        else{
            if (typeof message.color === 'undefined' || typeof message.width === 'undefined' || typeof message.height === 'undefined' || typeof message.position === 'undefined' || typeof message.name === 'undefined') {
                alert("Missing data from server");
                console.log(`Received message: ${message}`);
                return;
            }
            this.gameManager = createGameManager(message, this.clientId);
            this.gameCreated = true;
            this.gameManager.runGame(this.websocket);
        }
    };

    private handleCollisionMessage(message: CollisionMessage){
        if(!this.gameCreated) return;
    };

    private handleMoveMessage(message: MoveMessage){
        if(!this.gameCreated) return;
        this.gameManager.game.update(message.position, message.name)
        //this.gameManager.update(message.enemies,message.obstacles)
    };

    private handleNewPlayerMessage(message: NewPlayerMessage): void {
        if(!this.gameCreated) return;
        this.gameManager.game.enemies.push(
            new Player(
                this.gameManager.game,
                message.name, 
                playerColors[message.color], 
                message.position
        ));
    };

    private handleErrorMessage(message: ErrorMessage): void {
        if(!this.gameCreated) return;
        alert(message.message)
    };

    private handleBarrelMovedMessage(message: BarrelMovedMessage): void {
        if(!this.gameCreated) return;
        if(message.name === this.gameManager.game.currentPlayer.name){
            return;
        }
        const index = this.gameManager.game.findEnemyIndexByName(message.name);
        this.gameManager.game.enemies[index].setBarrelParams(message.barrelAngle, message.barrelPosition);
    };

    private handleShootMessage(message: ShootMessage): void {
        if(!this.gameCreated) return;
        this.gameManager.game.firedBullets.push(new Bullet(
            message.bulletPosition,
            message.bulletAngle,
            message.bulletColor,
            message.bulletId
        ))
    };

    private handleBulletCollisionMessage(message: BulletCollisionMessage): void {
        if(!this.gameCreated) return;
        
        const result = message.damagedPlayers.find(player => player.name === this.gameManager.game.currentPlayer.name)
        if(result !== undefined) {
            this.gameManager.game.currentPlayer.lifeLeft = result.lifeLeft;
            console.log(`Current player: ${this.gameManager.game.currentPlayer.name} life left: ${result.lifeLeft}`)
        }
        this.gameManager.game.enemies.forEach(enemy => {
            for(let player of message.damagedPlayers) {
                if(player.name === enemy.name){
                    enemy.lifeLeft = player.lifeLeft;
                    console.log(`Enemy: ${enemy.name} life left: ${enemy.lifeLeft}`)
                    break;
                }
            }
        });
        this.gameManager.game.firedBullets = this.gameManager.game.firedBullets.filter(bullet => !message.bulletIds.includes(bullet.id));
    }

    public listen(){
        this.websocket.addEventListener('message', (({data}) =>{
            let message = <Message>JSON.parse(data);
            this.handleMessage(message);
        }))
    };

    public get clientId(): string{
        return this._clientId;
    };
}