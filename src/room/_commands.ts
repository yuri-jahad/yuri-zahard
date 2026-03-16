import type { Command } from '../shared/types'

export const commands : Command[] = [
  {
    variants: ['c', 'search', 'recherche'],
    description: 'Recherche un mot dans le dictionnaire',
    execute (args, ctx) {
      ctx.roomSocket.socket.emit('sendChat', { message: args.join(' ') })
    }
  },
  {
    variants: ['join', 'viens'],
    description: 'Join game room',
    execute ([gameId, roomCode, userToken], context) {
      if (!gameId || !roomCode || !userToken) {
        console.warn('Usage: .join <gameId> <roomCode> <userToken>')
        return
      }
      context.gameSocket.join(gameId, roomCode, userToken)
    }
  }
]
