import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { allowedKeys } from "./constants.js";
export default class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.currentPlayer = new Player(this, 'Domin', { bg: 'red', border: 'darkred' }, { x: 100, y: 100 });
        this.gameMechanics = new GameMechanics(this.currentPlayer);
        this.offset = {
            x: 0,
            y: 0
        };
    }
    ;
    initHandlers() {
        document.addEventListener("keydown", (e) => {
            if (allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined) {
                this.gameMechanics.handleKeyDown(e.key);
            }
        });
        document.addEventListener("keyup", (e) => {
            this.gameMechanics.handleKeyUp(e.key);
        });
        document.addEventListener('mousemove', (e) => {
            this.offset = this.gameMechanics.getMousePlayerOffset({ x: e.x, y: e.y }, this.currentPlayer.position);
        });
    }
    update(ctx) {
        this.currentPlayer.update(this.gameMechanics.keysPressed);
    }
    ;
    draw(ctx) {
        this.currentPlayer.draw(ctx, this.offset.x, this.offset.y);
    }
}
