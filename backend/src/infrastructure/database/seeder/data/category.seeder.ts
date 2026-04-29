import { BaseSeeder } from "../base.seeder"
import { PrismaClient } from "../../generated/prisma"

export class CategorySeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async run(): Promise<void> {
    await this.truncate('Category')

    const categories = [
      { name: 'Technology' },
      { name: 'Politics' },
      { name: 'Sports' },
      { name: 'Health' },
      { name: 'Business' },
      { name: 'Entertainment' },
      { name: 'Science' },
      { name: 'Education' },
    ]

    await this.prisma.category.createMany({ data: categories })
    this.log(`Seeded ${categories.length} categories`)
  }
}