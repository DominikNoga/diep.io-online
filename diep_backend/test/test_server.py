from constants import PORT_NUMBER
import websockets
import asyncio

URL = ''

class ServerTest():
    def __init__(self):
        print(f"Server started on port {PORT_NUMBER}")
        
    
    async def handler():
        print(f"Server started on port {PORT_NUMBER}")
        
    async def echo(websocket, path):
        print(f"A client connected")
        