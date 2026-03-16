  import { RoomService } from '../room/services'
  import { RoomSocket } from '../room/socket'
  import { GameSocket } from '../game/socket'
  import type { RoomConfig } from '../room/types'
  import { RoomCommands } from '../room/room-commands'

  const ROOM_URL = 'https://jklm.fun/'

  export class Client {
    private readonly roomService = new RoomService()

    async initialize (config: RoomConfig): Promise<void> {
      const roomCode = 'AEET'
      await this.roomService.createRoom(config)
      if (!roomCode) return

      const serverUrl = await this.roomService.getServerUrl(roomCode)
      if (!serverUrl) return

      console.log(ROOM_URL + roomCode)

      const roomSocket = new RoomSocket(serverUrl)
      const gameSocket = new GameSocket(serverUrl)

      roomSocket.join(roomCode, config.creatorUserToken, resp => {
        if (resp.errorCode) return

        console.log('joinRoom resp complète :', JSON.stringify(resp))
        const selfPeerId = resp.selfPeerId
        const gameId = resp.roomEntry?.gameId ?? config.gameId

        console.log('selfPeerId:', selfPeerId, 'gameId:', gameId)

        gameSocket.join(gameId, roomCode, config.creatorUserToken)
        new RoomCommands(roomSocket, gameSocket)
      })
    }
  }
