import { PrismaClient } from '@infra/database/generated/prisma'

export abstract class BaseSeeder {
  constructor(protected prisma: PrismaClient) {}

  abstract run(): Promise<void>

  protected log(message: string) {
    console.log(`[${this.constructor.name}] ${message}`)
  }

  protected async truncate(...tables: string[]) {
    for (const table of tables) {
      await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`)
      this.log(`Truncated "${table}"`)
    }
  }
}