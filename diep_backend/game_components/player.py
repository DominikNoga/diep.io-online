class Player:
    def __init__(self, name, position, color, websocket):
        self.name = name
        self.position = position
        self.color = color
        self.radius = 25
        self.websocket = websocket
        self.speed = 7
