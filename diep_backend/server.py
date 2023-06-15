import json
from constants import *
import websockets
from game import Game
import uuid
import traceback
from message_handler import MessageHandler


class Server:
    """WebSocket server for the game.

    Attributes:
        connected_players (dict): A dictionary mapping WebSocket connections to player IDs.
        game (Game): The game instance.
        message_handler (MessageHandler): The message handler instance.
        first_shooting_client: The WebSocket connection of the first client who shoots.
    """
    def __init__(self):
        """Initialize the WebSocket server."""
        self.connected_players = {}
        self.game = Game()
        self.message_handler = MessageHandler(self.game)
        self.first_shooting_client = None
    
    async def handle_recieved_message(self, websocket, player_id, message, index):
        """Handles the received message based on its type.

        Args:
            websocket: The WebSocket connection.
            player_id (str): The ID of the player who sent the message.
            message (str): The received message.
            index (int): The index of the player in the connected players list.
        """
        message = json.loads(message)
        
        message_type = message['type']
        try:
            if message_type == message_types[MOVE]:
                await self.message_handler.handle_move_message(websocket, message, self.connected_players)

            elif message_type == message_types[JOIN]:
                await self.message_handler.handle_join_message(websocket, player_id, message, index)

            elif message_type == message_types[SHOOT]:
                await self.message_handler.handle_shoot_message(self.connected_players ,websocket, message)

            elif message_type == message_types[BULLETS_UPDATE]:
                if index == 0:
                    await self.message_handler.handle_bullets_update_message(self.connected_players, message)

            else: print(f"No such message type {message_type}")

        except Exception as err:
            traceback_info = traceback.format_exc()
            print(traceback_info)
            await self.message_handler.send_error_message(websocket, {
                "content": f"there was an error {str(err)}"
            })



    async def recieveMessages(self, websocket):
        """Receives messages from a WebSocket connection and handles them.

        Args:
            websocket: The WebSocket connection.
        """
        for player in  self.game.players_to_remove:
            self.game.players.remove(player)
            self.game.players_to_remove.remove(player)
        try:
            async for message in websocket:
                for index, (player_socket, player_id) in enumerate(self.connected_players.items()):
                    await self.handle_recieved_message(player_socket, player_id, message, index)

        except websockets.exceptions.ConnectionClosed as e:
            print("A client just disconnected")

        finally:
            for player_id, player_socket in self.connected_players.items():
                if player_socket == websocket:
                    del self.connected_players[player_id]
                    break

    async def handler(self, websocket):
        """Handles a new WebSocket connection.

        Args:
            websocket: The WebSocket connection.
        """
        print(f"New client connected {websocket}")
        client_id = str(uuid.uuid4())
        self.connected_players[websocket] = client_id

        await self.message_handler.send_init_connection_message(websocket, client_id)
        await self.recieveMessages(websocket)
