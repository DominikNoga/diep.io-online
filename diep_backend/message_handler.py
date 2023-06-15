from constants import *
import asyncio
import json
from game_components.bullet import Bullet
from game import Game

class MessageHandler:
    """
    :param game (Game): The game instance.
    :param sleep_time (float): The sleep time between sending messages.
    :param last_adding_result (dict): The result of the last adding operation.
    :param last_bullet_update_result (dict): The result of the last bullet update operation.
    :param bullets_to_delete (set): A set of bullet IDs to delete.
    :param delete_bullets_treshold (int): The threshold value to trigger bullet deletion.
    """
    def __init__(self, game: Game):
        """Initialize the MessageHandler.

        
            :param game (Game): The game instance.
        """
        self.game = game
        self.sleep_time = 0.1
        self.last_adding_result = None
        self.last_bullet_update_result = None
        self.bullets_to_delete = set()
        self.delete_bullets_treshold = 15
        
    async def send_collision_message(self, websocket, message):
        """Send a collision message to the specified websocket.

        
        :param websocket: The websocket to send the message to.
        :param message: The collision message.

        """
        event = {
            "type": message_types[COLLISION],
            "object": message['object'],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)

    async def send_error_message(self, websocket, message):
        """Send an error message to the specified websocket.

        
        :param websocket: The websocket to send the message to.
        :param message: The error message.

        """
        event = {
            "type": message_types[ERROR],
            "message": message['content']
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)

    async def send_move_message(self, websocket, message: dict, connected_players):
        """Send a move message to the specified websocket.

        
        :param websocket: The websocket to send the message to.
        :param message (dict): The move message.
        :param connected_players: A dictionary mapping websockets to player IDs.

        """

        self.game.update_player_position(message["name"], message["position"])
        event={
                "type": message_types[MOVE],
               "position": message['position'],
               "name": message["name"]
        }
        if connected_players[websocket] != message['clientId']:
            await websocket.send(json.dumps(event))

    async def send_create_message(self, websocket):
        """Send a create message to the specified websocket.

        
        :param websocket: The websocket to send the message to.

        """
        event = self.last_adding_result
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
    
    async def send_new_player_message(self, websocket):
        """Send a new player message to the specified websocket.

        
        :param websocket: The websocket to send the message to.

        """
        event = {
            "type": message_types[NEW_PLAYER],
            "position": self.last_adding_result["position"],
            "color": self.last_adding_result["color"],
            "name": self.last_adding_result["name"],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)

    
    
    async def send_init_connection_message(self, websocket, id):
        """Send an initialization connection message to the specified websocket.

        
        :param websocket: The websocket to send the message to.
        :param id: The client ID.

        """
        event = {
            "type": message_types[INIT_CONNECTION],
            "clientId": id
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
        
    async def handle_shoot_message(self, connected_players, websocket, message):
        """Handle a shoot message.

        
        :param connected_players: A dictionary mapping websockets to player IDs.
        :param websocket: The websocket the message is received from.
        :param message: The shoot message.

        """

        if connected_players[websocket] == message['clientId']:
            self.game.bullets_fired.append(Bullet(message['bulletPosition'], message['playerName'], message['bulletId']))
            return
        
        event = {
            'bulletId': message['bulletId'],
            'playerName': message['playerName'],
            'bulletPosition': message['bulletPosition'],
            'bulletColor': message['bulletColor'],
            'type': message_types[SHOOT],
            'bulletAngle': message['bulletAngle'],
        }
        
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
    
    async def handle_join_message(self, websocket, player_id, message: dict, index):
        """Handle a join message.

        
        :param websocket: The websocket the message is received from.
        :param player_id: The ID of the player.
        :param message (dict): The join message.
        :param index: The index of the player in the connection.

        """
        if index == 0:
            self.last_adding_result = self.game.add_player(message["name"], message["clientId"]) # here passing the wrong websocket sometimes, not always the first user in conn has to have right socket
        
        if self.game.find_player_id_by_name(message["name"]) == player_id:
            await self.send_create_message(websocket)
        
        else:
            await self.send_new_player_message(websocket)
    
    async def handle_move_message(self, websocket, message: dict, connected_players):
        """Handle a move message.

        
        :param websocket: The websocket the message is received from.
        :param message (dict): The move message.
        :param connected_players: A dictionary mapping websockets to player IDs.

        """
        await self.send_move_message(websocket, message, connected_players)
    
    async def handle_bullets_update_message(self, connected_players, message):
        """Handle a bullets update message.

        
        :param connected_players: A dictionary mapping websockets to player IDs.
        :param message: The bullets update message.

        """
        for bullet in message["updatedBullets"]:
            position = bullet['position']
            if position['x'] > self.game.width or position['x'] < 0 or position['y'] > self.game.height or position['y'] < 0:
                self.bullets_to_delete.add(bullet['id'])
                continue
            b = self.game.find_object_by_property('id', bullet['id'], 'bullet')
            if b is not None:
                b.position = position
        damaged_players, collided_bullets_ids = self.game.check_for_bullet_player_collision()
        damaged_obstacles,collided_bullets_ids_obs,new_obstacles =self.game.check_for_bullet_obstacle_collision()


        if len(self.bullets_to_delete) > 0:
            self.game.bullets_fired = [bullet for bullet in self.game.bullets_fired if bullet.id not in self.bullets_to_delete]
        
        if len(damaged_players) <= 0 and len(damaged_obstacles)<=0:
            return
        event = {
            'damagedPlayers': damaged_players,
            'damagedObstacles': damaged_obstacles,
            'bulletIds': collided_bullets_ids+collided_bullets_ids_obs,
            'type': message_types[BULLET_COLLISION],
            'scoreMsg':[{'name':player.name,
                      'score':player.score}for player in self.game.players],
            'newObstacles':new_obstacles
        }
        
        self.game.bullets_fired = [bullet for bullet in self.game.bullets_fired if bullet.id not in collided_bullets_ids]
        
        for ws in connected_players:
            await ws.send(json.dumps(event))
            await asyncio.sleep(self.sleep_time)
