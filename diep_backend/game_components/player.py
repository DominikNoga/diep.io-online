class Player:
    def __init__(self, name, position, color, id):
        self.name = name
        self.position = position
        self.color = color
        self.radius = 25
        self.speed = 7
        self.id = id
        self.life_left = 100
        self.score=0
       