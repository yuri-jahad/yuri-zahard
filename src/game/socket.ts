// game/socket.ts
import { EventEmitter } from 'events'
import { io, Socket } from 'socket.io-client'
import { HEADERS } from '../shared/constants'
import type { ServerToClientEvents, ClientToServerEvents } from './types'

export class GameSocket extends EventEmitter {
  readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor(serverUrl: string) {
    super()
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      extraHeaders: HEADERS
    })

    this.socket.on('connect', () =>
      console.log('Game socket connected:', this.socket.id)
    )
    this.socket.on('connect_error', err =>
      console.error('Game socket connection error:', err)
    )
    this.socket.on('disconnect', reason =>
      console.log('Game socket disconnected:', reason)
    )
    this.socket.onAny((event, ...args) => {
      console.log(`[GAME][${event}]`, JSON.stringify(args).slice(0, 300))
    })

    const events: (keyof ServerToClientEvents)[] = [
      'setup', 'setStartTime', 'clearUsedWords', 'setMilestone',
      'nextTurn', 'setPlayerWord', 'correctWord', 'failWord',
      'livesLost', 'setRulesLocked', 'addPlayer'
    ]

    events.forEach(event => {
      this.socket.on(event, (...args: any[]) => this.emit(event, ...args))
    })

    this.socket.on('setup', () => this.socket.emit('joinRound'))
  }

  join(gameId: string, roomCode: string, userToken: string): void {
    const doJoin = () =>
      this.socket.emit('joinGame', gameId, roomCode.toUpperCase(), userToken)

    if (this.socket.connected) {
      doJoin()
    } else {
      this.socket.once('connect', doJoin)
    }
  }
}
