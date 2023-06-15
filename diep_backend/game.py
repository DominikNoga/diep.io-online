import math

from game_components.player import Player
from game_components.obstacle import Obstacle
from constants import *
import random


class Game:
    class Game:
        """Class representing the game logic and component management.

      :param   width (int): The width of the game area.
      :param   height (int): The height of the game area.
      :param   players (list): A list of Player objects representing the players in the game.
      :param   obstacles (list): A list of Obstacle objects representing the obstacles in the game.
      :param  bullets_fired (list): A list of Bullet objects representing the fired bullets in the game.
      :param   players_colors_length (int): The number of available colors for players.
      :param   players_to_remove (list): A list of players to be removed from the game.
        """

    def __init__(self):
        self.width = 1600
        self.height = 900
        self.players = []
        self.obstacles = self.generate_obstacles(10)
        self.bullets_fired = []
        self.players_colors_length = 2
        self.players_to_remove = []

    def add_player(self, player_name: str, websocket):
        """Add a new player to the game.

        :param  player_name (str): The name of the player.
        :param  websocket: The WebSocket associated with the player.

        :return: (dict) A dictionary containing information about the success of the operation and game state.
        """
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
        """Check if a player with the given name already exists in the game.


        :param player_name (str): The name of the player to check.

        :return:
            bool: True if a player with the given name already exists, False otherwise.
        """
        isIn = False
        for player in self.players:
            if player.name == player_name:
                isIn = True
        return isIn

    def find_random_not_occupied_position(self):
        """Find a random position in the game that is not occupied by any obstacles.

        :return:
            tuple[int, int]: The x and y coordinates of the randomly generated position.
        """
        while True:
            x, y = [random.randint(100, self.width - 100), random.randint(100, self.height - 100)]
            point = {'x': x, 'y': y}
            if all(self.distance(point, obstacle.position) > 50 for obstacle in self.obstacles):
                break
        return x, y

    def update_player_position(self, name, position):
        """Update the position of a player in the game.

        :param name (str): The name of the player to update.
        :param position (dict): The new position of the player.
        """
        player = self.find_object_by_property("name", name, "player")
        if player == None:
            print(f"Player {name} not found")
            return
        player.position = position

    def check_for_collisions(self, name):
        """Check for collisions between game objects and handle them.

        :param name (str): The name of the player to check collisions for.

        :return:
            bool: True if a collision with an obstacle occurs, False otherwise.
        """
        player = self.find_object_by_property("name", name, "player")
        self.check_for_player_player_collision(player)
        return not self.check_for_obstacle_player_collision(player)

    def check_for_bullet_player_collision(self):
        """Check for collisions between bullets and players.

        :return:
            tuple[list[dict], list[int]]: A tuple containing a list of damaged players and a list of bullet IDs.
        """
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
                if player.life_left <= 0:
                    for enemy in self.players:
                        if enemy.name == bullet.player_name:
                            enemy.score += player.score
                    self.players.remove(player)

        return damaged_players, buletts_ids

    def check_for_player_player_collision(self, player):
        """Check for collisions between players and handle them.

        :param player (Player): The player to check collisions for.
        """
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

    def check_for_obstacle_player_collision(self, player):
        """Check for collisions between players and obstacles.

        
        :param player (Player): The player to check collisions for.

        :return:
            bool: True if a collision with an obstacle occurs, False otherwise.
        """
        for obstacle in self.obstacles:
            if self.circle_collide(player, obstacle):
                # self.players.remove(player)
                return True
        return False

    def check_for_bullet_obstacle_collision(self):
        """Check for collisions between bullets and obstacles.

        :return:
            tuple[list[dict], list[int], list[Obstacle]]: A tuple containing a list of damaged obstacles,
                a list of bullet IDs, and a list of new obstacles to be added.
        """
        damaged_obstacles = []
        buletts_ids = []
        new_obstacles = []
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
                                if obstacle.type == "basic":
                                    player.score += 100
                                if obstacle.type == "medium":
                                    player.score += 300
                                if obstacle.type == "hard":
                                    player.score += 500
                        new_obstacles.append(self.add_new_obstacle(obstacle.id))
                        self.obstacles.remove(obstacle)
                    buletts_ids.append(bullet.id)
                    self.bullets_fired.remove(bullet)
        return damaged_obstacles, buletts_ids, new_obstacles

    def circle_collide(self, obj1, obj2):
        """Check if two circular objects collide.

        
        :param obj1: The first object to check.
        :param obj2: The second object to check.

        :return:
            bool: True if the objects collide, False otherwise.
        """
        distance = math.sqrt(
            (obj1.position['x'] - obj2.position['x']) ** 2 + (obj1.position['y'] - obj2.position['y']) ** 2)
        return distance <= (obj1.radius + obj2.radius)

    def dot_product(self, vector1, vector2):
        return vector1['x'] * vector2['x'] + vector1['y'] * vector2['y']

    def polygons_collide(self, obj1, obj2):
        """Check if two polygons collide with each other.

        
        :param obj1 (Obstacle): The first polygon object.
        :param obj2 (Obstacle): The second polygon object.

        :return:
            bool: True if the polygons collide, False otherwise.
        """
        for axis in obj1.normals + obj2.normals:
            min_a, max_a = self.project_polygon(axis, obj1.vertices)
            min_b, max_b = self.project_polygon(axis, obj2.vertices)
            if min_a > max_b or min_b > max_a:
                return False
        return True

    def distance(self, p1, p2):
        """Calculate the distance between two points in 2D space.

        
        :param p1 (dict): The coordinates of the first point, with keys 'x' and 'y'.
        :param p2 (dict): The coordinates of the second point, with keys 'x' and 'y'.

        :return:
            float: The distance between the two points.
        """
        return math.sqrt((p1['x'] - p2['x']) ** 2 + (p1['y'] - p2['y']) ** 2)

    def closest_point_on_segment(self, c, v1, v2):
        """Find the closest point on a line segment to a given point.

        
        :param c (dict): The coordinates of the point, with keys 'x' and 'y'.
        :param v1 (dict): The coordinates of the first endpoint of the line segment, with keys 'x' and 'y'.
        :param v2 (dict): The coordinates of the second endpoint of the line segment, with keys 'x' and 'y'.

        :return:
            tuple[float, float]: The coordinates of the closest point on the line segment.
        """
        dx = v2['x'] - v1['x']
        dy = v2['y'] - v1['y']
        t = ((c['x'] - v1['x']) * dx + (c['y'] - v1['y']) * dy) / (dx * dx + dy * dy)
        t = max(0, min(1, t))  # Limit t to the range [0, 1]
        closest_x = v1['x'] + t * dx
        closest_y = v1['y'] + t * dy
        return closest_x, closest_y

    def project_polygon(self, axis, vertices):
        """Project a polygon onto an axis and determine the minimum and maximum values.

        
            axis (dict): The axis to project onto, with keys 'x' and 'y'.
            vertices (list[dict]): The vertices of the polygon, each with keys 'x' and 'y'.

        :return:
            tuple[float, float]: The minimum and maximum values of the projected polygon on the axis.
        """
        min_val = max_val = self.dot_product(axis, vertices[0])
        for i in range(1, len(vertices)):
            value = self.dot_product(axis, vertices[i])
            if value < min_val:
                min_val = value
            elif value > max_val:
                max_val = value
        return min_val, max_val

    def find_player_id_by_name(self, name):
        return self.find_object_by_property("name", name, "player").id

    def find_object_by_property(self, prop_name, prop_value, object_type):
        """Method used to find object by its property -> it should be unique

        
            prop_name (string): name of the property for eg. "name"
            prop_value (Any): value of the property for eg. "Tom"
            object_type (string): one of the game objects: 'obstacle', 'bullet', 'player'

        :return:
            Reference to the object with the property that we are looking for
        """
        if object_type == 'player':
            return next((player for player in self.players if getattr(player, prop_name) == prop_value), None)

        elif object_type == 'bullet':
            return next((bullet for bullet in self.bullets_fired if getattr(bullet, prop_name) == prop_value), None)

        elif object_type == 'obstacle':
            return next((obstacle for obstacle in self.obstacles if getattr(obstacle, prop_name) == prop_value), None)

        else:
            print("Unknown object type")

    def generate_obstacles(self, num_obstacles):
        """Generate a specified number of obstacles.

        
            num_obstacles (int): The number of obstacles to generate.

        :return:
            list[Obstacle]: A list of generated obstacles.

        Note:
            The method ensures that the generated obstacles do not collide with each other.
        """
        radius = 25
        i = 0
        obstacles = []
        while i < num_obstacles:
            x = random.randint(0, self.width)
            y = random.randint(0, self.height)
            num_edges = random.randint(1, 3)
            obstacle2 = Obstacle({'x': x, 'y': y}, num_edges, radius, i)
            if all(not self.polygons_collide(obstacle1, obstacle2) for obstacle1 in obstacles):
                obstacles.append(obstacle2)
            else:
                i -= 1
            i += 1
        return obstacles

    def add_new_obstacle(self, id):
        """Add a new obstacle to the game.

        
            id (int): The ID of the obstacle.

        :return:
            dict: A dictionary containing information about the added obstacle, including its type, position, and ID.
        """
        x, y = self.find_random_not_occupied_position()
        num_edges = random.randint(1, 3)
        radius = 25
        obstacle = Obstacle({'x': x, 'y': y}, num_edges, radius, id)
        self.obstacles.append(obstacle)
        return {'type': obstacle.type,
                'position': obstacle.position,
                'id': obstacle.id}