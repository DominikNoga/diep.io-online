import { handlePlayerMovement } from "./gameMechanics.js";
import Player from "./player.js";
const tank = document.querySelector('.tank');
const player = new Player(tank);
document.addEventListener("keydown", (e) => {
    handlePlayerMovement(player, e.key);
});
