import { BaseSeeder } from "../base.seeder"
import { PrismaClient } from "../../generated/prisma"

export class ArticleSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async run(): Promise<void> {
    await this.truncate('Article')

    const editors = await this.prisma.user.findMany({
      where: { roles: { in: ['admin', 'editor'] } }
    })

    if (editors.length === 0) throw new Error('No editors found, run UserSeeder first')

    const articles = [
      {
        title: 'The Future of Artificial Intelligence',
        content: 'Artificial intelligence is rapidly transforming industries across the globe. From healthcare diagnostics to autonomous vehicles, AI systems are becoming increasingly sophisticated and integrated into our daily lives.',
        image: 'https://placeholder.com/ai-future.jpg',
        author_id: editors[0].id,
        base_views: 1200,
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15'),
      },
      {
        title: 'Global Economy Outlook 2024',
        content: 'The global economy faces unprecedented challenges as inflation, geopolitical tensions, and supply chain disruptions continue to shape markets worldwide. Analysts predict a cautious but steady recovery.',
        image: 'https://placeholder.com/economy.jpg',
        author_id: editors[1]?.id ?? editors[0].id,
        base_views: 850,
        created_at: new Date('2024-02-10'),
        updated_at: new Date('2024-02-10'),
      },
      {
        title: 'Revolutionary Advances in Medical Science',
        content: 'Scientists have made groundbreaking discoveries in gene therapy and personalized medicine. These advances promise to revolutionize treatment for previously incurable diseases.',
        image: 'https://placeholder.com/medical.jpg',
        author_id: editors[0].id,
        base_views: 2300,
        created_at: new Date('2024-03-05'),
        updated_at: new Date('2024-03-05'),
      },
      {
        title: 'Climate Change: Actions and Solutions',
        content: 'World leaders gathered to discuss urgent climate action. New renewable energy initiatives and carbon reduction targets have been announced as nations race against environmental tipping points.',
        image: null,
        author_id: editors[1]?.id ?? editors[0].id,
        base_views: 670,
        created_at: new Date('2024-03-20'),
        updated_at: new Date('2024-03-20'),
      },
      {
        title: 'The Rise of Electric Vehicles',
        content: 'Electric vehicle adoption is accelerating globally with major automakers committing to fully electric lineups by 2030. Infrastructure investment and battery technology improvements are key drivers.',
        image: 'https://placeholder.com/ev.jpg',
        author_id: editors[0].id,
        base_views: 980,
        created_at: new Date('2024-04-01'),
        updated_at: new Date('2024-04-01'),
      },
    ]

    await this.prisma.article.createMany({ data: articles })
    this.log(`Seeded ${articles.length} articles`)
  }
}