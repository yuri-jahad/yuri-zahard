import type { GameSocket } from '../game/socket'
import type { RoomSocket } from '../room/socket'

export interface Command {
  variants: string[]
  description: string
  execute: (args: string[], ctx: SocketsCtx) => void
}

export interface SocketsCtx {
  gameSocket: GameSocket
  roomSocket: RoomSocket
}
