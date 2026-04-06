import prisma from "../infrastructure/database/prisma/prisma";
import { Sql } from "../infrastructure/database/generated/prisma/runtime/client";
import { Prisma } from "../infrastructure/database/generated/prisma";

// Article model responsible for database operations related to articles
export default class ArticleModel {
    // Fetch paginated articles with filtering and sorting
    show = async (params: {
        take: number;
        skip: number;
        orderBy: any;
        where?: Prisma.ArticleWhereInput;
    }) => {
        // Run data query and total count inside a transaction
        const [article, count] = await prisma.$transaction([
            prisma.article.findMany({
                take: params.take,
                skip: params.skip,
                orderBy: params.orderBy,
                where: params.where,
                // Select article fields with related categories
                select: {
                    id: true,
                    title: true,
                    content: true,
                    base_views: true,
                    image: true,
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
            }),
            // Count total articles for pagination metadata
            prisma.article.count({ where: params.where }),
        ]);

        return { article, count };
    };

    // Create a new article with category relations
    create = async (data: {
        title: string;
        content: string;
        image: string;
        author_id: string;
        categoryIds: number[];
    }) => {
        return await prisma.article.create({
            data: {
                title: data.title,
                content: data.content,
                image: data.image,
                author_id: data.author_id,

                // Create category relations in join table
                category: {
                    create: data.categoryIds.map((id) => ({
                        category_id: id,
                    })),
                },
            },

            // Return created article with categories
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                category: {
                    select: {
                        category: true,
                    },
                },
            },
        });
    };

    // Retrieve a single article by ID
    find = async (id: number) => {
        // Fetch article with related categories
        return await prisma.article.findFirst({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                base_views: true,
                image: true,
                category: {
                    select: {
                        category: true,
                    },
                },
            },
        });
    };
    
    // retrieve permission by author id
    checkPermisssion = async (id: number) => {
        // Fetch article with related categories
        return await prisma.article.findFirst({
            where: { id },
            select: {
                id: true,
                author_id: true,
            },
        });
    };

    // Update article and synchronize its category relations
    update = async (id: number, data: {
        title: string;
        content: string;
        image: string;
    }) => {
        return await prisma.article.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                image: data.image,
            },
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                base_views: true,
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
    };

    // replace all categories (no diff logic)
    replaceCategories = async (articleId: number, categoryIds: number[]) => {
        return await prisma.$transaction([
            prisma.categoryOnArticle.deleteMany({
                where: { article_id: articleId },
            }),
            prisma.categoryOnArticle.createMany({
                data: categoryIds.map((id) => ({
                    article_id: articleId,
                    category_id: id,
                })),
            }),
        ]);
    };

    // Delete article by ID
    delete = async (id: number) => {
        await prisma.categoryOnArticle.deleteMany({
            where: {
                article_id: id,
            },
        });

        // Remove article from database
        return await prisma.article.delete({
            where: { id },
        });
    };

    // Sync Redis view counters to database in batch
    sync = async (req: { key: string; val: string | null }[]) => {
        const condition: Sql[] = [];
        const ids: number[] = [];

        // Convert Redis key/value pairs into SQL CASE conditions
        req.forEach((item) => {
            const id = Number(item.key.split(":")[2]);
            const val = Number(item.val);

            if (isNaN(id) || isNaN(val)) return;

            condition.push(Prisma.sql`WHEN id = ${id} THEN ${val}`);
            ids.push(id);
        });

        if (!ids.length) return 0;

        const queryCase = Prisma.join(condition, " ");
        const inId = Prisma.join(ids, ",");

        // Batch update article views using CASE SQL
        const query = Prisma.sql`
        UPDATE "Article"
        SET base_views = CASE ${queryCase} ELSE base_views END
        where id in(${inId})
      `;

        return await prisma.$executeRaw(query);
    };

    // Retrieve only the article image
    findImage = async (id: number) => {
        // Fetch minimal data to reduce query cost
        const article = await prisma.article.findFirst({
            where: { id },
            select: {
                id: true,
                image: true,
            },
        });

        if (!article?.id) return null;

        return article;
    };
}