import math
class Player:
    def __init__(self, name, position, color, id):
        self.name = name
        self.position = position
        self.color = color
        self.radius = 25
        self.speed = 7
        self.id = id
        self.life_left = 100
        self.barrel_params = {
            "position": {
                "x": 0,
                "y": 0,
            },
            "angle": math.pi/2,
            "length": 3
        }

    def setBarrelParams(self, position, angle):
        self.barrel_params["position"] = position
        self.barrel_params["angle"] = angle