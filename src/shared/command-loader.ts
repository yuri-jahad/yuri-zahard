import type { Command, SocketsCtx } from './types'
import { join } from 'path'
import { readdir } from 'fs/promises'

export class CommandLoader {
  private readonly commands = new Map<string, Command>()

  async initialize (): Promise<void> {
    await this.readCommands()
    console.log(`Loaded ${this.commands.size} command variants`)
  }

  private async readCommands (): Promise<void> {
    const srcPath = join(import.meta.dir, '..')
    const files = await readdir(srcPath, { recursive: true })

    const commandFiles = files.filter(f => f.endsWith('_commands.ts'))

    const modules = await Promise.all(
      commandFiles.map(file => import(join(srcPath, file)))
    )

    for (const module of modules) {
      const commands: Command[] = module.commands ?? []
      commands.forEach(cmd =>
        cmd.variants.forEach(variant => {
          if (!this.commands.has(variant)) this.commands.set(variant, cmd)
        })
      )
    }
  }

  execute (rawMsg: string, ctx: SocketsCtx): void {
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

    cmd.execute(args, ctx)
  }
}
