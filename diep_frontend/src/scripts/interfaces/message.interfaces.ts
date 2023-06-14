import Player from "../components/player.js";
import Obstacle from "../components/obstacle.js";
import { GameObjectColor, Point } from "../constants.js";
import { ObstacleTypeString } from "../constants.js";

export interface Message {
    type: string;
    name?:string;
    success?: boolean;
}


/**
 *
 *
 * @export
 * @interface CreateGameMessage
 * @property position: random position for a new player 
 * @property color: random color for a new player
 * @property width: width of a map
 * @property height: height of a map
 * @property name: name of a new player passed in form
 * @property players: list of players that is already in game
 * @property obstacles: list of obstacles
 * @extends {Message}
 */
type ScoreMsg={
    name:string;
    score:number;
}
type PlayerMsg = {
    position: Point;
    name: string;
    color: number;
    lifeLeft: number;
}

type ObstacleMsg={
    position: Point;
    type: ObstacleTypeString;
    id: number;
}

export interface CreateGameMessage extends Message {
    position?: Point;
    color?: number;
    errorMessage?: string;
    width?: number;
    height?: number;
    players?: PlayerMsg[];
    obstacles?: ObstacleMsg[];
};

export interface CollisionMessage extends Message {
};

export interface MoveMessage extends Message {
    position?: Point;
    enemies?: Player[];
    obstacles?: Obstacle[];
    isAlive?: boolean;
};

export interface ErrorMessage extends Message {
    message: string;
};

export interface NewPlayerMessage extends Message {
    color: number;
    position?: Point;
};

export interface InitConnectionMessage extends Message {
    clientId: string;
};

export interface ShootMessage extends Message {
    bulletId: string;
    bulletColor: GameObjectColor;
    bulletPosition: Point;
    bulletAngle: number;
};

type PlayerLifeInfo = {
    name: string;
    lifeLeft: number;
}
type ObstacleLifeInfo = {
    id: number;
    lifeLeft: number;
}
export interface BulletCollisionMessage extends Message {
    damagedPlayers?: PlayerLifeInfo[];
    damagedObstacles?: ObstacleLifeInfo[];
    bulletIds: string[];
    scoreMsg:ScoreMsg[];
    newObstacles: ObstacleMsg[];
};