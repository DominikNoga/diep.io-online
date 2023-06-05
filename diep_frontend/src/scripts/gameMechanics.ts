import { Direction, Keys, Point } from "./constants.js"
import Player from "./components/player.js"
import GameObject from "./abstract/gameObject.js";
import { setHtmlElementPosition } from "./helperFunctions/htmlHelperFunctions.js";

export default class GameMechanics{
    public keysPressed: { [key: string]: boolean};
    private currentPlayer: Player;

    constructor (currentPlayer: Player) {
        this.keysPressed = {};
        this.currentPlayer = currentPlayer;
    }

    public handleKeyDown(key: string){
        this.keysPressed[key] = true;
    }

    public handleKeyUp(key: string){
        delete this.keysPressed[key];
    };
    
    public handlePressedKeys(){
        let leftValue = 0, topValue = 0;
        if(this.keysPressed[Direction.UP]){
            topValue -= this.currentPlayer.speed;
        }
        if(this.keysPressed[Direction.DOWN]){
            topValue += this.currentPlayer.speed;
        }
        if(this.keysPressed[Direction.LEFT]){
            leftValue -= this.currentPlayer.speed;
        }
        if(this.keysPressed[Direction.RIGHT]){
            leftValue += this.currentPlayer.speed;
        }
        if(this.keysPressed[Keys.SPACE]){
            console.log("Implement shooting")
        }
        this.updateObjectPosition(this.currentPlayer.tank, {x: leftValue, y: topValue});
    };

    public updateObjectPosition(object: HTMLElement, move: Point): void {
        const position = {
            x: Number(object.style.left.slice(0, -2)) + move.x,
            y: Number(object.style.top.slice(0, -2)) + move.y
        }
        setHtmlElementPosition(object, position);
    };

    public createBullet(position: Point): void{
        document.createElement('div');
    };

    // public handleBarelMovement(mousePosition: Point): void{
    //     console.log(`Mouse position x: ${mousePosition.x} y: ${mousePosition.y}`);
       
    //     const playerCenterPosition = this.currentPlayer.calculateCenters();
    //     console.log(`Center position x: ${playerCenterPosition.x} y: ${playerCenterPosition.y}`);
    //     const dx = mousePosition.x - playerCenterPosition.x;
    //     const dy = mousePosition.y - playerCenterPosition.y;
    //     const fi = Math.atan(dy/dx);
    //     const fiDeg = fi*180/Math.PI;
    //     let newX = this.currentPlayer.radius*2 - (this.currentPlayer.radius)*Math.cos(fi);
    //     let newY = this.currentPlayer.radius + (this.currentPlayer.radius)*Math.sin(fi);
        
    //     let rotationAngle = 0;
    //     if(dx > 0){
    //         rotationAngle = fiDeg;
    //     }
    //     else{
    //         rotationAngle = fiDeg > 0 ? fiDeg + 90 : -90 + fiDeg;

    //     }
    //     console.log(`Barrel position x: ${newX} y: ${newY}\nRotation angle: ${rotationAngle}`);
    //     setHtmlElementPosition(this.currentPlayer.barrel, {x: newX, y: newY});
    //     this.currentPlayer.barrel.style.rotate = `${rotationAngle}deg`;
    // }
}