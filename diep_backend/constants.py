
PORT_NUMBER = 8001

MOVE = 0
ERROR = 1
COLLISION = 2
JOIN = 3
CREATE = 4
NEW_PLAYER = 5
INIT_CONNECTION = 6
BARREL_MOVED = 7
SHOOT = 8
BULLETS_UPDATE = 9
BULLET_COLLISION = 10

message_types = {
    MOVE: 'move',
    ERROR: 'error',
    COLLISION: 'collision',
    JOIN: 'join',
    CREATE: 'create',
    NEW_PLAYER: 'new_player',
    INIT_CONNECTION: 'init',
    BARREL_MOVED: 'barrel_moved',
    SHOOT: 'shoot',
    BULLETS_UPDATE: 'bullets_update',
    BULLET_COLLISION: 'bullet_collision',
}