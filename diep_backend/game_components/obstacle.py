import math


class Obstacle:
    def __init__(self, position,num_edges,radius):
        self.position = position
        self.num_edges=num_edges
        self.num_edges += 2
        self.radius=radius+4
        self.vertices = []
        self.edges = []
        self.normals = []
        if num_edges == 1:
            self.type ='basic'
            self.life_left = 5
        elif num_edges == 2:
            self.type ='medium'
            self.life_left = 10
        elif num_edges == 3:
            self.type ='hard'
            self.life_left = 15
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

