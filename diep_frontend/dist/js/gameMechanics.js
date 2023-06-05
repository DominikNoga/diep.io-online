import { Direction, Keys } from "./constants.js";
import { setHtmlElementPosition } from "./helperFunctions/htmlHelperFunctions.js";
export default class GameMechanics {
    constructor(currentPlayer) {
        this.keysPressed = {};
        this.currentPlayer = currentPlayer;
    }
    handleKeyDown(key) {
        this.keysPressed[key] = true;
    }
    handleKeyUp(key) {
        delete this.keysPressed[key];
    }
    ;
    handlePressedKeys() {
        let leftValue = 0, topValue = 0;
        if (this.keysPressed[Direction.UP]) {
            topValue -= this.currentPlayer.speed;
        }
        if (this.keysPressed[Direction.DOWN]) {
            topValue += this.currentPlayer.speed;
        }
        if (this.keysPressed[Direction.LEFT]) {
            leftValue -= this.currentPlayer.speed;
        }
        if (this.keysPressed[Direction.RIGHT]) {
            leftValue += this.currentPlayer.speed;
        }
        if (this.keysPressed[Keys.SPACE]) {
            console.log("Implement shooting");
        }
        this.updateObjectPosition(this.currentPlayer.tank, { x: leftValue, y: topValue });
    }
    ;
    updateObjectPosition(object, move) {
        const position = {
            x: Number(object.style.left.slice(0, -2)) + move.x,
            y: Number(object.style.top.slice(0, -2)) + move.y
        };
        setHtmlElementPosition(object, position);
    }
    ;
    createBullet(position) {
        document.createElement('div');
    }
    ;
}
