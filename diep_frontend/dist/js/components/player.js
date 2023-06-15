import { MessageTypes, Direction } from "../constants.js";
import Bullet from "./bullet.js";
import { drawBarrel, drawLifeBar, drawNameBar, drawPlayerObject } from "../helper_services/playerDrawingHelperFunctions.js";
import { deepCopy } from "../helper_services/deepCopy.js";
// import { v4 as uuidv4 } from 'uuid';
export default class Player {
    constructor(game, name, color, startingPosition, lifeLeft = 100) {
        this.barrelParams = {
            length: 3,
            width: 30,
            color: 'darkgray',
            angle: Math.PI / 2,
            position: {
                x: 0,
                y: 0
            }
        };
        this.canShoot = true;
        this.game = game;
        this._name = name;
        this.color = color;
        this.position = startingPosition;
        this._score = 0;
        this._lifeLeft = lifeLeft;
        this._radius = 25;
        this._speed = 5;
        this.shootCooldown = 700; // value in miliseconds
        this.offset = {
            x: 0,
            y: 0,
        };
    }
    ;
    draw(ctx) {
        this.calculateOffset(this.offset.x, this.offset.y);
        this.drawNameBar(ctx);
        this.drawLifeBar(ctx);
        this.drawBarrel(ctx);
        this.drawPlayerObject(ctx);
    }
    drawPlayerObject(ctx) {
        drawPlayerObject(ctx, this);
    }
    ;
    drawBarrel(ctx) {
        drawBarrel(ctx, this);
    }
    ;
    drawNameBar(ctx) {
        drawNameBar(ctx, this);
    }
    drawLifeBar(ctx) {
        drawLifeBar(ctx, this);
    }
    calculateOffset(offsetX, offsetY) {
        this.barrelParams.angle = Math.atan2(offsetY, offsetX);
        this.barrelParams.position.x = this.radius * this.barrelParams.length * Math.cos(this.barrelParams.angle) + this.position.x;
        this.barrelParams.position.y = this.radius * this.barrelParams.length * Math.sin(this.barrelParams.angle) + this.position.y;
    }
    update(keysPressed, websocket, clientId) {
        if (keysPressed[Direction.UP]) {
            this.position.y -= this.speed;
        }
        if (keysPressed[Direction.DOWN]) {
            this.position.y += this.speed;
        }
        if (keysPressed[Direction.LEFT]) {
            this.position.x -= this.speed;
        }
        if (keysPressed[Direction.RIGHT]) {
            this.position.x += this.speed;
        }
        websocket.send(JSON.stringify({
            position: this.position,
            type: MessageTypes.move,
            name: this.name,
            clientId: clientId
        }));
    }
    shoot(websocket) {
        const barrelCopy = deepCopy(this.barrelParams);
        const bullet = new Bullet(barrelCopy.position, barrelCopy.angle, this.color, (Math.random() * 10e9).toString());
        this.game.firedBullets.push(bullet);
        websocket.send(JSON.stringify({
            playerName: this.name,
            bulletPosition: bullet.position,
            type: MessageTypes.shoot,
            bulletColor: bullet.color,
            bulletId: bullet.id,
            clientId: this.game.clientId,
            bulletAngle: bullet.angle
        }));
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, this.shootCooldown);
    }
    setBarrelParams(barrelAngle, barrelPosition) {
        this.barrelParams.angle = barrelAngle;
        this.barrelParams.position = barrelPosition;
    }
    get radius() {
        return this._radius;
    }
    ;
    set radius(size) {
        this._radius = size;
    }
    ;
    get lifeLeft() {
        return this._lifeLeft;
    }
    ;
    set lifeLeft(lifeLeft) {
        this._lifeLeft = lifeLeft;
    }
    ;
    get name() {
        return this._name;
    }
    ;
    set name(value) {
        this._name = value;
    }
    ;
    get score() {
        return this._score;
    }
    ;
    set score(value) {
        this._score = value;
    }
    ;
    get angle() {
        return this._angle;
    }
    ;
    set angle(value) {
        this._angle = value;
    }
    ;
    get speed() {
        return this._speed;
    }
    ;
    set speed(value) {
        this._speed = value;
    }
    ;
}
