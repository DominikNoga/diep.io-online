import { CreateGameMessage, Message, CollisionMessage, ErrorMessage, MoveMessage, NewPlayerMessage, InitConnectionMessage } from "./interfaces/message.interfaces";
import { createGameManager, addJoinListener } from "./helper_services/gameStartHandlingFunctions.js";
import { MessageTypes, playerColors } from "./constants.js";
import Game from "./game.js";
import Player from "./components/player.js";
import GameManager from "./gameManager.js";

export default class SocketMessageHandler{
    private gameManager: GameManager;
    private _clientId: string;
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
        }
    };

    private handleInitConnectionMessage(message: InitConnectionMessage){
        if(typeof message !== undefined && typeof message.clientId !== undefined){
            this._clientId = message.clientId;
            addJoinListener(this.websocket, this.clientId);
            console.log(`Connected and got new id ${this._clientId}`);
        }
    }

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
            this.gameManager = createGameManager(message);
            this.gameManager.runGame(this.websocket);
        }
    };

    private handleCollisionMessage(message: CollisionMessage){

    };

    private handleMoveMessage(message: MoveMessage){
        this.gameManager.game.update(message.position, message.name)
        //this.gameManager.update(message.enemies,message.obstacles)

    };

    private handleNewPlayerMessage(message: NewPlayerMessage): void {
        this.gameManager.game.players.push(
            new Player(
                this.gameManager.game,
                message.name, 
                playerColors[message.color], 
                message.position
        ));
    }

    private handleErrorMessage(message: ErrorMessage){
        alert(message.message)
    };

    public listen(){
        this.websocket.addEventListener('message', (({data}) =>{
            let message = <Message>JSON.parse(data);
            this.handleMessage(message);
        }))
    }

    public get clientId(): string{
        return this._clientId;
    }
}