export default class Player {
    constructor(tank, name) {
        this._tank = tank;
        this._top = Number(this.tank.style.top);
        this._left = Number(this.tank.style.left);
        this._name = name;
        this._speed = 5;
        this.clientRect = this.tank.getBoundingClientRect();
        this._lifeLeft = 100;
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
    getUpdatedPlayerPosition(leftValue, topValue) {
        return {
            x: this.left + leftValue,
            y: this.top + topValue
        };
    }
    ;
    changePosition(leftValue, topValue) {
        const updatedPositon = this.getUpdatedPlayerPosition(leftValue, topValue);
        this.left = updatedPositon.x;
        this.top = updatedPositon.y;
        this.tank.style.top = `${this.top}px`;
        this.tank.style.left = `${this.left}px`;
    }
    ;
    get tank() {
        return this._tank;
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
    get size() {
        return this._size;
    }
    ;
    set size(size) {
        this._size = size;
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
    set name(value) {
        this._name = value;
    }
    get score() {
        return this._score;
    }
    set score(value) {
        this._score = value;
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;
    }
    get speed() {
        return this._speed;
    }
    set speed(value) {
        this._speed = value;
    }
}
