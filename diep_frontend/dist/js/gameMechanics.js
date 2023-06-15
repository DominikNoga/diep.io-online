export default class GameMechanics {
    constructor() {
        this.keysPressed = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };
    }
    handleKeyDown(key) {
        this.keysPressed[key] = true;
    }
    handleKeyUp(key) {
        this.keysPressed[key] = false;
    }
    ;
    getMousePlayerOffset(mousePosition, playerPosition) {
        const x = mousePosition.x - playerPosition.x;
        const y = mousePosition.y - playerPosition.y;
        return { x, y };
    }
}
