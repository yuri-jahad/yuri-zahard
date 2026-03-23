// shared/command-loader.ts
import type { Command } from './types'
import { join } from 'path'
import { readdir } from 'fs/promises'

export class CommandLoader {
  private readonly commands = new Map<string, Command>()

  async initialize(): Promise<void> {
    await this.readCommands()
    console.log(`Loaded ${this.commands.size} command variants`)
  }

  getCommands(): ReadonlyMap<string, Command> {
    return this.commands
  }

  private async readCommands(): Promise<void> {
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
}
