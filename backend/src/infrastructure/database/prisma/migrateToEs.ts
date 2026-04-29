import { PrismaClient } from "@infra/database/generated/prisma";
import elasticSearchClient from "@infra/elasticSearch";

const prisma = new PrismaClient();

const migrate = async () => {
    const BATCH_SIZE = 500;
    let offset = 0;
    let total = 0;
    while (true) {
        const articles = await prisma.article.findMany({
            take: BATCH_SIZE,
            skip: offset,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                base_views: true,
                created_at: true,
                updated_at: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                category: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        
        if (articles.length === 0) break;
        
        const ops = articles.flatMap((article) => {
            return [
                { index: { _index: "articles", _id: article.id } },
                article,
            ];
        });
        
        const { errors, items } = await elasticSearchClient.bulk({ operations: ops });
        if (errors) {
            const failed = items.filter((item) => item.index?.error);
            console.error(`batch error ${failed} , total ${items.length}`);
        }
        total += articles.length;
        offset += BATCH_SIZE;
        console.log(`Migrated ${total} articles...`);
    }
    
    await prisma.$disconnect();
    console.log("Migration completed successfully.");
};

migrate().catch((error) => {
    console.error(error);
    process.exit(1);
});
