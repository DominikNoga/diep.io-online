import { createGameManager, addJoinListener } from "./helper_services/gameStartHandlingFunctions.js";
import { MessageTypes, playerColors } from "./constants.js";
import Player from "./components/player.js";
import Bullet from "./components/bullet.js";
import Obstacle from "./components/obstacle.js";
import { setEndGameScreen } from "./helper_services/endGameHandlingFunctions.js";
export default class SocketMessageHandler {
    constructor(websocket) {
        this.websocket = websocket;
        this.gameCreated = false;
    }
    handleMessage(message) {
        switch (message.type) {
            case MessageTypes.initConnection:
                this.handleInitConnectionMessage(message);
                break;
            case MessageTypes.createGame:
                this.handleCreateGameMessage(message);
                break;
            case MessageTypes.move:
                this.handleMoveMessage(message);
                break;
            case MessageTypes.error:
                this.handleErrorMessage(message);
                break;
            case MessageTypes.newPlayer:
                this.handleNewPlayerMessage(message);
                break;
            case MessageTypes.shoot:
                this.handleShootMessage(message);
                break;
            case MessageTypes.bulletCollision:
                this.handleBulletCollisionMessage(message);
                break;
            default:
                alert("Unknown message type: " + message.type);
        }
    }
    ;
    handleInitConnectionMessage(message) {
        if (typeof message !== undefined && typeof message.clientId !== undefined) {
            this._clientId = message.clientId;
            addJoinListener(this.websocket, this.clientId);
            console.log(`Connected and got new id ${this._clientId}`);
        }
    }
    ;
    handleCreateGameMessage(message) {
        if (!message.success) {
            alert(message.errorMessage);
            return;
        }
        else {
            if (typeof message.color === 'undefined' || typeof message.width === 'undefined' || typeof message.height === 'undefined' || typeof message.position === 'undefined' || typeof message.name === 'undefined') {
                alert("Missing data from server");
                console.log(`Received message: ${message}`);
                return;
            }
            this.gameManager = createGameManager(message, this.clientId);
            this.gameCreated = true;
            this.gameManager.runGame(this.websocket);
        }
    }
    ;
    handleMoveMessage(message) {
        if (!this.gameCreated)
            return;
        this.gameManager.game.updateEnemies(message.position, message.name);
    }
    ;
    handleNewPlayerMessage(message) {
        if (!this.gameCreated)
            return;
        this.gameManager.game.enemies.push(new Player(this.gameManager.game, message.name, playerColors[message.color], message.position));
    }
    ;
    handleErrorMessage(message) {
        if (!this.gameCreated)
            return;
        alert(message.message);
    }
    ;
    handleShootMessage(message) {
        if (!this.gameCreated)
            return;
        this.gameManager.game.firedBullets.push(new Bullet(message.bulletPosition, message.bulletAngle, message.bulletColor, message.bulletId));
    }
    ;
    handleBulletCollisionMessage(message) {
        if (!this.gameCreated)
            return;
        const result = message.damagedPlayers.find(player => player.name === this.gameManager.game.currentPlayer.name);
        if (result !== undefined) {
            this.gameManager.game.currentPlayer.lifeLeft = result.lifeLeft;
            if (result.lifeLeft === 0) {
                setEndGameScreen(this.gameManager.game.currentPlayer.score, this.gameManager.game.currentPlayer.name);
                this.gameCreated = false;
                cancelAnimationFrame(this.gameManager.renderLoop);
                return;
            }
        }
        this.gameManager.game.enemies.forEach(enemy => {
            for (let player of message.damagedPlayers) {
                if (player.name === enemy.name) {
                    enemy.lifeLeft = player.lifeLeft;
                    if (enemy.lifeLeft == 0)
                        this.gameManager.game.enemies = this.gameManager.game.enemies.filter((player) => player !== enemy);
                    break;
                }
            }
        });
        this.gameManager.game.obstacles.forEach(obstacle => {
            for (let dmg_obstacle of message.damagedObstacles) {
                if (obstacle.id === dmg_obstacle.id) {
                    obstacle.lifeLeft = dmg_obstacle.lifeLeft;
                    console.log(`Obstacle:  life left: ${obstacle.lifeLeft}`);
                    if (obstacle.lifeLeft == 0)
                        this.gameManager.game.obstacles = this.gameManager.game.obstacles.filter((obs) => obs !== obstacle);
                    break;
                }
            }
        });
        message.newObstacles.forEach(obstacle => {
            this.gameManager.game.obstacles.push(new Obstacle(obstacle.type, obstacle.position, obstacle.id));
        });
        const currentScore = message.scoreMsg.find(player => player.name === this.gameManager.game.currentPlayer.name);
        this.gameManager.game.currentPlayer.score = currentScore.score;
        console.log(currentScore);
        this.gameManager.game.firedBullets = this.gameManager.game.firedBullets.filter(bullet => !message.bulletIds.includes(bullet.id));
    }
    listen() {
        this.websocket.addEventListener('message', (({ data }) => {
            let message = JSON.parse(data);
            this.handleMessage(message);
        }));
    }
    ;
    get clientId() {
        return this._clientId;
    }
    ;
}
