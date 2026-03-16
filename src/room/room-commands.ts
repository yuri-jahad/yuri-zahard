// room/commands.ts
import { RoomSocket } from './socket'
import { GameSocket } from '../game/socket'

type Command = (args: string[]) => void

export class RoomCommands {
  private readonly commands = new Map<string, Command>()

  constructor(
    private readonly roomSocket: RoomSocket,
    private readonly gameSocket: GameSocket
  ) {
    this.register()
  }

  private register(): void {
    this.commands.set('chat', (args) => {
      this.roomSocket.socket.emit('sendChat', { message: args.join(' ') })
    })

    this.commands.set('join', ([gameId, roomCode, userToken]) => {
      if (!gameId || !roomCode || !userToken) {
        console.warn('Usage: .join <gameId> <roomCode> <userToken>')
        return
      }
      this.gameSocket.join(gameId, roomCode, userToken)
    })
  }

  execute(raw: string): void {
    if (!raw.startsWith('.') && !raw.startsWith('/')) return
    const [name, ...args] = raw.slice(1).split(' ')
    const cmd = this.commands.get(name)
    if (!cmd) {
      console.warn(`Unknown command: ${name}`)
      return
    }
    cmd(args)
  }
}
