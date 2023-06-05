import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { Point, allowedKeys } from "./constants.js";
import GameMap from "./components/map.js";
import GameUI from "./gameHelperClasses/gameUI.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    private currentPlayer: Player;
    private frames = 1000/60;
    public gameMap: GameMap;
    private gameUI: GameUI;
    public width: number;
    public height: number;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        this.gameUI = new GameUI(this.gameMap);
        this.currentPlayer = new Player(this, 'Domin', {bg: 'red', border: 'darkred'}, {x: 100, y: 100});
        this.gameUI.currentPlayer = this.currentPlayer;
        this.gameMechanics = new GameMechanics(this.currentPlayer);
    };

    public initHandlers(){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
            }
            // if(e.key === 'k'){
            //     this.gameMechanics.handleBarelMovement({x: 158, y: 100});
            // }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });

        // document.addEventListener('mousemove', (e) =>{
        //     this.gameMechanics.handleBarelMovement({x: e.x, y: e.y});
        // });
    }

    public initGraphics(){
        // this.gameUI.addObjectToMap(['tank'], {x: 0, y: 0});
    };

    public run(){
        this.initHandlers();
        this.initGraphics();
        this.gameMap.animate();
    }

    public update(){
        this.currentPlayer.update(this.gameMechanics.keysPressed);
    }
    public draw(ctx: CanvasRenderingContext2D){
        this.currentPlayer.draw(ctx);
    }
}