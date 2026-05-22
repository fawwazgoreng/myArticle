import { BaseSeeder } from "@infra/database/seeder/base.seeder";
import { faker } from "@faker-js/faker";

export class CommentSeeder extends BaseSeeder {
    async run(): Promise<void> {
        await this.truncate("Comment");

        const users = await this.prisma.user.findMany();
        const article = await this.prisma.article.findMany();
        if (users.length === 0)
            throw new Error("No users found, run UserSeeder first");

        const comments = [
        ];
        
        for (let i = 0; i < 10; i++) {
            comments.push({
                user_id: users[Math.floor(Math.random() * users.length)].id,
                content: faker.lorem.paragraph(),
                article_id: article[i].id,
            })
        }

        await this.prisma.comment.createMany({ data: comments });
        this.log(`Seeded ${comments.length} comments`);
    }
}
