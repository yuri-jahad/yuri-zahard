// room/socket.ts
import { EventEmitter } from 'events'
import { io, Socket } from 'socket.io-client'
import { HEADERS } from '../shared/constants'
import type { ServerToClientEvents, ClientToServerEvents } from './types'

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
      console.log('ROOM:', event, ...args)
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

  join(roomCode: string, userToken: string, onJoined: (resp: any) => void) {
    this.socket.once('connect', () => {
      this.socket.emit(
        'joinRoom',
        {
          roomCode: roomCode.toUpperCase(),
          userToken,
          nickname: 'BotTest',
          language: 'fr-FR',
          auth: null,
          picture: null
        },
        onJoined
      )
    })
  }
}
