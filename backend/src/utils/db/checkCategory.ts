import prisma from "@infra/database/prisma/prisma";

export const delCategoryRelation = async (categoryId: number) => {
    let unclasId = 0;
    const unclas = await prisma.category.findFirst({
        where: {
            name: {
                equals: "unclasified",
            },
        },
        select: {
            id: true,
        },
    });
    if (unclas) {
        unclasId = unclas.id;
    } else {
        unclasId = (
            await prisma.category.create({
                data: {
                    name: "unclasified",
                },
                select: {
                    id: true,
                },
            })
        ).id;
    }
    await prisma.categoryOnArticle.updateMany({
        where: {
            category_id: categoryId,
        },
        data: {
            category_id: unclasId
        },
    });
};
