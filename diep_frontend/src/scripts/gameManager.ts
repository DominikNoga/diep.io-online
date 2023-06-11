import Obstacle from "./components/obstacle.js";
import Player from "./components/player.js";
import Game from "./game.js";
import { MoveMessage } from "./interfaces/message.interfaces";

export default class GameManager{
    public ctx: CanvasRenderingContext2D;
    public game: Game;

    constructor(game: Game, ctx: CanvasRenderingContext2D){
        this.ctx = ctx;
        this.game = game;
    };

    public runGame(websocket: WebSocket){
        this.game.initHandlers(websocket);
        this.animate(websocket);
    };

    public animate(websocket: WebSocket){
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.draw(this.ctx);
        if(this.game.firedBullets.length)
            this.game.updateBullets(websocket);
        requestAnimationFrame(() => {this.animate(websocket);});
    };

    public update(enemies:Player [],obstacles:Obstacle[]){
        // this.game.enemies=enemies
        this.game.obstacles=obstacles
    }
}