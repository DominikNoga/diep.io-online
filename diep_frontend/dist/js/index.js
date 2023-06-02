import Player from "./components/player.js";
import Game from "./game.js";
const tank = document.querySelector('.tank');
const player = new Player(tank, "Domin");
const game = new Game(player);
game.run();
