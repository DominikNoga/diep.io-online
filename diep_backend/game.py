import math

from game_components.player import Player
from game_components.obstacle import Obstacle
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
        
    def add_player(self, player_name: str):
        if len(self.players) > 0 and self.there_is_such_player(player_name):
            return {
                'type': message_types[CREATE],
                'errorMessage': 'There is already a player with that name!',
                'success': False
            }
        
        x, y = self.find_random_position()
        player = Player(player_name, {'x': x, 'y': y})
        self.players.append(player)
        print(player.position)
        return {
            'type': message_types[CREATE],
            'success': True,
            'position': {'x': x, 'y': y},
            'width': self.width,
            'height': self.height,
            'name': player_name,
            'color': random.randint(0, self.players_colors_length)
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
            if player.name == name:
                return player.position

    def check_for_collisions(self,name):
        for player in self.players:
            if player.name == name:
                polygon = Obstacle({'x': 100, 'y': 100}, 5, 25)
                print(self.circle_polygon_collide(player,polygon))
                for other_player in self.players:
                    if player != other_player:
                        if self.circle_collide(player,other_player):
                            dx = player.position['x'] - other_player.position['x']
                            dy = player.position['y'] - other_player.position['y']
                            angle = math.atan2(dy, dx)
                            new_x = other_player.position['x'] + (2 * 25 + 1) * math.cos(angle)
                            new_y = other_player.position['y'] + (2 * 25 + 1) * math.sin(angle)
                            player.position['x'] = new_x
                            player.position['y'] = new_y
                for obstacle in self.obstacles:
                    if self.circle_polygon_collide(player,obstacle):
                        #TODO
                        x=0
                for bullet in self.bullets_fired:
                    if self.circle_collide(bullet,player):
                        #TODO
                        x=0
    def circle_collide(self,obj1,obj2):
        distance = math.sqrt((obj1.position['x'] - obj2.position['x']) ** 2 + (obj1.position['y'] - obj2.position['y']) ** 2)
        return distance <=(obj1.radius+obj2.radius)

    def dot_product(self,vector1, vector2):
        return vector1['x'] * vector2['x'] + vector1['y'] * vector2['y']

    def polygons_collide(self,obj1, obj2):
        for axis in obj1.normals+obj2.normals:
            min_a, max_a = self.project_polygon(axis, obj1.vertices)
            min_b, max_b = self.project_polygon(axis, obj2.vertices)
            if min_a > max_b or min_b > max_a:
                return False
        return True


    def distance(self,p1, p2):
        return math.sqrt((p1['x'] - p2['x']) ** 2 + (p1['y'] - p2['y']) ** 2)

    def circle_polygon_collide(self,round_obj,polygon_obj):
        prev_vertex=None
        for vertex in polygon_obj.vertices:
            if self.distance(round_obj.position,vertex) <= round_obj.radius:
                return True
            if prev_vertex is not None:
                closest_x, closest_y = self.closest_point_on_segment(round_obj.position, prev_vertex, vertex)
                if self.distance(round_obj.position,{'x':closest_x,'y':closest_y}) <= round_obj.radius:
                    return True
            prev_vertex=vertex
        return False

    def closest_point_on_segment(self,c,v1,v2):
        dx = v2['x'] - v1['x']
        dy = v2['y'] - v1['y']
        t = ((c['x'] - v1['x']) * dx + (c['y'] - v1['y']) * dy) / (dx * dx + dy * dy)
        t = max(0, min(1, t))  # Limit t to the range [0, 1]
        closest_x = v1['x'] + t * dx
        closest_y = v1['y'] + t * dy
        return closest_x, closest_y

    def project_polygon(self,axis, vertices):
        min_val = max_val = self.dot_product(axis,vertices[0])
        for i in range(1, len(vertices)):
            value =self.dot_product(axis,vertices[i])
            if value < min_val:
                min_val = value
            elif value > max_val:
                max_val = value
        return min_val, max_val

    def project_circle(self, axis,position):
        projection = self.dot_product(position,axis)
        projection -= math.sqrt(axis['x'] ** 2 + axis['y'] ** 2)
        projection += math.sqrt(axis['x'] ** 2 + axis['y'] ** 2)
        return projection

    def generate_obstacles(self):
        return None



