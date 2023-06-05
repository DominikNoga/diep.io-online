import Game from "./game.js";

export default class GameManager{
    public ctx: CanvasRenderingContext2D;
    public game: Game;

    constructor(game: Game, ctx: CanvasRenderingContext2D){
        this.ctx = ctx;
        this.game = game;
    };

    public runGame(){
        this.game.initHandlers();
        this.animate();
    };

    public animate(){
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.update();
        this.game.draw(this.ctx);
        requestAnimationFrame(() => {this.animate();});
    };
}