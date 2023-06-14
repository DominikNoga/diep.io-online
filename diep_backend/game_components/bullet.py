class Bullet:
    def __init__(self, position, player_name: str, id: str):
        self.position = position
        self.radius = 9
        self.damage = 20
        self.id = id
        self.player_name = player_name
        