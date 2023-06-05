import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys } from "./constants.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    private currentPlayer: Player;
    public width: number;
    public height: number;
    public offset: Point;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.currentPlayer = new Player(this, 'Domin', {bg: 'red', border: 'darkred'}, {x: 100, y: 100});
        this.gameMechanics = new GameMechanics(this.currentPlayer);
        this.offset ={
            x: 0,
            y: 0
        }
    };

    public initHandlers(){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        document.addEventListener('mousemove', (e) =>{
            this.offset = this.gameMechanics.getMousePlayerOffset({x: e.x, y: e.y}, this.currentPlayer.position);
        });
    }

    public update(ctx: CanvasRenderingContext2D){
        this.currentPlayer.update(this.gameMechanics.keysPressed);
    };

    public draw(ctx: CanvasRenderingContext2D){
        this.currentPlayer.draw(ctx, this.offset.x, this.offset.y);
    }
}