import { Client } from "./core/client";
import { makeToken } from "./shared/utils";
import type { RoomConfig } from './room/types';

const config: RoomConfig = {
  name: 'test',
  gameId: 'bombparty',
  isPublic: false,
  creatorUserToken: makeToken()
}

console.log(config)

console.log(await new Client().initialize(config))

// const socket = new WebSocket("")


