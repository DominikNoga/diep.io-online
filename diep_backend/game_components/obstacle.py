import math

bullet_damage = 20

class Obstacle:
    def __init__(self, position,num_edges,radius,id):
        """Class representing an obstacle in the game.

        :param   position (dict): The position of the obstacle on the game area.
        :param   num_edges (int): The number of edges the obstacle has.
        :param   radius (int): The radius of the obstacle.
        :param   id (int): The unique identifier of the obstacle.
        """
        self.position = position
        self.num_edges=num_edges
        self.num_edges += 2
        self.radius=radius+4
        self.vertices = []
        self.edges = []
        self.normals = []
        self.id=id
        if num_edges == 1:
            self.type ='basic'
            self.life_left = bullet_damage
        elif num_edges == 2:
            self.type ='medium'
            self.life_left = 2*bullet_damage
        elif num_edges == 3:
            self.type ='hard'
            self.life_left = 3*bullet_damage
        angle = 360 / self.num_edges
        for vertex_index in range(self.num_edges):
            radian_angle = math.radians(angle * vertex_index)
            x = self.radius * math.cos(radian_angle)+self.position['x']
            y = self.radius * math.sin(radian_angle)+self.position['y']
            self.vertices.append({'x': x, 'y': y})
        prev_vertex = None
        first_vertex = None
        for vertex in self.vertices:
            if prev_vertex is not None:
                x = prev_vertex['x'] - vertex['x']
                y = prev_vertex['y'] - vertex['y']
                self.edges.append({'x': x, 'y': y})
                self.normals.append({'x': -y, 'y': x})
            else:
                first_vertex = vertex
            prev_vertex = vertex
        x = first_vertex['x'] - prev_vertex['x']
        y = first_vertex['y'] - prev_vertex['y']
        self.edges.append({'x': x, 'y': y})
        self.normals.append({'x': -y, 'y': x})
