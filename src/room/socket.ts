// room/socket.ts
import { EventEmitter } from 'events'
import { io, Socket } from 'socket.io-client'
import { HEADERS } from '../shared/constants'
import type { ServerToClientEvents, ClientToServerEvents } from './type'

export class RoomSocket extends EventEmitter {
  readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor(serverUrl: string) {
    super()
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      extraHeaders: HEADERS
    })

    this.socket.on('connect_error', (err) =>
      console.error('Room socket connection error:', err)
    )
    this.socket.on('disconnect', (reason) =>
      console.log('Room socket disconnected:', reason)
    )

    this.socket.onAny((event, ...args) =>
      console.log('ROOM IN:', event, ...args)
    )
    this.socket.onAnyOutgoing((event, ...args) =>
      console.log('ROOM OUT:', event, ...args)
    )

    const events: (keyof ServerToClientEvents)[] = [
      'chat',
      'playerJoined',
      'setPlayerCount',
      'chatterAdded',
      'chatterRemoved',
      'setSelfRoles',
      'userBanned'
    ]

    events.forEach((event) => {
      this.socket.on(event, (...args: any[]) => this.emit(event, ...args))
    })
  }

  join(roomCode: string, userToken: string, nickname: string, onJoined: (resp: any) => void) {
    this.socket.once('connect', () => {
      this.socket.emit(
        'joinRoom',
        {
          roomCode: roomCode.toUpperCase(),
          userToken,
          nickname,
          language: 'fr-FR',
          auth: null,
          picture: null
        },
        onJoined
      )
    })
  }

  sendChat(message: string, style?: Record<string, string>): void {
    this.socket.emit('chat', message, style ?? null)
  }

  disconnect(): void {
    this.socket.disconnect()
  }
}
