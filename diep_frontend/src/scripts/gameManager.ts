import Obstacle from "./components/obstacle.js";
import Player from "./components/player.js";
import Game from "./game.js";
import { MoveMessage } from "./interfaces/message.type.js";

export default class GameManager{
    public ctx: CanvasRenderingContext2D;
    public game: Game;

    constructor(game: Game, ctx: CanvasRenderingContext2D){
        this.ctx = ctx;
        this.game = game;
    };

    public runGame(websocket: WebSocket){
        this.game.initHandlers(websocket);
        this.animate();
    };

    public animate(){
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        //this.game.update();
        this.game.draw(this.ctx);
        requestAnimationFrame(() => {this.animate();});
    };

    public update(enemies:Player [],obstacles:Obstacle[]){
        this.game.enemies=enemies
        this.game.obstacles=obstacles
    }
}