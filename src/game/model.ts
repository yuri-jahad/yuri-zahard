// game/game.ts
import { GameSocket } from './socket'

export class Game {
  constructor(private readonly gameSocket: GameSocket) {
    this.gameSocket.on('nextTurn', (peerId: number, syllable: string) => {
      console.log(`Next turn: peer ${peerId}, syllable: "${syllable}"`)
    })

    this.gameSocket.on('correctWord', (data: { playerPeerId: number }) => {
      console.log(`Correct word! Peer ${data.playerPeerId}`)
    })

    this.gameSocket.on('failWord', (peerId: number, reason: string) => {
      console.log(`Failed word: peer ${peerId}, reason: ${reason}`)
    })

    this.gameSocket.on('livesLost', (peerId: number, lives: number) => {
      console.log(`Lives lost: peer ${peerId} now has ${lives} lives`)
    })
  }
}
