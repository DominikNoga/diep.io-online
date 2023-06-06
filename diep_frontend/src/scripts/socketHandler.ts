

export default class SocketHadnler{
    public url = 'ws://localhost:8001/';
    public websocket: WebSocket;
    public messageHandler: any;

    constructor(messageHandler: any){
        this.websocket = new WebSocket(this.url);
        this.messageHandler = messageHandler;
    };

    public revieveMessages(){
        this.websocket.addEventListener("message", ({ data }) => {

        });
    };

    public sendMessage(message: any){
        this.websocket.send(JSON.stringify(message));
    }

}