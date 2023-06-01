import PlayerInterface from "./interfaces/player.interface";
import { handlePlayerMovement } from "./gameMechanics.js";
import { Point } from "./constants";

export default class Player implements PlayerInterface {
    private _top: number;
    private _left: number;
    private centerX: number;
    private centerY: number;
    private _tank: HTMLElement;
    private clientRect: DOMRect;

    public constructor(tank: HTMLElement) {
        this._tank = tank;
        this._top = Number(this.tank.style.top);
        this._left = Number(this.tank.style.left);
        this.clientRect = this.tank.getBoundingClientRect();
    }

    private calculateCenters(): Point{
        const x = this.clientRect.left + this.clientRect.width/2;
        const y = this.clientRect.top + this.clientRect.height/2;
        return {
            x: x,
            y: y
        }
    }

    public getUpdatedPlayerPosition(leftValue: number, topValue: number): Point {
        return {
            x: this.left + leftValue,
            y: this.top + topValue
        }   
    }

    public changePosition(leftValue: number, topValue: number): void {
        const updatedPositon = this.getUpdatedPlayerPosition(leftValue, topValue);
        this.left = updatedPositon.x;
        this.top = updatedPositon.y;
        this.tank.style.top = `${this.top}px`
        this.tank.style.left = `${this.left}px`
    }

    public move(key: string) {
        handlePlayerMovement(this, key);
        requestAnimationFrame(() => {});
    }

    public get tank(): HTMLElement {
        return this._tank;
    };

    public get top(): number {
        return this._top;
    };

    public get left(): number {
        return this._left;
    };

    public set top(top: number){
        this._top = top;
    }
    public set left(left: number){
        this._left = left;
    }
}