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
        print(f"Adding player {player.name} on position: {player.position}")
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

    def update_player_position(self, name, keysPressed):
        player = self.find_object_by_property("name", name, "player")
        if player == None:
            print(f"Player {name} not found")
            return

        if keysPressed['ArrowRight']:
            player.position['x'] += player.speed
        if keysPressed['ArrowLeft']:
            player.position['x'] -= player.speed
        if keysPressed['ArrowUp']:
            player.position['y'] -= player.speed
        if keysPressed['ArrowDown']:
            player.position['y'] += player.speed
        
        return player.position

    def check_for_collisions(self, name):
        player = self.find_object_by_property("name", name, "player")
        self.check_for_player_player_collision(player)
        # for obstacle in self.obstacles:
        #     if self.circle_polygon_collide(player,obstacle):
        #         #TODO
        #         x=0
        self.check_for_bullet_player_collision()
    
    def check_for_bullet_player_collision(self):
        damaged_players = []
        buletts_ids = []
        for bullet, player in zip(self.bullets_fired, self.players):
            if self.circle_collide(bullet, player):
                if player.life_left > 0:
                    player.life_left -= bullet.damage
                damaged_players.append({
                    "name": player.name,
                    "lifeLeft": player.life_left
                })
                buletts_ids.append(bullet.id)
                
        return damaged_players, buletts_ids
    
    def check_for_player_player_collision(self, player):
        for other_player in self.players:
            if player != other_player:
                if self.circle_collide(player, other_player):
                    dx = player.position['x'] - other_player.position['x']
                    dy = player.position['y'] - other_player.position['y']
                    angle = math.atan2(dy, dx)
                    new_x = other_player.position['x'] + (2 * 25 + 1) * math.cos(angle)
                    new_y = other_player.position['y'] + (2 * 25 + 1) * math.sin(angle)
                    player.position['x'] = new_x
                    player.position['y'] = new_y
                
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
            value = self.dot_product(axis,vertices[i])
            if value < min_val:
                min_val = value
            elif value > max_val:
                max_val = value
        return min_val, max_val

    def project_circle(self, axis,position):
        projection = self.dot_product(position, axis)
        projection -= math.sqrt(axis['x'] ** 2 + axis['y'] ** 2)
        projection += math.sqrt(axis['x'] ** 2 + axis['y'] ** 2)
        return projection

    def generate_obstacles(self):
        return None

    def find_player_id_by_name(self, name):
        return self.find_object_by_property("name", name, "player").id
    
    
    def find_object_by_property(self, prop_name, prop_value, object_type):
        """Method used to find object by its property -> it should be unique

        Args:
            prop_name (string): name of the property for eg. "name"
            prop_value (Any): value of the property for eg. "Tom"
            object_type (string): one of the game objects: 'obstacle', 'bullet', 'player'

        Returns:
            Reference to the object with the property that we are looking for
        """
        if object_type == 'player':
            return next((player for  player in self.players if getattr(player, prop_name) == prop_value), None)
        
        elif object_type == 'bullet':
            return next((bullet for  bullet in self.bullets_fired if getattr(bullet, prop_name) == prop_value), None)
        
        elif object_type == 'obstacle':
            return next((obstacle for  obstacle in self.obstacles if getattr(obstacle, prop_name) == prop_value), None)
        
        else: print("Unknown object type")
        