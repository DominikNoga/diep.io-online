import SocketMessageHandler from "./socketMessageHandler.js";

addEventListener('load', () =>{
    const websocket = new WebSocket("ws://localhost:8001/");
    const socketMessageHandler = new SocketMessageHandler(websocket);
    socketMessageHandler.listen();
})

