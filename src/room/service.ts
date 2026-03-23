import type { Bot } from '../bot/model'
import { HEADERS } from '../shared/constants'
import type { Room } from './model'
import type { CreateRoomResponse, RoomConfig, JoinRoomResponse } from './type'

const startRoomURL = 'https://jklm.fun/api/startRoom'
const joinRoomURL = 'https://jklm.fun/api/joinRoom'

export class RoomService {
  createRoom = async (
    config: RoomConfig,
    bot: Bot
  ): Promise<string | undefined> => {
    const response = await fetch(startRoomURL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        name: config.name,
        isPublic: config.isPublic,
        gameId: config.gameId,
        creatorUserToken: bot.token
      })
    })

    if (!response.ok) return
    const roomData = (await response.json()) as CreateRoomResponse
    return roomData.roomCode
  }

  getServerUrl = async (roomCode: string): Promise<string | undefined> => {
    try {
      const response = await fetch(joinRoomURL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ roomCode })
      })

      if (!response.ok) return

      const data = (await response.json()) as JoinRoomResponse
      return data.url
    } catch (error) {
      console.error('Failed to get server URL:', error)
    }
  }
}
