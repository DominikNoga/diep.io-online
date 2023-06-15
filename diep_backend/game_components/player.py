class Player:
    def __init__(self, name, position, color, id):
        """Class representing a player in the game.
        :param   name (str): The name of the player.
        :param   position (tuple): The position of the player on the game area.
        :param   color (str): The color of the player.
        :param   id (int): The unique identifier of the player.
        """
        self.name = name
        self.position = position
        self.color = color
        self.radius = 25
        self.speed = 7
        self.id = id
        self.life_left = 100
        self.score=0
       