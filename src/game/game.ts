// game/game.ts
import { GameSocket } from './socket'

export class Game {
  constructor(private gameSocket: GameSocket) {
    this.gameSocket.on('gameStarted', (data) => {
      console.log('🎮 Game démarrée :', data.gameId)
    })

    this.gameSocket.on('questionAsked', (data) => {
      console.log('❓', data.question, data.answers)
    })

    this.gameSocket.on('scores', (data) => {
      console.log('🏆 Scores :', data.scores)
    })
  }
}
