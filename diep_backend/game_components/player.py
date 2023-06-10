import math
class Player:
    def __init__(self, name, position, color, id):
        self.name = name
        self.position = position
        self.color = color
        self.radius = 25
        self.speed = 7
        self.id = id
        self.barrel_angle = 0
        self.barrel_length = 3
        self.barrel_x = 0
        self.barrel_y = 0
        
    def calculateOffset(self, offset):
        self.barrel_angle = math.atan2(offset['x'], offset['y'])
        self.barrel_x = self.radius * self.barrel_length * math.cos(self.barrel_angle) + self.position['x']
        self.barrel_y = self.radius * self.barrel_length * math.sin(self.barrel_angle) + self.position['y']
        return {
            'barrel_angle': self.barrel_angle,
            'barrel_x': self.barrel_x,
            'barrel_y': self.barrel_y
        }
