import json
import asyncio
import secrets
from connect4 import Connect4
from constants import *

class Server:
    def __init__(self):
        self.connect4 = Connect4()
        self.JOIN = {}
    
    
    async def send_win_message(self, websocket, message):
        event = {
            "type": message_types[WIN],
            "player": message['player']
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
        """Method used to send a message about player move

        Args:
            websocket (_type_): Object of a websocket
            message (Dict: with keys row, column, player): Dictionary serialized to JSON containing type of event, row and column where player put his pawn and a player itself
        """
        event = {
            "type": message_types[PLAY],
            "row": message["row"],
            "player": message["player"],
            "column": message["column"]
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)
        
    async def send_init_message(self, websocket, message: dict):
        event = {
            "type": message_types[INIT],
            "join": message["join_key"]
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)
    
    async def send_message(self, websocket, message_type, message):
        if message_type == message_types[PLAY]:
            await self.send_play_message(websocket, message)
            
        elif message_type == message_types[WIN]:
            await self.send_win_message(websocket, message)
            
        elif message_type == message_types[ERROR]:
            await self.send_error_message(websocket, message)
        
        elif message_type == message_types[INIT]:
            await self.send_init_message(websocket, message)
        
        else: print(f"No such message type {message_type}")
        
    async def handle_recieved_message(self, websocket, message):
        move = json.loads(message)
        if move["type"] == message_types[PLAY]:
            try:
                row, winner = self.connect4.play(self.connect4.current_player, move["column"])
                
                await self.send_message(websocket, message_types[PLAY], {
                    "player": self.connect4.current_player,
                    "column": move["column"],
                    "row": row
                }) 
                if winner is not False:
                    await self.send_message(websocket, message_types[WIN] ,{
                        "player": self.connect4.current_player
                    })
                    self.connect4.__init__()
                
                
            except RuntimeError as err:
                await self.send_message(websocket, message_types[ERROR], {
                    "content": str(err)
                })
            
            except Exception as err:
                await self.send_message(websocket, message_types[ERROR], {
                    "content": str(err)
                })        

    async def recieveMessages(self, websocket):
        async for message in websocket:
            await self.handle_recieved_message(websocket, message)
            
    async def handler(self, websocket):
        game = Connect4()
        conncected = {websocket}
        
        join_key = secrets.token_urlsafe(12)
        self.JOIN[join_key] = game, conncected
        try:
            await self.recieveMessages(websocket)

        finally:
            del self.JOIN[join_key]
            
        join_key = None
        game, connected = self.JOIN[join_key]

        # Register to receive moves from this game.
        connected.add(websocket)
        try:
            self.recieveMessages(websocket)

        finally:
            connected.remove(websocket)
            
