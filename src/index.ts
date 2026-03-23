import { Client } from './core/client'
import { makeToken } from './shared/utils'
import { Bot } from './bot/model';
import type { RoomConfig } from './room/type';

const config: RoomConfig = {
  name: 'Yuri Bot',
  gameId: 'bombparty',
  isPublic: false,
  creatorUserToken: makeToken(),
  nickname: 'YuriBot'
}

await new Client().initialize(config, new Bot(config.nickname || "missing.no", ''))
