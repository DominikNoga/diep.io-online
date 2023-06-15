class Bullet:
    def __init__(self, position, player_name: str, id: str):
        """Class representing a bullet in the game.

        :param   position (dict): The position of the bullet on the game area.
        :param   player_name (str): The name of the player who fired the bullet.
        :param   id (str): The unique identifier of the bullet.
        """
        self.position = position
        self.radius = 9
        self.damage = 20
        self.id = id
        self.player_name = player_name
        