export default class GameManager {
    constructor(game, ctx) {
        this.ctx = ctx;
        this.game = game;
    }
    ;
    runGame(websocket) {
        this.game.initHandlers(websocket);
        this.animate(websocket);
    }
    ;
    animate(websocket) {
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.draw(this.ctx);
        this.game.updateCurrentPlayer(websocket);
        if (this.game.firedBullets.length)
            this.game.updateBullets(websocket);
        this.renderLoop = requestAnimationFrame(() => { this.animate(websocket); });
    }
    ;
}
