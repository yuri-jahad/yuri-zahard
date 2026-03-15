export interface RoomConfig {
  name: string
  isPublic: boolean
  gameId: 'bombparty'
  creatorUserToken: string
}

export interface CreateRoomResponse {
  url: string
  roomCode: string
}
