import { handlePlayerMovement } from "./gameMechanics.js";
export default class Player {
    constructor(tank) {
        this._tank = tank;
        this._top = Number(this.tank.style.top);
        this._left = Number(this.tank.style.left);
        this.clientRect = this.tank.getBoundingClientRect();
    }
    calculateCenters() {
        const x = this.clientRect.left + this.clientRect.width / 2;
        const y = this.clientRect.top + this.clientRect.height / 2;
        return {
            x: x,
            y: y
        };
    }
    getUpdatedPlayerPosition(leftValue, topValue) {
        return {
            x: this.left + leftValue,
            y: this.top + topValue
        };
    }
    changePosition(leftValue, topValue) {
        const updatedPositon = this.getUpdatedPlayerPosition(leftValue, topValue);
        this.left = updatedPositon.x;
        this.top = updatedPositon.y;
        this.tank.style.top = `${this.top}px`;
        this.tank.style.left = `${this.left}px`;
    }
    move(key) {
        handlePlayerMovement(this, key);
        requestAnimationFrame(() => { });
    }
    get tank() {
        return this._tank;
    }
    ;
    get top() {
        return this._top;
    }
    ;
    get left() {
        return this._left;
    }
    ;
    set top(top) {
        this._top = top;
    }
    set left(left) {
        this._left = left;
    }
}
