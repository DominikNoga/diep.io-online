export default class SocketHadnler {
    constructor(messageHandler) {
        this.url = 'ws://localhost:8001/';
        this.websocket = new WebSocket(this.url);
        this.messageHandler = messageHandler;
    }
    ;
    revieveMessages() {
        this.websocket.addEventListener("message", ({ data }) => {
        });
    }
    ;
    sendMessage(message) {
        this.websocket.send(JSON.stringify(message));
    }
}
