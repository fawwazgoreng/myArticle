import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class CategoryOnArticleSeeder extends BaseSeeder {
  async run(): Promise<void> {
    await this.truncate('CategoryOnArticle')

    const articles = await this.prisma.article.findMany()
    const categories = await this.prisma.category.findMany()

    if (articles.length === 0) throw new Error('Run ArticleSeeder first')
    if (categories.length === 0) throw new Error('Run CategorySeeder first')

    const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]))

    const relations = [
      { article_id: articles[0].id, category_id: catMap['Technology'] },
      { article_id: articles[0].id, category_id: catMap['Science'] },
      { article_id: articles[1].id, category_id: catMap['Business'] },
      { article_id: articles[1].id, category_id: catMap['Politics'] },
      { article_id: articles[2].id, category_id: catMap['Health'] },
      { article_id: articles[2].id, category_id: catMap['Science'] },
      { article_id: articles[3].id, category_id: catMap['Politics'] },
      { article_id: articles[4].id, category_id: catMap['Technology'] },
      { article_id: articles[4].id, category_id: catMap['Business'] },
    ]

    await this.prisma.categoryOnArticle.createMany({ data: relations })
    this.log(`Seeded ${relations.length} category-article relations`)
  }
}