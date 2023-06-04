import Player from "../components/player.js";
import { startingRadius } from "../constants.js";
import { createGameObject } from "../helperFunctions/htmlHelperFunctions.js";
export default class GameUI {
    constructor(gameMap) {
        this.gameMap = gameMap;
    }
    addObjectToMap(classes, position) {
        const object = createGameObject(classes, position);
        this.gameMap.map.appendChild(object);
    }
    createPlayerObject(position, name) {
        const playerObject = createGameObject(['tank'], position);
        this.gameMap.map.appendChild(playerObject);
        const barrel = createGameObject(['barrel'], { x: startingRadius * 2, y: startingRadius - 12 });
        playerObject.appendChild(barrel);
        return new Player(playerObject, name);
    }
}
