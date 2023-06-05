export default class GameMap {
    constructor(ctx, game) {
        this.ctx = ctx;
        this.game = game;
    }
    draw() {
    }
    update() {
    }
    animate() {
        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.update();
        this.game.draw(this.ctx);
        requestAnimationFrame(() => { this.animate(); });
    }
}
