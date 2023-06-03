import { Direction, Keys } from "./constants.js";
export default class GameMechanics {
    constructor(player) {
        this.keysPressed = {};
        this.player = player;
    }
    handleKeyPress(key) {
        this.keysPressed[key] = true;
    }
    handleKeyUp(key) {
        delete this.keysPressed[key];
    }
    ;
    /**
     *
     * TODO: change function handlePlayerMovement to handlePressedKey, in handleKeyPress only add a key to the object.
     */
    handlePressedKeys() {
        let leftValue = 0, topValue = 0;
        if (this.keysPressed[Direction.UP]) {
            topValue -= this.player.speed;
        }
        if (this.keysPressed[Direction.DOWN]) {
            topValue += this.player.speed;
        }
        if (this.keysPressed[Direction.LEFT]) {
            leftValue -= this.player.speed;
        }
        if (this.keysPressed[Direction.RIGHT]) {
            leftValue += this.player.speed;
        }
        if (this.keysPressed[Keys.SPACE]) {
            console.log("Implement shooting");
        }
        this.player.changePosition(leftValue, topValue);
    }
}
