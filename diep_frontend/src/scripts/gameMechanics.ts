import { Direction, Keys, arrows, allowedKeys } from "./constants.js"
import Player from "./components/player.js"

export default class GameMechanics{
    private keysPressed: { [key: string]: boolean};
    private player: Player;

    constructor (player: Player) {
        this.keysPressed = {};
        this.player = player;
    }

    public handleKeyDown(key: string){
        this.keysPressed[key] = true;
    }

    public handleKeyUp(key: string){
        delete this.keysPressed[key];
    };
    
    /**
     * 
     * TODO: change function handlePlayerMovement to handlePressedKey, in handleKeyPress only add a key to the object.
     */

    public handlePressedKeys(){
        let leftValue = 0, topValue = 0;
        if(this.keysPressed[Direction.UP]){
            topValue -= this.player.speed;
        }
        if(this.keysPressed[Direction.DOWN]){
            topValue += this.player.speed;
        }
        if(this.keysPressed[Direction.LEFT]){
            leftValue -= this.player.speed;
        }
        if(this.keysPressed[Direction.RIGHT]){
            leftValue += this.player.speed;
        }
        if(this.keysPressed[Keys.SPACE]){
            console.log("Implement shooting")
        }
        this.player.changePosition(leftValue, topValue);
    }
}