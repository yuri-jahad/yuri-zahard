import type { Command } from '../shared/types'

const BOT_STYLE = { color: '#a855f7' }

export const commands: Command[] = [
  {
    variants: ['c', 'search', 'recherche'],
    description: 'Recherche un mot dans le dictionnaire',
    execute(args, ctx) {
      const word = args.join(' ')
      if (!word) return
      ctx.roomSocket.sendChat(word, BOT_STYLE)
    }
  },
  {
    variants: ['viens'],
    description: 'Fait rejoindre le bot dans la partie en cours',
    execute(_args, ctx) {
      ctx.gameSocket.joinRound()
      ctx.roomSocket.sendChat('Je suis là !', BOT_STYLE)
    }
  },
  {
    variants: ['stop'],
    description: 'Retire le bot de la partie (reste dans le salon)',
    execute(_args, ctx) {
      ctx.gameSocket.disconnect()
      ctx.roomSocket.sendChat('Je quitte la partie !', BOT_STYLE)
    }
  }
]
