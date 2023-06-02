import { Direction, MOVE_VALUE, Keys, arrows, allowedKeys } from "./constants.js"
import Player from "./components/player.js"

export default class GameMechanics{
    private keysPressed: { [key: string]: boolean};
    private player: Player;

    constructor (player: Player) {
        this.keysPressed = {};
        this.player = player;
    }

    public handleKeyPress(key: string){
        this.keysPressed[key] = true;
        for(let pressedKey in this.keysPressed){
            if(!this.keysPressed[pressedKey])
                continue;
            if(arrows.find(arrow => arrow === pressedKey) !== undefined){
                this.handlePlayerMovement(this.player, pressedKey)
            }
            if(pressedKey === Keys.SPACE){
                console.log('Implement shooting');
            }
        }
    }

    public handleKeyUp(key: string){
        delete this.keysPressed[key];
    };

    public handlePlayerMovement(player: Player, key: string){
        let leftValue = 0, topValue = 0;
        if(key === Direction.UP){
            topValue -= MOVE_VALUE;
        }
        if(key === Direction.DOWN){
            topValue += MOVE_VALUE;
        }
        if(key === Direction.LEFT){
            leftValue -= MOVE_VALUE;
        }
        if(key === Direction.RIGHT){
            leftValue += MOVE_VALUE;
        }
    
        // requestAnimationFrame(() =>{
            player.changePosition(leftValue, topValue);
        // })
    };
}