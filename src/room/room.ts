// room/room.ts
import { GameSocket } from '../game/socket'
import { RoomSocket } from './socket'

export class Room {
  constructor(
    private gameSocket: GameSocket,
    private roomSocket: RoomSocket
  ) {
    this.roomSocket.socket.on('chat', (author, message) => {
      console.log(author, message)
    })
  }
}
