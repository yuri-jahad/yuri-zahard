
import { HEADERS } from '../shared/constants'
import type { CreateRoomResponse, RoomConfig, JoinRoomResponse } from './types'

const startRoomURL = 'https://jklm.fun/api/startRoom'
const joinRoomURL = 'https://jklm.fun/api/joinRoom'

export class RoomService {

  createRoom = async (roomInfos: RoomConfig): Promise<string | undefined> => {
    try {
      const response = await fetch(startRoomURL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          name: roomInfos.name,
          isPublic: roomInfos.isPublic,
          gameId: roomInfos.gameId,
          creatorUserToken: roomInfos.creatorUserToken
        })
      })

      if (!response.ok) return
      const roomData = (await response.json()) as CreateRoomResponse
      return roomData.roomCode
    } catch (error) {
      console.error(error)
    }
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
      console.log('joinRoom full response:', JSON.stringify(data))
      return data.url
    } catch (error) {}
  }
}
