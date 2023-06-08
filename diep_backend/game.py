import math

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
        player = Player(player_name, {'x': x, 'y': y})
        self.players.append(player)
        print(player.position)
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

    def update_player_position(self, name, new_position):
        for player in self.players:
            if player.name == name:
                player.position = new_position
                print(f"Updated position of player {player.name} to {new_position}")
                return

        print(f"Player {name} not found.")

    def get_player_position(self,name):
        for player in self.players:
            print(player.position)
            if player.name == name:
                return player.position

    def check_for_collisions(self,name):
        for player in self.players:
            if player.name == name:
                for other_player in self.players:
                    if player != other_player:
                        distance = math.sqrt((player.position['x'] - other_player.position['x'])**2 +(player.position['y'] - other_player.position['y'])**2)
                        if distance <= 2 * 25:
                            dx = player.position['x'] - other_player.position['x']
                            dy = player.position['y'] - other_player.position['y']
                            angle = math.atan2(dy, dx)
                            new_x = other_player.position['x'] + (2 * 25 + 1) * math.cos(angle)
                            new_y = other_player.position['y'] + (2 * 25 + 1) * math.sin(angle)
                            player.position['x'] = new_x
                            player.position['y'] = new_y

