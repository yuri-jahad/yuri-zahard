export interface ServerToClientEvents {
  setup: (data: SetupData) => void
  setStartTime: (serverNow: number, startTime: number) => void
  clearUsedWords: () => void
  setMilestone: (milestone: MilestoneData, timestamp: number) => void
  nextTurn: (peerId: number, syllable: string, promptAge: number) => void
  setPlayerWord: (peerId: number, word: string) => void
  correctWord: (data: CorrectWordData) => void
  failWord: (peerId: number, reason: FailReason) => void
  livesLost: (peerId: number, lives: number) => void
  setRulesLocked: (locked: boolean) => void
  addPlayer: (data: PlayerData) => void
}

export interface ClientToServerEvents {
  joinGame: (gameId: string, roomCode: string, userToken: string) => void
  joinRound: () => void
  setWord: (word: string) => void
}

export type FailReason = 'mustContainSyllable' | 'notAWord' | 'alreadyUsed'

export interface SetupData {
  serverNow: number
  rules: Record<string, any>
}

export interface MilestoneData {
  name: string
  startTime: number
  currentPlayerPeerId: number
  dictionaryManifest: DictionaryManifest
  syllable: string
  promptAge: number
  usedWordCount: number
  playerStatesByPeerId: Record<string, PlayerState>
}

export interface DictionaryManifest {
  name: string
  bonusAlphabet: Record<string, number>
  promptDifficulties: Record<string, number>
}

export interface PlayerState {
  lives: number
  word: string
  wasWordValidated: boolean
  bonusLetters: Record<string, number>
}

export interface CorrectWordData {
  playerPeerId: number
  bonusLetters: Record<string, number>
}

export interface PlayerData {
  peerId: number
  [key: string]: any
}
