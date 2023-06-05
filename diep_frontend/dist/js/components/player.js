import { Direction, Keys } from "../constants.js";
export default class Player {
    constructor(game, name, color, startingPosition) {
        this.barrelSize = {
            length: 18,
            width: 24
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
    draw(ctx) {
        // draw the inside
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.border;
        ctx.lineWidth = 3;
        ctx.stroke();
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
    get tank() {
        return this._tank;
    }
    ;
    set tank(tank) {
        this._tank = tank;
        this.barrel = this.tank.querySelector('.barrel');
    }
    ;
    get top() {
        return this._top;
    }
    ;
    set top(top) {
        this._top = top;
    }
    ;
    get left() {
        return this._left;
    }
    ;
    set left(left) {
        this._left = left;
    }
    ;
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
