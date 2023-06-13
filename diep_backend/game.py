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
        self.obstacles = self.generate_obstacles(20)
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

        x, y = self.find_random_not_occupied_position()
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
                    'color': player.color,
                    'lifeLeft': player.life_left,
                } for player in self.players
            ],
            'obstacles': [{
                'type': obstacle.type,
                'position': obstacle.position,
                'id': obstacle.id
            } for obstacle in self.obstacles]}

    
    def there_is_such_player(self, player_name: str):
        isIn = False
        for player in self.players:
            if player.name == player_name:
                isIn = True
        return isIn

    def find_random_not_occupied_position(self):
        while True:
            x,y=[random.randint(100, self.width - 100), random.randint(100, self.height - 100)]
            point={'x': x, 'y': y}
            if all(self.distance(point,obstacle.position)>50  for obstacle in self.obstacles):
                break
        return x,y

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
        return self.check_for_obstacle_player_collision(player)
        #self.check_for_bullet_player_collision()
        #self.check_for_bullet_obstacle_collision()
    
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
                if player.life_left<=0:
                    for enemy in self.players:
                        if enemy.name == bullet.player_name:
                            enemy.score+=player.score
                    self.players.remove(player)

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

    # def calculate_line_equation(self,vertex, prev_vertex):
    #     a = vertex['y'] - prev_vertex['y']
    #     b = prev_vertex['x'] - vertex['x']
    #     c = (vertex['x'] * prev_vertex['y']) - (prev_vertex['x'] * vertex['y'])
    #     return a, b, c
    #
    # def find_closest_edge(self, point,vertices):
    #     min_distance = math.inf
    #     closest_edge = None
    #     closest_vertex_index = 0
    #     prev_vertex=None
    #     first_vertex=None
    #     i = 0
    #     for vertex in vertices:
    #         if prev_vertex is not None:
    #             a,b,c=self.calculate_line_equation(vertex,prev_vertex)
    #             distance = abs(a * point['x'] + b * point['y'] + c) / math.sqrt(a ** 2 + b ** 2)
    #             print(distance)
    #             if distance < min_distance:
    #                 min_distance = distance
    #                 closest_edge = {'x': prev_vertex['x'] - vertex['x'], 'y': prev_vertex['y'] - vertex['y']}
    #                 closest_vertex_index = i
    #         else:
    #             first_vertex = vertex
    #         prev_vertex = vertex
    #         i += 1
    #     a, b, c = self.calculate_line_equation(prev_vertex, first_vertex)
    #     print(a)
    #     print(b)
    #     print(c)
    #     distance = abs(a * point['x'] + b * point['y'] + c) / math.sqrt(a ** 2 + b ** 2)
    #     print(distance)
    #     if distance < min_distance:
    #         closest_edge = {'x': first_vertex['x'] - prev_vertex['x'], 'y': first_vertex['y'] - prev_vertex['y']}
    #         closest_vertex_index = i
    #
    #     return closest_edge, closest_vertex_index
    # def find_intersection(self,p1, v1, p2, v2):
    #     t1 = (v2['x'] * (p1['y'] - p2['y']) - v2['y'] * (p1['x'] - p2['x'])) / (v1['x'] * v2['y'] - v1['y'] * v2['x'])
    #     t2 = (v1['x'] * (p1['y'] - p2['y']) - v1['y'] * (p1['x'] - p2['x'])) / (v1['x'] * v2['y'] - v1['y'] * v2['x'])
    #
    #     intersection_point = [p1['x'] + t1 * v1['x'], p1['y'] + t1 * v1['y']]
    #     return intersection_point
    def check_for_obstacle_player_collision(self,player):
        for obstacle in self.obstacles:
            if self.circle_collide(player,obstacle):
                self.players.remove(player)
                return False
        return True
                # dx = player.position['x'] - obstacle.position['x']
                # dy = player.position['y'] - obstacle.position['y']
                # angle = math.atan2(dy, dx)
                # closest_edge,closest_vertex_index=self.find_closest_edge(player.position,obstacle.vertices)
                # vector= {'x':player.position['x'] - obstacle.position['x'],'y': player.position['y'] - obstacle.position['y']}
                # new_position=self.find_intersection(obstacle.vertices[closest_vertex_index],closest_edge,player.position,vector)
                # player.position['x'] = new_position[0]+math.cos(angle)*25
                # player.position['y'] = new_position[1]+math.sin(angle)*25

    def check_for_bullet_obstacle_collision(self):
        damaged_obstacles = []
        buletts_ids = []
        new_obstacles=[]
        for bullet in self.bullets_fired:
            for obstacle in self.obstacles:
                if self.circle_collide(bullet, obstacle):
                    if obstacle.life_left > 0:
                        obstacle.life_left -= bullet.damage
                    damaged_obstacles.append({
                        "id": obstacle.id,
                        "lifeLeft": obstacle.life_left
                    })
                    if (obstacle.life_left <= 0):
                        for player in self.players:
                            if player.name == bullet.player_name:
                                if obstacle.type=="basic":
                                    player.score+=100;
                                if obstacle.type=="medium":
                                    player.score+=300;
                                if obstacle.type=="hard":
                                    player.score+=500;
                        new_obstacles.append(self.add_new_obstacle(obstacle.id))
                        self.obstacles.remove(obstacle)
                    buletts_ids.append(bullet.id)
                    self.bullets_fired.remove(bullet)
        return damaged_obstacles, buletts_ids,new_obstacles


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

    def generate_obstacles(self,num_obstacles):
        radius=25
        i=0
        obstacles=[]
        while i<num_obstacles:
            x = random.randint(0, self.width)
            y = random.randint(0, self.height)
            num_edges = random.randint(1, 3)
            obstacle2 = Obstacle({'x':x,'y': y },num_edges,radius,i)
            if all(not self.polygons_collide(obstacle1,obstacle2)for obstacle1 in obstacles):
                obstacles.append(obstacle2)
            else:
                i-=1
            i+=1
        return obstacles

    def add_new_obstacle(self,id):
        x,y=self.find_random_not_occupied_position()
        num_edges = random.randint(1, 3)
        radius = 25
        obstacle=Obstacle({'x': x, 'y': y}, num_edges, radius, id)
        self.obstacles.append(obstacle)
        return {'type':obstacle.type,
                'position': obstacle.position,
                'id':obstacle.id}

