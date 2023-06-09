import { addJoinListener } from "./helper_services/gameStartHandlingFunctions.js";
import SocketMessageHandler from "./socketMessageHandler.js";

addEventListener('load', () =>{
    const websocket = new WebSocket("ws://localhost:8001/");
    addJoinListener(websocket);
    const socketMessageHandler = new SocketMessageHandler(websocket);
    socketMessageHandler.listen();
})

