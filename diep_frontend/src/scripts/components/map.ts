

export default class GameMap{
    public sizeX: number;
    public sizeY: number;
    public map: HTMLElement;

    constructor(){
        this.map = document.querySelector('.map');
    }
}