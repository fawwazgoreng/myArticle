import { BaseSeeder } from "@infra/database/seeder/base.seeder";
import { faker } from "@faker-js/faker";

export class ArticleSeeder extends BaseSeeder {
    async run(): Promise<void> {
        await this.truncate("Article");

        const editors = await this.prisma.user.findMany({
            where: { roles: { in: ["admin", "writer"] } },
        });

        if (editors.length === 0)
            throw new Error("No editors found, run User Seeder first");

        
        const articles: any = [];
        
        for (let i = 0; i < 10; i++) {
            articles.push({
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraph(),
                    image: faker.image.avatar(),
                    author_id: editors[Math.floor(Math.random() * editors.length)].id,
                    base_views: 980,
                    created_at: new Date("2024-04-01"),
                    updated_at: new Date("2024-04-01"),
            })
        }

        await this.prisma.article.createMany({ data: articles });
        this.log(`Seeded ${articles.length} articles`);
    }
}
