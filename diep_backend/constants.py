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
}
