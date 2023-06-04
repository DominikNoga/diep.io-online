export const setHtmlElementPosition = (object, position) => {
    object.style.left = `${position.x}px`;
    object.style.top = `${position.y}px`;
};
export const createGameObject = (classes, position) => {
    const object = document.createElement('div');
    object.className = `game-object ${classes.join(' ')}`;
    setHtmlElementPosition(object, position);
    return object;
};
