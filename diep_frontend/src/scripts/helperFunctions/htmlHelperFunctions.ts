import { Point } from "../constants.js";

export const setHtmlElementPosition = (object: HTMLElement, position: Point) => {
    object.style.left = `${position.x}px`;
    object.style.top = `${position.y}px`;
}

export const createGameObject = (classes: string[], position: Point) : HTMLElement=>{
    const object = document.createElement('div');
    object.className = `game-object ${classes.join(' ')}`;
    setHtmlElementPosition(object, position);
    return object;
}
