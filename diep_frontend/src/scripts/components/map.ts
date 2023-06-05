import Game from "../game.js";


export default class GameMap{
    public sizeX: number;
    public sizeY: number;
    public ctx: CanvasRenderingContext2D;
    public game: Game;
    constructor(ctx: CanvasRenderingContext2D, game: Game){
        this.ctx = ctx;
        this.game = game;
    }
    public draw(){

    }
    public update(){
        
    }
    public animate(){
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.update();
        this.game.draw(this.ctx);
        requestAnimationFrame(() => {this.animate();});
    }
}