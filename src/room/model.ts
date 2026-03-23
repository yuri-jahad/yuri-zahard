// room/room.ts
import { CommandExecutor } from '../shared/command-executor'
import { CommandLoader } from '../shared/command-loader'
import type { SocketsCtx } from '../shared/types'
import type { RoomSettings } from './type'

export class Room {
  private readonly commandExecutor: CommandExecutor
  public readonly settings: RoomSettings

  constructor(
    private readonly socketCtx: SocketsCtx,
    commandLoader: CommandLoader,
    settings: Partial<RoomSettings> = {}
  ) {
    this.settings = {
      roomName: '',
      langue: 'fr-FR',
      gameId: 'bombparty',
      isPublic: false,
      ...settings
    }

    this.commandExecutor = new CommandExecutor(commandLoader.getCommands())

    this.socketCtx.roomSocket.socket.on('chat', (author, message) => {
      this.commandExecutor.execute(message, this.socketCtx)
    })
  }

  enableWelcome(selfNickname: string): void {
    this.socketCtx.roomSocket.socket.on('chatterAdded', ({ nickname }) => {
      if (nickname === selfNickname) return
      this.socketCtx.roomSocket.sendChat(`Bienvenue ${nickname} !`, { color: '#a855f7' })
    })
  }
}

