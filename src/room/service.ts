import { makeToken } from '../shared/utils'
import type { CreateRoomResponse, RoomConfig } from './types'

const startRoomURL = 'https://jklm.fun/api/startRoom'
const joinRoomURL = 'https://jklm.fun/api/joinRoom'

class RoomService {
  private HEADERS = {
    'Content-Type': 'application/json',
    Origin: 'https://jklm.fun',
    Referer: 'https://jklm.fun/'
  }

  createRoom = async (roomInfos: RoomConfig): Promise<string | undefined> => {
    try {
      const response = await fetch(startRoomURL, {
        method: 'POST',
        headers: this.HEADERS,
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

  joinRoom = async (roomCode: string) => {
    try {
      const response = await fetch(joinRoomURL, {
        headers: this.HEADERS,
        method: 'POST',
        body: JSON.stringify({roomCode})
      })

      if (!response.ok) return; 

      console.log(await response.json())
    } catch (error) {}
  }
}

const config: RoomConfig = {
  name: 'test',
  gameId: 'bombparty',
  isPublic: false,
  creatorUserToken: makeToken()
}

console.log(new RoomService().createRoom(config))
