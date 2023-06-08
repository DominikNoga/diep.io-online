import { CreateGameMessage, Message, CollisionMessage, ErrorMessage, MoveMessage } from "./interfaces/message.type";
import { createCanvas, removeForm, addJoinListener } from "./gameStartHandlingFunctions.js";
import { MessageTypes, playerColors } from "./constants.js";
import Game from "./game.js";
import Player from "./components/player.js";
import GameManager from "./gameManager.js";

export default class SocketMessageHandler{
    private gameManager: GameManager;
    constructor(private websocket: WebSocket){}

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
            if (typeof message.color === 'undefined' || typeof message.width === 'undefined' || typeof message.height === 'undefined' || typeof message.position === 'undefined' || typeof message.name === 'undefined') {
                alert("Missing data from server");
                console.log(`Received message: ${message}`);
                return;
              }
            removeForm();
            const canvas = createCanvas(message.width, message.height);
            document.body.appendChild(canvas);
            const game = new Game(canvas.width, canvas.height);
            const player = new Player(game, message.name, playerColors[message.color], message.position);
            game.setCurrentPlayerAndGameMechanics(player);
            const ctx = canvas.getContext('2d');
            this.gameManager = new GameManager(game, ctx);
            this.gameManager.runGame(this.websocket);
        }
    };

    private handleCollisionMessage(message: CollisionMessage){

    };

    private handleMovenMessage(message: MoveMessage){

        this.gameManager.game.update(message.position)
        //this.gameManager.update(message.enemies,message.obstacles)

    };

    private handleErrorMessage(message: ErrorMessage){
        alert(message.message)
    };

    public listen(){
        this.websocket.addEventListener('message', (({data}) =>{
            let message = <Message>JSON.parse(data);
            this.handleMessage(message);
        }))
    }
}