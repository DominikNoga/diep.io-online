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
        color_index = random.randint(0, 2)
        player = Player(player_name, {'x': x, 'y': y}, color_index, str(websocket))
        self.players.append(player)
        print(f"Adding player on position: {player.position}")
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
        player_index = self.find_player_index_by_name(name)
        if player_index == None:
            print(f"Player {name} not found")
            return

        self.players[player_index].position = new_position
        print(f"Updated position of player {name} to {new_position}")

    def find_player_index_by_name(self, player_name):
        ind = None
        for index, player in enumerate(self.players):
            if player.name == player_name:
                ind = index
                break
        return ind
    
    def get_player_position(self,name):
        index = self.find_player_index_by_name(name)
        if index == None:
            print(f"Player {name} not found")
            return
        player  = self.players[index]
        print(f"Player {name} position: {player.position}")
        return player.position

    def check_for_collisions(self, name):
        player = self.find_player_index_by_name(name)
        self.check_for_player_player_collision(player)

    def objects_colide(self, o1, o2):
        distance = math.sqrt((o1.position['x'] - o2.position['x'])**2 +(o1.position['y'] - o2.position['y'])**2)
        return distance <= (o1.radius + o2.radius)
    
    def check_for_player_player_collision(self, player):
        for other_player in self.players:
            if player != other_player:
                if  self.objects_colide(player, other_player):
                    dx = player.position['x'] - other_player.position['x']
                    dy = player.position['y'] - other_player.position['y']
                    angle = math.atan2(dy, dx)
                    new_x = other_player.position['x'] + (2 * 25 + 1) * math.cos(angle)
                    new_y = other_player.position['y'] + (2 * 25 + 1) * math.sin(angle)
                    player.position['x'] = new_x
                    player.position['y'] = new_y
    
    def find_player_socket_by_name(self, name):
        return self.players[self.find_player_index_by_name(name)].websocket
    