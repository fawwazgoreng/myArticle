import { article, articlePayload } from "./article.type";
import { writeFile } from "../utils/image.write";
import WriteRedis from "../infrastructure/redis/redis.write";
import { ArticleValidate } from "./article.validate";
import ArticleModel from "./article.model";
import { checkDatabasePermission } from "../utils/auth/checkPermission";
import AppError from "../utils/error";
import CategoryModel from "../category/category.model";
import { Sql } from "../infrastructure/database/generated/prisma/runtime/client";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { ArticleRepositoryWrite } from "./article.repository";

// Service responsible for writing article data
export default class WriteArticle implements ArticleRepositoryWrite {
    // Initialize validation, database model, image handler, and Redis writer
    constructor(
        private articleValidate = new ArticleValidate(),
        private articleModel = new ArticleModel(),
        private articleImage = new writeFile("article"),
        private writeRedis = new WriteRedis(),
        private categoryModel = new CategoryModel(),
    ) {}

    // Create a new article with validation, image upload, and Redis update
    create = async (req: articlePayload) => {
        const validated = await this.articleValidate.create(req);

        let url = "";
        if (req.image) {
            url = await this.articleImage.write(req.image);
        }

        const categories = await this.categoryModel.findCategoryByNames(
            req.category,
        );

        if (!categories || categories.length !== validated.category.length) {
            throw new AppError(400, "Invalid category", "INVALID_CATEGORY");
        }

        const article = await this.articleModel.create({
            title: validated.title,
            content: validated.content,
            image: url,
            author_id: req.profile.author_id,
            categoryIds: categories.map((c: any) => c.id),
        });

        await this.writeRedis.newArticle(article as article);

        return {
            ...article,
            base_views: 0,
        };
    };

    // Update article data and synchronize image if changed
    update = async (req: { id: number; articlePayload: articlePayload }) => {
        const validated = await this.articleValidate.update(req.articlePayload);

        if (req.articlePayload.profile.roles !== "admin") {
            const permission = await this.articleModel.checkPermisssion(req.id);

            if (!permission?.id) {
                throw new AppError(
                    404,
                    `article id ${req.id} not found`,
                    "ARTICLE_NOT_FOUND",
                );
            }

            await checkDatabasePermission(req.id, req.articlePayload.profile.author_id);
        }

        const lastImg = (await this.articleModel.findImage(req.id))?.image || "";

        const url = this.articleImage.update(lastImg, req.articlePayload.image) || "";

        const categories = await this.categoryModel.findCategoryByNames(
            validated.category,
        );

        if (!categories || categories.length !== validated.category.length) {
            throw new AppError(400, "Invalid category", "INVALID_CATEGORY");
        }

        const article = await this.articleModel.update({
            id: req.id,
            title: validated.title,
            content: validated.content,
            image: url,
        });

        await this.articleModel.replaceCategories(
            req.id,
            categories.map((c: any) => c.id),
        );

        return article as article;
    };

    // Delete article and remove associated image
    delete = async (id: number) => {
        const article = await this.articleModel.findById(id);

        if (!article?.id) {
            throw new AppError(
                404,
                `article id ${id} not found`,
                "ARTICLE_NOT_FOUND",
            );
        }

        await this.articleModel.delete(id);

        if (article.image) {
            this.articleImage.update(article.image);
        }
    };

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

        return await this.articleModel.raw(query);
    };

    checkPermission = async (
        id: number,
        profile: {
            roles: string;
            author_id: string;
        },
    ) => {
        if (profile.roles !== "admin") {
            const permission = await this.articleModel.checkPermisssion(id);

            if (!permission?.id) {
                throw new AppError(
                    401,
                    `Neither You dont have access to article id ${id} nor you are not the author`,
                    "UNAUTHORIZED",
                );
            }

            await checkDatabasePermission(id, profile.author_id);
        }
    };
}
