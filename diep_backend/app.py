import asyncio
from server import Server
import websockets
from constants import PORT_NUMBER

async def main():
    server = Server()
    async with websockets.serve(server.handler, "", PORT_NUMBER):
        print(f"server started on port {PORT_NUMBER}")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
    