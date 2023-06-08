from game_components.player import Player
from constants import *
import random

class Game:
    def __init__(self):
        self.width = 1600
        self.height = 900
        self.players = []
        self.obstacles = []
        self.bullets_fired = []
        self.players_colors_length = 2
        
    def add_player(self, player_name: str, websocket):
        if len(self.players) > 0 and self.there_is_such_player(player_name):
            return {
                'type': message_types[CREATE],
                'errorMessage': 'There is already a player with that name!',
                'success': False, 
                'target_client': ''
            }
        
        x, y = self.find_random_position()
        color_index = random.randint(0, self.players_colors_length)
        player = Player(player_name, {'x': x, 'y': y}, color_index)
        self.players.append(player)
        return {
            'type': message_types[CREATE],
            'success': True,
            'position': player.position,
            'width': self.width,
            'height': self.height,
            'name': player_name,
            'color': color_index,
            'players': [{
                    'name': player.name, 
                    'position': player.position, 
                    'color': player.color
                } for player in self.players
            ]
        }
    
    def there_is_such_player(self, player_name: str):
        isIn = False
        for player in self.players:
            if player.name == player_name:
                isIn = True
        return isIn
    
    def find_random_position(self):
        return [random.randint(100, self.width - 100), random.randint(100, self.height - 100)]
    
    def remove_from_game(self, player_socket):
        pass