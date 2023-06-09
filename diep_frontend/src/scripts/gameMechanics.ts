import { Point } from "./constants.js"
import Player from "./components/player.js"

export default class GameMechanics{
    public keysPressed: {[key: string]: boolean};

    constructor () {
        this.keysPressed = {};
    }

    public handleKeyDown(key: string){
        this.keysPressed[key] = true;
    }

    public handleKeyUp(key: string){
        this.keysPressed[key]=false;
    };
    
    
    public getMousePlayerOffset(mousePosition: Point, playerPosition: Point): Point{
        const x = mousePosition.x - playerPosition.x
        const y = mousePosition.y - playerPosition.y;
        return {x,y};
    }
}