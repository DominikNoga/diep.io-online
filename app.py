import asyncio
import websockets
import json

from connect4 import PLAYER1, PLAYER2, Connect4
from constants import PORT_NUMBER, message_types, WIN, ERROR, PLAY

class Server:
    def __init__(self):
        self.connect4 = Connect4()
    
    
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
            "message": message['error']
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)
    
    async def send_play_message(self, websocket, message):
        event = {
            "type": message_types[PLAY],
            "row": message["row"],
            "player": message["player"],
            "column": message["column"]
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(0.5)
    
    async def handle_sending_message(self, websocket, message_type, message):
        if message_type == message_types[PLAY]:
            await self.send_play_message(websocket, message)
            
        elif message_type == message_types[WIN]:
            await self.send_win_message(websocket, message)
            
        elif message_type == message_types[ERROR]:
            await self.send_error_message(websocket, message)
        
        else: print(f"No such message type {message_type}")
        

    async def handle_recieved_message(self, websocket, message):
        move = json.load(message)
        if move["type"] == 'play':
            try:
                self.connect4.play(self.connect4.current_player(), move['column'])
            except RuntimeError as err:
                await self.handle_sending_message()
            
            except Exception as err:
                print(f"Unknown error: {err}")
            
        else:
            print(f"Unknown message type: {move['type']}")
        

    async def recieveMessages(self, websocket):
        async for message in websocket:
            self.handle_message(message)


    async def handler(self, websocket):
        for player, column, row in [
            (PLAYER1, 3, 0),
            (PLAYER2, 3, 1),
            (PLAYER1, 4, 0),
            (PLAYER2, 4, 1),
            (PLAYER1, 2, 0),
            (PLAYER2, 1, 0),
            (PLAYER1, 5, 0),
        ]:
            event = {
                "type": "play",
                "player": player,
                "column": column,
                "row": row,
            }
            await websocket.send(json.dumps(event))
            await asyncio.sleep(0.5)
        event = {
            "type": "win",
            "player": PLAYER1,
        }
        await websocket.send(json.dumps(event))

async def main():
    server = Server()
    async with websockets.serve(server.handler, "", PORT_NUMBER):
        print(f"server started on port {PORT_NUMBER}")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
    