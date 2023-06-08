import { GameObjectColor, Point } from "./constants.js";
import Game from "./game.js";
import GameManager from "./gameManager.js";
import { addJoinListener } from "./gameStartHandlingFunctions.js";
import { Message } from "./interfaces/message.interfaces";
import SocketMessageHandler from "./socketMessageHandler.js";

addEventListener('load', () =>{
    const websocket = new WebSocket("ws://localhost:8001/");
    addJoinListener(websocket);
    const socketMessageHandler = new SocketMessageHandler(websocket);
    socketMessageHandler.listen();
    // const map = <HTMLCanvasElement>document.querySelector('#map');
    // const ctx = map.getContext('2d');
    // map.width = 1600;
    // map.height = 900;
    // const game = new Game(map.width, map.height);
    //const gm = new GameManager(game, ctx);
    //gm.runGame();
})

