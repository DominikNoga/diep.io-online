export default class GameObject extends HTMLElement {
    constructor() {
        super();
        this.position.x = Number(this.style.left);
        this.position.y = Number(this.style.top);
    }
}
