import { Direction, Keys } from "../constants.js";
export default class Player {
    constructor(game, name, color, startingPosition) {
        this.barrelParams = {
            length: 3,
            width: 30,
            color: 'darkgray',
            angle: Math.PI / 2,
        };
        this.game = game;
        this._name = name;
        this.color = color;
        this.position = startingPosition;
        this._speed = 3;
        this._score = 0;
        this._lifeLeft = 100;
        this._radius = 25;
    }
    ;
    shoot() {
    }
    draw(ctx, offsetX, offsetY) {
        const newOffset = this.calculateOffset(offsetX, offsetY);
        this.drawBarrel(newOffset.x, newOffset.y, ctx);
        this.drawPlayerObject(ctx);
    }
    drawPlayerObject(ctx) {
        // draw the inside
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.border;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    ;
    drawBarrel(x, y, ctx) {
        // border
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.barrelParams.width + 6;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        // inside
        ctx.beginPath();
        ctx.lineWidth = this.barrelParams.width;
        ctx.strokeStyle = this.barrelParams.color;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }
    ;
    calculateOffset(offsetX, offsetY) {
        this.barrelParams.angle = Math.atan2(offsetY, offsetX);
        const x = this.radius * this.barrelParams.length * Math.cos(this.barrelParams.angle) + this.position.x;
        const y = this.radius * this.barrelParams.length * Math.sin(this.barrelParams.angle) + this.position.y;
        return { x, y };
    }
    update(keysPressed) {
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
        if (keysPressed[Keys.SPACE]) {
            console.log("Implement shooting");
        }
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
