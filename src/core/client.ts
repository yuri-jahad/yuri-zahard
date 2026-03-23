// client.ts
import { RoomService } from '../room/service'
import { RoomSocket } from '../room/socket'
import { GameSocket } from '../game/socket'
import { Room } from '../room/model'
import type { RoomConfig } from '../room/type'
import { CommandLoader } from '../shared/command-loader'
import { Bot } from '../bot/model'

const ROOM_URL = 'https://jklm.fun/' as const
const DEFAULT_NICKNAME = 'YuriBot' as const

export class Client {
  private readonly roomService = new RoomService()
  private readonly commandLoader = new CommandLoader()

  async initialize (config: RoomConfig, bot: Bot): Promise<void> {
    const roomCode = await this.roomService.createRoom(config, bot)
    if (!roomCode) throw new Error('Failed to create room')

    const serverUrl = await this.roomService.getServerUrl(roomCode)
    if (!serverUrl)
      throw new Error(`Failed to get server URL for room: ${roomCode}`)

    console.log(`Room URL: ${ROOM_URL}${roomCode}`)

    await this.commandLoader.initialize()

    const socketCtx = this.createSockets(serverUrl)
    const room = new Room(socketCtx, this.commandLoader, config) // settings via config

    await this.joinRoom(config, roomCode, room, socketCtx)
  }

  private createSockets (serverUrl: string) {
    return {
      roomSocket: new RoomSocket(serverUrl),
      gameSocket: new GameSocket(serverUrl)
    }
  }

  private async joinRoom (
    config: RoomConfig,
    roomCode: string,
    room: Room,
    { roomSocket, gameSocket }: ReturnType<Client['createSockets']>
  ): Promise<void> {
    const nickname = config.nickname ?? DEFAULT_NICKNAME

    return new Promise((resolve, reject) => {
      roomSocket.join(roomCode, config.creatorUserToken, nickname, resp => {
        if (resp.errorCode) {
          reject(new Error(`Failed to join room: ${resp.errorCode}`))
          return
        }

        room.enableWelcome(nickname)

        const gameId = resp.roomEntry?.gameId ?? config.gameId
        gameSocket.join(gameId, roomCode, config.creatorUserToken)

        resolve()
      })
    })
  }
}
