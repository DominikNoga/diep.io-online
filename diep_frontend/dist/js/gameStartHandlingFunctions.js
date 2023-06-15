export const addJoinListener = (websocket) => {
    const joinForm = document.querySelector('#join-form');
    const nameInp = joinForm.querySelector('#playerNameInput');
    joinForm.addEventListener('submit', (e) => {
        console.log("send form");
        e.preventDefault();
        if (nameInp.value === '') {
            alert('Name cannot be empty!');
        }
        else {
            sendJoinRequest(websocket, nameInp.value);
        }
    });
};
export const sendJoinRequest = (websocket, name) => {
    websocket.send(JSON.stringify({
        name: name,
        type: 'join',
    }));
};
export const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'map';
    canvas.width = width;
    canvas.height = height;
    return canvas;
};
export const removeForm = () => {
    const form = document.getElementById('join-form-wrapper');
    document.body.removeChild(form);
};
