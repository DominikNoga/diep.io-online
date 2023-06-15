import Game from "./game.js";

export default class GameManager{
    public ctx: CanvasRenderingContext2D;
    public game: Game;
    public renderLoop: number;

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
        this.game.updateCurrentPlayer(websocket);
        if(this.game.firedBullets.length)
            this.game.updateBullets(websocket);
        this.renderLoop = requestAnimationFrame(() => {this.animate(websocket);});
    };
}