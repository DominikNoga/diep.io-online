import { CreateGameMessage } from "../interfaces/message.interfaces";
import Game from "../game.js";
import Player from "../components/player.js";
import GameManager from "../gameManager.js";
import { playerColors } from "../constants.js";
import Obstacle from "../components/obstacle.js";


export const addJoinListener = (websocket: WebSocket, clientId: string) => {
    const joinForm: HTMLFormElement = document.querySelector('#join-form');
    const nameInp: HTMLInputElement = joinForm.querySelector('#playerNameInput')
    
    joinForm.addEventListener('submit', (e) =>{
        console.log("send form")
        e.preventDefault();

        if(nameInp.value === ''){
            alert('Name cannot be empty!')
        }
        else {
            sendJoinRequest(websocket, nameInp.value, clientId)
        }
    })
}

export const sendJoinRequest = (websocket: WebSocket, name: string, clientId: string) =>{
    websocket.send(JSON.stringify({
        name: name,
        type: 'join',
        clientId: clientId
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

export const createGameManager = (message: CreateGameMessage, clientId: string): GameManager =>{
    removeForm();
    const canvas = createCanvas(message.width, message.height);
    document.body.appendChild(canvas);
    const game = new Game(canvas.width, canvas.height, clientId);
    message.players.filter(player => player.name !== message.name)
        .forEach(enemy =>{
            game.enemies.push(new Player(
                game,
                enemy.name,
                playerColors[enemy.color],
                enemy.position,
                enemy.lifeLeft
            ));
    });
    message.obstacles.forEach(obstacle =>{
            game.obstacles.push(new Obstacle(
                obstacle.type,
                obstacle.position,
                obstacle.id
            ));
    });
    const player = new Player(game, message.name, playerColors[message.color], message.position);
    game.setCurrentPlayer(player);
    const ctx = canvas.getContext('2d');
    return new GameManager(game, ctx);
};
