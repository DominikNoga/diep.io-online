import Player from "../components/player.js";
import Obstacle from "../components/obstacle.js";
import { GameObjectColor, Point } from "../constants.js";

export interface Message {
    type: string;
    success: boolean;
}

export interface CreateGameMessage extends Message {
    position?: Point;
    color?: number;
    errorMessage?: string;
    width?: number;
    height?: number;
    name?: string;
};

export interface CollisionMessage extends Message {

};

export interface MoveMessage extends Message {
    position?: Point;
    enemies?: Player[];
    obstacles?: Obstacle[];
};

export interface ErrorMessage extends Message {
    message: string;
};