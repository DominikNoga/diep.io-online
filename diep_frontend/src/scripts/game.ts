import GameInterface from "./interfaces/game.interface";
import Player from "./components/player.js";
import GameMechanics from "./gameMechanics.js";
import { allowedKeys } from "./constants.js";

export default class Game implements GameInterface{
    private gameMechanics: GameMechanics
    private currentPlayer: Player;
    private frames = 1000/60;

    constructor(currentPlayer: Player){
        this.currentPlayer = currentPlayer;
        this.gameMechanics = new GameMechanics(currentPlayer);
    }
    // setInterval(() =>{

    // }, 1000/24);
    public initHandlers(){
        document.addEventListener("keydown", (e) =>{
            if(allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined){
                this.gameMechanics.handleKeyDown(e.key);
            }
        });

        document.addEventListener("keyup", (e) =>{
            this.gameMechanics.handleKeyUp(e.key);
        });
    }

    public run(){
        this.initHandlers();
        setInterval(() =>{
            this.gameMechanics.handlePressedKeys();
        }, this.frames)
    }
}