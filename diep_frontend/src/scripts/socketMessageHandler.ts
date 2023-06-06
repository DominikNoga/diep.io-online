import { CreateGameMessage, Message, CollisionMessage, ErrorMessage, MoveMessage } from "./interfaces/message.type";
import { createCanvas, removeForm, addJoinListener } from "./gameStartHandlingFunctions.js";
import { MessageTypes } from "./constants.js";
import Game from "./game.js";
import Player from "./components/player.js";

export default class SocketMessageHandler{
    constructor(public websocket: WebSocket){}

    private handleMessage(message: Message){
        switch(message.type){
            case MessageTypes.createGame:
                this.handleCreateGameMessage(<CreateGameMessage>message);
                break;
            case MessageTypes.collision:
                this.handleCollisionMessage(<CollisionMessage>message);
                break;
            case MessageTypes.move:
                this.handleMovenMessage(<MoveMessage>message);
                break;
            case MessageTypes.error:
                this.handleErrorMessage(<ErrorMessage>message);
                break;
        }
    };

    private handleCreateGameMessage(message: CreateGameMessage){
        if(!message.success){
            alert(message.errorMessage);
            return;
        }
        else{
            removeForm();
            const canvas = createCanvas(message.width, message.height);
            const game = new Game(canvas.width, canvas.height);
            const player = new Player(game, message.name, message.color, message.position);
            game.setCurrentPlayerAndGameMechanics(player);
        }
    };

    private handleCollisionMessage(message: CollisionMessage){

    };

    private handleMovenMessage(message: MoveMessage){

    };

    private handleErrorMessage(message: ErrorMessage){

    };

    public listen(){
        this.websocket.addEventListener('message', (({data}) =>{
            let message = <Message>JSON.parse(data);
            this.handleMessage(message);
        }))
    }
}