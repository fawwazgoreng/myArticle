import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class CommentSeeder extends BaseSeeder {
    async run(): Promise<void> {
        await this.truncate("Comment");

        const users = await this.prisma.user.findMany();
        const article = await this.prisma.article.findMany();
        if (users.length === 0)
            throw new Error("No users found, run UserSeeder first");

        const comments = [
            {
                user_id: users[0].id,
                content:
                    "This is a very insightful article. Thanks for sharing!",
                article_id: article[0].id,
            },
            {
                user_id: users[1].id,
                content:
                    "I disagree with some points here, but overall a good read.",
                article_id: article[1].id,
            },
            {
                user_id: users[2]?.id ?? users[0].id,
                content: "Can you elaborate more on the second section?",
                article_id: article[2].id,
            },
            {
                user_id: users[3]?.id ?? users[1].id,
                content: "Sharing this with my colleagues. Very relevant!",
                article_id: article[4].id,
            },
            {
                user_id: users[0].id,
                content: "Looking forward to more articles like this.",
                article_id: article[1].id,
            },
            {
                user_id: users[1].id,
                content: "The data presented here is quite compelling.",
                article_id: article[0].id,
            },
        ];

        await this.prisma.comment.createMany({ data: comments });
        this.log(`Seeded ${comments.length} comments`);
    }
}
