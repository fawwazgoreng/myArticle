import { PrismaClient } from '@infra/database/generated/prisma'
import * as  Prisma from '@infra/database/prisma/prisma';

export abstract class BaseSeeder {
  constructor(protected prisma: PrismaClient = Prisma.default) {}

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