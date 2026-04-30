import prisma from "@infra/database/prisma/prisma";
import { delCategoryRelation } from "@/category/category.helper";

// Category model responsible for database operations related to categories
export default class CategoryModel {
    // Retrieve all categories
    show = async () => {
        return  await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });

    };

    // Create a new category
    create = async (req: { name: string }) => {
        return  await prisma.category.create({
            data: {
                name: req.name,
            },
        });
    };
    
    findFirst = async (name: string) => {
        return await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
    }

    // Retrieve a category with its articles and pagination
    find = async (req: {
        take: number;
        orderBy: any;
        id: number
    }) => {
        // Fetch category data and article count in a transaction
        return await prisma.$transaction([
            prisma.category.findFirst({
                where: {
                    id: req.id,
                },
                select: {
                    id: true,
                    name: true,

                    // Retrieve related articles
                    article: {
                        take: req.take,
                        orderBy: req.orderBy,
                        select: {
                            article_id: true,
                            article: true,
                        },
                    },
                },
            }),

            // Count total related articles
            prisma.categoryOnArticle.count({
                where: {
                    category_id: req.id,
                },
            }),
        ]);
    };

    // Update category name
    update = async (id: number, req: { name: string }) => {
        return await prisma.category.update({
            where: {
                id: id,
            },
            data: {
                name: req.name,
            },
        });
    };

    // Delete category by ID
    delete = async (id: number) => {
        await delCategoryRelation(id);

        return await prisma.category.delete({
            where: {
                id: id,
            },
        });
    };
    findCategoryByNames = async (name: string[]) => {
        return await prisma?.category.findMany?.({
            where: {
                name: {
                    in: name,
                },
            },
            select: { id: true },
        });
    };
}
