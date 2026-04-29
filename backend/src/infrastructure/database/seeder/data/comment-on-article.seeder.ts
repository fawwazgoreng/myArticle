import { BaseSeeder } from "@infra/database/seeder/base.seeder";
import { PrismaClient } from "@infra/database/generated/prisma";

export class CommentOnArticleSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async run(): Promise<void> {
    await this.truncate('CommentOnArticle')

    const articles = await this.prisma.article.findMany()
    const comments = await this.prisma.comment.findMany()

    if (articles.length === 0) throw new Error('Run ArticleSeeder first')
    if (comments.length === 0) throw new Error('Run CommentSeeder first')

    const relations = [
      { article_id: articles[0].id, comment_id: comments[0].id },
      { article_id: articles[0].id, comment_id: comments[1].id },
      { article_id: articles[1].id, comment_id: comments[2].id },
      { article_id: articles[2].id, comment_id: comments[3].id },
      { article_id: articles[2].id, comment_id: comments[4].id },
      { article_id: articles[3].id, comment_id: comments[5].id },
    ]

    await this.prisma.commentOnArticle.createMany({ data: relations })
    this.log(`Seeded ${relations.length} comment-article relations`)
  }
}