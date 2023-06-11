from constants import *
import asyncio
import json
from game_components.bullet import Bullet
from game import Game

class MessageHandler:
    def __init__(self, game: Game):
        self.game = game
        self.sleep_time = 0.01
        self.last_adding_result = None
        self.last_bullet_update_result = None
    
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
        player = self.game.find_object_by_property("name", message["name"], "player")
        player.setBarrelParams(message['barrelPosition'], message['barrelAngle'])
        event = {
            "type": message_types[BARREL_MOVED],
            "barrelPosition": message['barrelPosition'],
            "barrelAngle": message['barrelAngle'],
            "name": message['name'],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(self.sleep_time)
        
    async def handle_shoot_message(self, connected_players, websocket, message):
        self.game.bullets_fired.append(Bullet(message['bulletPosition'], message['playerName'], message['bulletId']))

        if connected_players[message['clientId']] == websocket:
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
    
    async def handle_bullets_update_message(self, websocket, message, index):
        if index == 0:
            bullet_ids = []
            for bullet in message["updatedBullets"]:
                position = bullet['position']
                if position['x'] > self.game.width or position['x'] < 0 or position['y'] > self.game.height or position['y'] < 0:
                    bullet_ids.append(bullet['id'])
                b = self.game.find_object_by_property('id', bullet['id'], 'bullet')
                if b is not None:
                    b.position = position
                
            damaged_players, colided_bullets_ids = self.game.check_for_bullet_player_collision()
            for id in colided_bullets_ids:
                bullet_ids.append(id)
                
            self.game.bullets_fired = [bullet for bullet in self.game.bullets_fired if bullet.id not in bullet_ids]
            
            if len(bullet_ids) <= 0:
                self.last_bullet_update_result = None
            
            if len(damaged_players) <= 0:
                self.last_bullet_update_result = {
                    'bulletIds': bullet_ids,
                    'type': message_types[BULLET_COLLISION],
                    'wasCollision': False
                }
            
            else:   
                self.last_bullet_update_result = {
                    'damagedPlayers': damaged_players,
                    'bulletIds': bullet_ids,
                    'type': message_types[BULLET_COLLISION],
                    'wasCollision': True
                }
        print(self.last_bullet_update_result)
        if self.last_bullet_update_result == None:
            return
        await websocket.send(json.dumps(self.last_bullet_update_result))
        await asyncio.sleep(self.sleep_time)