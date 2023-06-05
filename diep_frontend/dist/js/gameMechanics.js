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
    getMousePlayerOffset(mousePosition, playerPosition) {
        const x = mousePosition.x - playerPosition.x;
        const y = mousePosition.y - playerPosition.y;
        return { x, y };
    }
}
