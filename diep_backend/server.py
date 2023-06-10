import json
import asyncio
from constants import *
import websockets
from game import Game
import uuid
import traceback
from game_components.bullet import Bullet


class Server:
    def __init__(self):
        self.connected_players = {}
        self.game = Game()
        self.last_adding_result = None
        self.sleep_time = 0.01


    async def send_collision_message(self, websocket, message):
        event = {
            "type": message_types[COLLISION],
            "object": message['object'],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)

    async def send_error_message(self, websocket, message):
        event = {
            "type": message_types[ERROR],
            "message": message['content']
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)

    async def send_move_message(self, websocket, message: dict):
        updated_pos = self.game.update_player_position(message["name"], message["direction"])
        self.game.check_for_collisions(message["name"])
        event={
                "type": message_types[MOVE],
               "position": updated_pos,
               "name": message["name"],
               #"players": self.game.players,
               #"obstacles": self.game.obstacles
        }
        await websocket.send(json.dumps(event))

    async def send_create_message(self, websocket):
        event = self.last_adding_result
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
    
    async def send_new_player_message(self, websocket, message):
        event = {
            "type": message_types[NEW_PLAYER],
            "position": self.last_adding_result["position"],
            "color": self.last_adding_result["color"],
            "name": self.last_adding_result["name"],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)

    
    
    async def send_init_connection_message(self, websocket, id):
        event = {
            "type": message_types[INIT_CONNECTION],
            "clientId": id
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
    
    async def handle_barrel_moved_message(self, websocket, message):
        index = self.game.find_player_index_by_name(message["name"])
        self.game.players[index].setBarrelParams(message['barrelPosition'], message['barrelAngle'])
        event = {
            "type": message_types[BARREL_MOVED],
            "barrelPosition": message['barrelPosition'],
            "barrelAngle": message['barrelAngle'],
            "name": message['name'],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
        
    async def handle_shoot_message(self, websocket, message):
        self.game.bullets_fired.append(Bullet(message['bulletPosition'], message['playerName'], message['bulletId']))

        if self.connected_players[message['clientId']] == websocket:
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
        if index == 0:
            self.last_adding_result = self.game.add_player(message["name"], message["clientId"]) # here passing the wrong websocket sometimes, not always the first user in conn has to have right socket
        
        if self.game.find_player_id_by_name(message["name"]) == player_id:
            await self.send_create_message(websocket)
        
        else:
            await self.send_new_player_message(websocket, message)
    
    async def handle_move_message(self, websocket, message: dict):
        await self.send_move_message(websocket, message)
    
    async def handle_recieved_message(self, websocket, player_id, message, index):
        message = json.loads(message)
        message_type = message['type']
        try:
            if message_type == message_types[MOVE]:
                await self.handle_move_message(websocket, message)
            
            elif message_type == message_types[JOIN]:
                await self.handle_join_message(websocket, player_id, message, index)
            
            elif message_type == message_types[BARREL_MOVED]:
                await self.handle_barrel_moved_message(websocket ,message)
            
            elif message_type == message_types[SHOOT]:
                await self.handle_shoot_message(websocket, message)
            
            else: print(f"No such message type {message_type}")
        
        except Exception as err:
            traceback_info = traceback.format_exc()

            # Print or handle the traceback information
            print(traceback_info)
            await self.send_error_message(websocket, {
                "content": f"there was an error {str(err)}"
            }) 

    async def recieveMessages(self, websocket):
        try:
            async for message in websocket:
                for index, (player_id, player_socket) in enumerate(self.connected_players.items()):
                    await self.handle_recieved_message(player_socket, player_id, message, index)

        except websockets.exceptions.ConnectionClosed as e:
            print("A client just disconnected")

        finally:
            for player_id, player_socket in self.connected_players.items():
                if player_socket == websocket:
                    del self.connected_players[player_id]
                    break

    async def handler(self, websocket):
        print(f"New client connected {websocket}")
        client_id = str(uuid.uuid4())

        # Store the WebSocket object with the generated client ID
        self.connected_players[client_id] = websocket

        # Send the client ID to the client
        await self.send_init_connection_message(websocket, client_id)
        
        await self.recieveMessages(websocket)
