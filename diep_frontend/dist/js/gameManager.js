export default class GameManager {
    constructor(game, ctx) {
        this.ctx = ctx;
        this.game = game;
    }
    ;
    runGame() {
        this.game.initHandlers();
        this.animate();
    }
    ;
    animate() {
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.update(this.ctx);
        this.game.draw(this.ctx);
        requestAnimationFrame(() => { this.animate(); });
    }
    ;
}
