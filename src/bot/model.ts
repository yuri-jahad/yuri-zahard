import { makeToken } from '../shared/utils'

export class Bot {
  public readonly token: string = makeToken()
  constructor (
    public readonly nickname: string,
    public readonly picture: string
  ) {}
}
