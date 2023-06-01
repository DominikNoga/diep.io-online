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
    
    async def handle_sending_message(self, websocket, message_type, message):
        if message_type == message_types[PLAY]:
            await self.send_play_message(websocket, message)
            
        elif message_type == message_types[WIN]:
            await self.send_win_message(websocket, message)
            
        elif message_type == message_types[ERROR]:
            await self.send_error_message(websocket, message)
        
        else: print(f"No such message type {message_type}")
        
    
    async def handle_recieved_message(self, websocket, message):
        move = json.loads(message)
        if move["type"] == message_types[PLAY]:
            try:
                row, winner = self.connect4.play(self.connect4.current_player, move["column"])
                
                await self.send_play_message(websocket, {
                    "player": self.connect4.current_player,
                    "column": move["column"],
                    "row": row
                }) 
                if winner is not False:
                    await self.send_win_message(websocket, {
                        "player": self.connect4.current_player
                    })
                    self.connect4.__init__()
                
                
            except RuntimeError as err:
                await self.handle_sending_message(websocket, message_types[ERROR], {
                    "content": str(err)
                })
            
            except Exception as err:
                await self.handle_sending_message(websocket, message_types[ERROR], {
                    "content": str(err)
                })
            
        # else:
        #     print(f"Unknown message type: {move['type']}")
        

    async def recieveMessages(self, websocket):
        async for message in websocket:
            await self.handle_recieved_message(websocket, message)


    async def handler(self, websocket):
        await self.recieveMessages(websocket)

async def main():
    server = Server()
    async with websockets.serve(server.handler, "", PORT_NUMBER):
        print(f"server started on port {PORT_NUMBER}")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
    