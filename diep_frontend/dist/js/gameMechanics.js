import { Direction, MOVE_VALUE } from "./constants.js";
export const handlePlayerMovement = (player, key) => {
    let leftValue = 0, topValue = 0;
    if (key === Direction.UP) {
        topValue -= MOVE_VALUE;
    }
    if (key === Direction.DOWN) {
        topValue += MOVE_VALUE;
    }
    if (key === Direction.LEFT) {
        leftValue -= MOVE_VALUE;
    }
    if (key === Direction.RIGHT) {
        leftValue += MOVE_VALUE;
    }
    requestAnimationFrame(() => {
        player.changePosition(leftValue, topValue);
    });
};
