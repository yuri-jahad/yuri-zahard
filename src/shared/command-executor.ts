// shared/command-executor.ts
import type { Command, SocketsCtx } from './types'

export class CommandExecutor {
  constructor(private readonly commands: ReadonlyMap<string, Command>) {}

  execute(rawMsg: string, ctx: SocketsCtx): void {
    const symbols = ['.', '/']
    const messages = rawMsg.toLowerCase().split(' ')
    const [firstCmd, ...args] = messages
    if (!firstCmd || !symbols.includes(firstCmd[0]!)) return

    const cmdName = firstCmd.slice(1)
    const cmd = this.commands.get(cmdName)
    if (!cmd) {
      console.warn(`Unknown command: ${cmdName}`)
      return
    }

    try {
      cmd.execute(args, ctx)
    } catch (err) {
      console.error(`Error executing command '${cmdName}':`, err)
    }
  }
}
