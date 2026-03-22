import prisma from "../infrastructure/database/prisma/prisma";
import { article, articleMeta, articleModelPayload } from "./article.type";
import {
    PrismaClientKnownRequestError,
    Sql,
} from "../infrastructure/database/generated/prisma/runtime/client";
import { findPage } from "../utils/findPage";
import { meta } from "../utils/global.type";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { logger } from "../infrastructure/logger/log";

// Article model responsible for database operations related to articles
export default class ArticleModel {
    // Fetch paginated articles with filtering and sorting
    show = async (req: {
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
    }) => {
        try {
            // Normalize pagination and filter parameters
            const page = findPage(req);

            // Determine sorting direction based on time filter
            const isNew: Prisma.SortOrder =
                page.time == "newest" ? "desc" : "asc";

            // Determine sorting direction for popularity
            const populer: Prisma.SortOrder = req.populer ? "desc" : "asc";

            // Build dynamic orderBy configuration
            let orderBy: any = [];

            // Prioritize popularity sorting if requested
            if (req.populer) orderBy.push({ base_views: populer });

            // Always apply article ID sorting for time ordering
            orderBy.push({ id: isNew });

            const take = 30;

            // Run data query and total count inside a transaction
            const [article, count] = await prisma.$transaction([
                prisma.article.findMany({
                    take: take,
                    skip: page.skip,
                    orderBy: orderBy,

                    // Filter articles by title prefix
                    where: {
                        title: {
                            startsWith: page.title ?? "",
                        },
                    },

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
                prisma.article.count({}),
            ]);

            // Build pagination metadata
            const meta: meta = {
                firstPage: 1,
                currentPage: req.page,
                lastPage: Math.ceil(count / take),
                count,
            };

            const res: articleMeta = {
                article: article as article[],
                meta,
            };

            return res;
        } catch (error: any) {
            // Log unexpected errors
            const res = {
                status: 500,
                message: error.message || "internal server error",
                error: error,
            };

            logger.error(res);
            throw res;
        }
    };

    // Create a new article with category relations
    create = async (req: articleModelPayload) => {
        try {
            // Resolve category IDs from provided category names
            const cate = await prisma.category.findMany({
                where: {
                    name: {
                        in: req.category,
                    },
                },
                select: {
                    id: true,
                },
            });

            // Transform category IDs into relation objects
            const category = cate.map((item) => ({ category_id: item.id }));

            const article = await prisma.article.create({
                data: {
                    title: req.title,
                    content: req.content,
                    image: req.image,

                    // Create category relations in join table
                    category: {
                        create: category,
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

            return article as article;
        } catch (error: any) {
            // Handle known Prisma database errors
            if (error instanceof PrismaClientKnownRequestError) {
                throw {
                    status: 400,
                    message: Object.values(error.message)[0],
                    error: error.message,
                };
            }

            // Fallback for unexpected errors
            throw {
                status: 500,
                message: "internal server error",
                error: error.message,
            };
        }
    };

    // Retrieve a single article by ID
    find = async (id: number) => {
        try {
            // Fetch article with related categories
            const article = await prisma.article.findFirst({
                where: {
                    id: id,
                },
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

            // Throw error if article does not exist
            if (!article?.id) {
                throw {
                    status: 404,
                    message: "article id " + id + " not found",
                };
            }

            return article;
        } catch (error) {
            throw {
                status: 404,
                message: "article id " + id + " not found",
            };
        }
    };

    // Update article and synchronize its category relations
    update = async (id: number, req: articleModelPayload) => {
        try {
            // Retrieve current article categories
            const cate = await prisma.categoryOnArticle.findMany({
                where: {
                    article_id: id,
                },
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            // Determine categories that need to be added
            const addCategory = req.category
                .map((name) => {
                    const findable = cate.find(
                        (item) => item.category?.name == name,
                    );
                    if (findable) return null;
                    return name;
                })
                .filter((item) => item != null);

            // Resolve IDs for new categories
            const idsAddCategory = await prisma.category.findMany({
                where: {
                    name: {
                        in: addCategory
                    },
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            // Determine categories that should be removed
            const deleteCategory = cate
                .map((item) =>
                    !req.category.includes(String(item.category?.name))
                        ? item.category
                        : null,
                )
                .filter((item) => item != null);

            logger.info({ message: "add categ", addCategory });
            logger.info({ message: "delete categ", deleteCategory });

            // Perform update and relation sync in a transaction
            const article = await prisma.$transaction([
                // Remove outdated category relations
                prisma.categoryOnArticle.deleteMany({
                    where: {
                        article_id: id,
                        category: {
                            name: {
                                in: deleteCategory.map((item) => item.name),
                            },
                        },
                    },
                }),

                // Create new category relations
                prisma.categoryOnArticle.createMany({
                    data: idsAddCategory.map((item) => ({
                        article_id: id,
                        category_id: item.id,
                    })),
                }),

                // Update article fields
                prisma.article.update({
                    where: {
                        id: id,
                    },
                    data: {
                        title: req.title,
                        content: req.content,
                        image: req.image,
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
                }),
            ]);

            return article[2] as article;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw {
                        status: 404,
                        message: `Article id ${id} not found`,
                    };
                }
            }
            throw {
                status: 500,
                message: error.message,
            };
        }
    };

    // Delete article by ID
    delete = async (id: number) => {
        try {
            await prisma.categoryOnArticle.deleteMany({
                where: {
                    article_id: id
                }
            })
            // Remove article from database
            const article = await prisma.article.delete({
                where: {
                    id: id,
                },
            });

            if (!article) {
                throw {
                    status: 404,
                    message: "article id " + id + " not found",
                };
            }

            return article;
        } catch (error : any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw {
                        status: 404,
                        message: `Article id ${id} not found`,
                    };
                }
            }
            throw {
                status: 500,
                message: error.message || "internal server error",
            };
        }
    };

    // Sync Redis view counters to database in batch
    sync = async (req: { key: string; val: string | null }[]) => {
        try {
            const condition: Sql[] = [];
            const ids: number[] = [];

            // Convert Redis key/value pairs into SQL CASE conditions
            req.filter(
                (item) =>
                    !isNaN(Number(item.key.split(":")[2])) &&
                    !isNaN(Number(item.val)),
            ).forEach((item) => {
                const id = Number(item.key.split(":")[2]);
                const val = Number(item.val);

                condition.push(Prisma.sql`WHEN id = ${id} THEN ${val}`);
                ids.push(id);
            });

            const queryCase = Prisma.join(condition, " ");
            const inId = Prisma.join(ids, ",");

            // Batch update article views using CASE SQL
            const query = Prisma.sql`
        UPDATE "Article"
        SET base_views = CASE ${queryCase} ELSE base_views END
        where id in(${inId})
      `;

            const res = await prisma.$executeRaw(query);

            return res;
        } catch (error: any) {
            throw {
                status: 500,
                message: error || "internal server error",
            };
        }
    };

    // Retrieve only the article image
    findImage = async (id: number) => {
        try {
            // Fetch minimal data to reduce query cost
            const article = await prisma.article.findFirst({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    image: true,
                },
            });

            if (!article?.id) return null;

            return article;
        } catch (error) {
            // Return null instead of throwing error
            return null;
        }
    };
}
