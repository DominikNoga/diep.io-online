import GameMechanics from "./gameMechanics.js";
import { allowedKeys } from "./constants.js";
export default class Game {
    constructor(currentPlayer) {
        this.currentPlayer = currentPlayer;
        this.gameMechanics = new GameMechanics(currentPlayer);
    }
    // setInterval(() =>{
    // }, 1000/24);
    initHandlers() {
        document.addEventListener("keydown", (e) => {
            if (allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined) {
                this.gameMechanics.handleKeyPress(e.key);
            }
        });
        document.addEventListener("keyup", (e) => {
            this.gameMechanics.handleKeyUp(e.key);
        });
    }
    run() {
        this.initHandlers();
    }
}
