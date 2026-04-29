import prisma from "@infra/database/prisma/prisma";
import { Prisma } from "@infra/database/generated/prisma";
import { ArticleRepositoryModel } from "@/article/article.repository";
import { article } from "@/article/article.type";

// Article model responsible for database operations related to articles
export default class ArticleModel implements ArticleRepositoryModel {
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
                base_views: true,
                created_at: true,
                updated_at: true,
                author_id: true,
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
    };

    // Retrieve a single article by ID
    findById = async (id: number) => {
        // Fetch article with related categories
        return (await prisma.article.findFirst({
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
        })) as article;
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
    update = async (data: {
        id: number;
        title: string;
        content: string;
        image: string;
    }) => {
        return await prisma.article.update({
            where: { id: data.id },
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
        await prisma.$transaction([
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
    raw = async (query: any) => {
        return await prisma.$executeRaw(query);
    };

    // Retrieve only the article image
    findImage = async (id: number) => {
        // Fetch minimal data to reduce query cost
        return await prisma.article.findFirst({
            where: { id },
            select: {
                id: true,
                image: true,
            },
        });
    };
}
