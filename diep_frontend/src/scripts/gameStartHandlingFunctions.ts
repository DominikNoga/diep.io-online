export const addJoinListener = (websocket: WebSocket) => {
    const joinForm: HTMLFormElement = document.querySelector('#join-form');
    const nameInp: HTMLInputElement = joinForm.querySelector('#playerNameInput')
    
    joinForm.addEventListener('submit', (e) =>{
        console.log("send form")
        e.preventDefault();

        if(nameInp.value === ''){
            alert('Name cannot be empty!')
        }
        else {
            sendJoinRequest(websocket, nameInp.value)
        }
    })
}

export const sendJoinRequest = (websocket: WebSocket, name: string) =>{
    websocket.send(JSON.stringify({
        name: name,
        type: 'join',
    }));
};

export const createCanvas = (width: number, height: number): HTMLCanvasElement =>{
    const canvas = document.createElement('canvas');
    canvas.className = 'map';
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

export const removeForm = (): void =>{
    const form = document.getElementById('join-form-wrapper');
    document.body.removeChild(form);
};