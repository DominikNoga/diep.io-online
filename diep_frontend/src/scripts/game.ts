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
    private gameMap: GameMap;
    private gameUI: GameUI;

    constructor(startingPosition: Point, playerName: string){
        this.gameMap = new GameMap();
        this.gameUI = new GameUI(this.gameMap);
        this.currentPlayer = this.gameUI.createPlayerObject(startingPosition, playerName);
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

        document.addEventListener('mousemove', (e) =>{
            this.gameMechanics.handleBarelMovement({x: e.x, y: e.y});
        });
    }

    public initGraphics(){
        // this.gameUI.addObjectToMap(['tank'], {x: 0, y: 0});
    };

    public run(){
        this.initHandlers();
        this.initGraphics();
        setInterval(() =>{
            this.gameMechanics.handlePressedKeys();
        }, this.frames)
    }
}

/* 
    const barreel = document.querySelector('.barrel')
    barreel.style.left = '37.5px';
    barreel.style.rotate = '52deg'
    barreel.style.top = '50.5px';
*/