import Game from "./game.js";
import GameManager from "./gameManager.js";
addEventListener('load', () => {
    const map = document.querySelector('#map');
    const ctx = map.getContext('2d');
    map.width = 1600;
    map.height = 900;
    const game = new Game(map.width, map.height);
    const gm = new GameManager(game, ctx);
    gm.runGame();
});
