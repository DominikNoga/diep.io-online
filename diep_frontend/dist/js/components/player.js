export default class Player {
    constructor(tank, name) {
        this.barrelSize = {
            length: 18,
            width: 24
        };
        this._tank = tank;
        this.barrel = this.tank.querySelector('.barrel');
        this._top = Number(this.tank.style.top.slice(0, -2));
        this._left = Number(this.tank.style.left.slice(0, -2));
        this._name = name;
        this._speed = 3;
        this._score = 0;
        this.clientRect = this.tank.getBoundingClientRect();
        this._lifeLeft = 100;
        this._radius = 25;
    }
    ;
    calculateCenters() {
        const x = this.clientRect.left + this.clientRect.width / 2;
        const y = this.clientRect.top + this.clientRect.height / 2;
        return {
            x: x,
            y: y
        };
    }
    ;
    shoot() {
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
    set color(color) {
        this._color = color;
    }
    ;
    get color() {
        return this._color;
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
