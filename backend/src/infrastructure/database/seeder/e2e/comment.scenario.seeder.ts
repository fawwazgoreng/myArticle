import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class LongCommentThreadScenarioSeeder extends BaseSeeder {
    async run(): Promise<void> {
        const article = await this.prisma.article.findFirst();
        const users = await this.prisma.user.findMany({ take: 5 });

        if (!article || users.length === 0) {
            this.log("Skip: Article or Users not found.");
            return;
        }

        this.log(`Seeding 20 comments for article: ${article.title}`);

        for (let i = 1; i <= 20; i++) {
            const comment = await this.prisma.comment.create({
                data: {
                    user_id: users[i % users.length].id,
                    content: `Ini adalah komentar ke-${i} untuk menguji scroll dan pagination pada section komentar.`,
                },
            });

            await this.prisma.commentOnArticle.create({
                data: {
                    comment_id: comment.id,
                    article_id: article.id,
                },
            });
        }
    }
}

export class GhostUserCommentScenarioSeeder extends BaseSeeder {
    async run(): Promise<void> {
        const article = await this.prisma.article.findFirst();

        const ghostUser = await this.prisma.user.create({
            data: {
                email: "ghost@anonymous.com",
                username: "anonymous_ghost",
                password: null,
                roles: "user",
                is_verify: true,
            },
        });

        const comment = await this.prisma.comment.create({
            data: {
                user_id: ghostUser.id,
                content: "i comment without have password in my account",
            },
        });

        await this.prisma.commentOnArticle.create({
            data: {
                comment_id: comment.id,
                article_id: article?.id!,
            },
        });

        this.log("Seeded anonymous/ghost user comment.");
    }
}
