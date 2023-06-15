import GameMechanics from "./gameMechanics.js";
import { allowedKeys, MessageTypes } from "./constants.js";
import { throttle } from "./helper_services/delayRequest.js";
export default class Game {
    constructor(width, height, clientId) {
        this.obstacles = [];
        this.enemies = [];
        this.firedBullets = [];
        this.sendMoveMessage = throttle((websocket) => {
            websocket.send(JSON.stringify({
                position: this.currentPlayer.position,
                type: MessageTypes.move,
                name: this.currentPlayer.name,
                clientId: this.clientId
            }));
        }, 1000 / 60);
        this.objectInMap = (object) => {
            return object.position.x < (this.width + object.radius * 2)
                && object.position.y < (this.height + object.radius * 2)
                && object.position.x > -object.radius * 2
                && object.position.y > -object.radius * 2;
        };
        this.width = width;
        this.height = height;
        this.gameMechanics = new GameMechanics();
        this.clientId = clientId;
    }
    ;
    initHandlers(websocket) {
        document.addEventListener("keydown", (e) => {
            if (allowedKeys.find(allowedKey => allowedKey === e.key) !== undefined) {
                this.gameMechanics.handleKeyDown(e.key);
                // this.sendMoveMessage(websocket);
            }
        });
        document.addEventListener("keyup", (e) => {
            this.gameMechanics.handleKeyUp(e.key);
        });
        document.addEventListener('mousemove', (e) => {
            this.currentPlayer.offset = this.gameMechanics.getMousePlayerOffset({ x: e.x, y: e.y }, this.currentPlayer.position);
        });
        document.addEventListener('mousedown', (e) => {
            if (e.button == 0) {
                if (this.currentPlayer.canShoot)
                    this.currentPlayer.shoot(websocket);
                this.shootingInerval = setInterval(() => {
                    this.currentPlayer.shoot(websocket);
                }, this.currentPlayer.shootCooldown);
            }
        });
        document.addEventListener('mouseup', () => {
            clearInterval(this.shootingInerval);
        });
    }
    setCurrentPlayer(player) {
        this.currentPlayer = player;
    }
    updateCurrentPlayer(websocket) {
        this.currentPlayer.update(this.gameMechanics.keysPressed, websocket, this.clientId);
    }
    ;
    updateEnemies(position, name) {
        try {
            const index = this.findEnemyIndexByName(name);
            this.enemies[index].position = position;
        }
        catch (error) {
            alert(`Frontend Error: ${error}`);
        }
    }
    updateBullets(websocket) {
        const bulletsToDelete = [];
        this.firedBullets.forEach(bullet => {
            this.objectInMap(bullet) ? bullet.update() : bulletsToDelete.push(bullet.id);
        });
        const updatedBullets = this.firedBullets.map(bullet => ({
            id: bullet.id,
            position: bullet.position
        }));
        websocket.send(JSON.stringify({
            updatedBullets: updatedBullets,
            type: MessageTypes.bulletsUpdate
        }));
        this.firedBullets = this.firedBullets.filter(bullet => !bulletsToDelete.includes(bullet.id));
    }
    draw(ctx) {
        this.currentPlayer.draw(ctx);
        this.renderEnemies(ctx);
        this.renderObstacles(ctx);
        this.renderBullets(ctx);
    }
    ;
    renderObstacles(ctx) {
        this.obstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
    }
    ;
    renderEnemies(ctx) {
        this.enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
    }
    ;
    renderBullets(ctx) {
        this.firedBullets.forEach(bullet => {
            bullet.draw(ctx);
        });
    }
    ;
    findEnemyIndexByName(name) {
        const enemy = this.enemies.find(p => p.name === name);
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            return index;
        }
        else
            throw new Error(`Player ${name} not found`);
    }
    ;
    gameOver() {
        location.reload();
    }
    ;
}
