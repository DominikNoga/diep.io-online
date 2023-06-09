class Player:
    def __init__(self, name, position, color, websocket):
        self.name = name
        self.position = position
        self.color = color
        self.radius = 27
        self.websocket = websocket
