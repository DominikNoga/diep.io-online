import GameMap from "../components/map.js";
import Player from "../components/player.js";
import { Point, startingRadius } from "../constants.js";
import { createGameObject } from "../helperFunctions/htmlHelperFunctions.js";


export default class GameUI{
    public gameMap: GameMap;
    public currentPlayer: Player;

    constructor(gameMap: GameMap){
        this.gameMap = gameMap;
    }

    public addObjectToMap(classes: string[], position: Point): void{
        const object = createGameObject(classes, position);
        this.gameMap.map.appendChild(object);
    }

    public createPlayerObject(position: Point, name: string): Player{
        const playerObject = createGameObject(['tank'], position);
        this.gameMap.map.appendChild(playerObject);
        const barrel = createGameObject(['barrel'], {x: startingRadius*2, y: startingRadius - 12})
        playerObject.appendChild(barrel);
        return new Player(playerObject, name);

    }
} 