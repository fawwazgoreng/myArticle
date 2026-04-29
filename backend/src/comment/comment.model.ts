import prisma from "@infra/database/prisma/prisma";

export default class CommentModel {
    show = async (params: {
        take: number;
        skip: number;
        orderBy: any;
        where?: any;
    }) => {
        const [comment, count] = await prisma.$transaction([
            prisma.comment.findMany({
                take: params.take,
                skip: params.skip,
                orderBy: params.orderBy,
                where: params.where,
                select: {
                    id: true,
                    user_id: true,
                    content: true,
                    created_at: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            roles: true,
                        },
                    },
                },
            }),
            // Count total articles for pagination metadata
            prisma.comment.count({ where: params.where }),
        ]);

        return { comment, count };
    };

    find = async (id: number) => {
        return await prisma.comment.findFirst({
            where: { id },
            select: {
                id: true,
                content: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        roles: true,
                    },
                },
                article: {
                    select: {
                        article: {
                            select: {
                                id: true,
                                title: true,
                                created_at: true,
                            },
                        },
                    },
                },
            },
        });
    };

    create = async (params: {
        content: string;
        user_id: string;
        article_id: number;
    }) => {
        return await prisma.comment.create({
            data: {
                content: params.content,
                user_id: params.user_id,
                article: {
                    create: {
                        article_id: params.article_id,
                    },
                },
            },
            select: {
                id: true,
                user_id: true,
                content: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        roles: true
                    }
                }
            }
        });
    };

    update = async (params: { id: number; content: string }) => {
        return await prisma.comment.update({
            where: {
                id: params.id,
            },
            data: {
                content: params.content,
            },
            select: {
                id: true,
                user_id: true,
                content: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        roles: true
                    }
                }
            }
        });
    };

    delete = async (id: number ) => {
        return await prisma.comment.delete({
            where: {
                id,
            },
        });
    };
}
