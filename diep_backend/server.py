import json
import asyncio
from constants import *
import websockets
from game import Game

class Server:
    def __init__(self):
        self.connected_players = set()
        self.game = Game()


    async def send_collision_message(self, websocket, message):
        event = {
            "type": message_types[COLLISION],
            "object": message['object'],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)

    async def send_error_message(self, websocket, message):
        event = {
            "type": message_types[ERROR],
            "message": message['content']
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)

    async def send_play_message(self, websocket, message: dict):
        pos = self.game.get_player_position(message["name"])
        if message["direction"]=="ArrowRight":
            pos['x']+=10
        if message["direction"]=="ArrowLeft":
            pos['x']-=10
        if message["direction"]=="ArrowUp":
            pos['y']-=10
        if message["direction"]=="ArrowDown":
            pos['y']+=10
        self.game.update_player_position(message["name"],pos)
        self.game.check_for_collisions(message["name"])
        event={"type": message_types[MOVE],
               "position": self.game.get_player_position(message["name"])
               #"players": self.game.players,
               #"obstacles": self.game.obstacles
               }
        await websocket.send(json.dumps(event))

    async def send_create_message(self, websocket, message):
        event = self.game.add_player(message["name"])
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)

    async def handle_join_message(self, websocket, message: dict):
        event = {
            "type": message_types[JOIN],
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)

    async def send_message(self, websocket, message_type, message):
        if message_type == message_types[MOVE]:
            await self.send_play_message(websocket, message)

        elif message_type == message_types[COLLISION]:
            await self.send_collision_message(websocket, message)

        elif message_type == message_types[ERROR]:
            await self.send_error_message(websocket, message)

        elif message_type == message_types[JOIN]:
            print("Handling join message")
            await self.send_create_message(websocket, message)

        else: print(f"No such message type {message_type}")

    async def handle_recieved_message(self, websocket, message):
        msg = json.loads(message)
        try:
            await self.send_message(websocket, msg["type"], msg)

        except Exception as err:
            await self.send_message(websocket, message_types[ERROR], {
                "content": f"there was an error {str(err)}"
            })

    async def recieveMessages(self, websocket):
        try:
            async for message in websocket:
                print(message)
                for player in self.connected_players:
                    await self.handle_recieved_message(player, message)

        except websockets.exceptions.ConnectionClosed as e:
            print("A client just disconnected")

        finally:
            self.connected_players.remove(websocket)

    async def handler(self, websocket):
        print(f"New client connected {websocket}")
        self.connected_players.add(websocket)
        await self.recieveMessages(websocket)


