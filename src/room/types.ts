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

export interface JoinRoomResponse {
  url: string
}


export interface ServerToClientEvents {
  chat: (author: string, message: string) => void
  playerJoined: (userId: string) => void

  setPlayerCount: (count: number) => void
  chatterAdded: (data: { nickname: string; [key: string]: unknown }) => void
  chatterRemoved: (data: { nickname: string; [key: string]: unknown }) => void
  setSelfRoles: (roles: string[]) => void
  userBanned: (data: { nickname: string; peerId: number }) => void
}

export interface ClientToServerEvents {
  joinRoom: (data: {
    roomCode: string
    userToken: string
    nickname: string
    language: string
    auth: null
    picture: null
  }, cb: (resp: any) => void) => void

  sendChat: (data: { message: string }) => void
}
