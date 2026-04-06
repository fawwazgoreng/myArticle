import {
    article,
    articlePayload,
} from "./article.type";
import { writeFile } from "../utils/image.write";
import WriteRedis from "../infrastructure/redis/redis.write";
import { ArticleValidate } from "./article.validate";
import ArticleModel from "./article.model";
import { checkDatabasePermission } from "../utils/auth/checkPermission";
import AppError from "../utils/error";
import CategoryModel from "../category/category.model";

// Service responsible for writing article data
export default class WriteArticle {
    // Initialize validation, database model, image handler, and Redis writer
    constructor(
        private articleValidate = new ArticleValidate(),
        private articleModel = new ArticleModel(),
        private articleImage = new writeFile("article"),
        private writeRedis = new WriteRedis(),
        private categoryModel = new CategoryModel();
    ) {}

    // Create a new article with validation, image upload, and Redis update
    create = async (req: articlePayload) => {
        const validated = await this.articleValidate.create(req);

        let url = "";
        if (req.image) {
            url = await this.articleImage.write(req.image);
        }

        const categories = await this.categoryModel.findCategoryByNames(req.category);

        if (!categories || categories.length !== validated.category.length) {
            throw new AppError(
                400,
                "Invalid category",
                "INVALID_CATEGORY",
            );
        }

        const article = await this.articleModel.create({
            title: validated.title,
            content: validated.content,
            image: url,
            author_id: req.profile.author_id,
            categoryIds: categories.map((c: any) => c.id),
        });

        await this.writeRedis.newArticle(article as article);

        return article;
    };

    // Update article data and synchronize image if changed
    update = async (id: number, req: articlePayload) => {
        const validated = await this.articleValidate.update(req);

        if (req.profile.roles !== "admin") {
            const permission = await this.articleModel.checkPermisssion(id);

            if (!permission?.id) {
                throw new AppError(
                    404,
                    `article id ${id} not found`,
                    "ARTICLE_NOT_FOUND",
                );
            }

            await checkDatabasePermission(id, req.profile.author_id);
        }

        const lastImg =
            (await this.articleModel.findImage(id))?.image || "";

        const url = this.articleImage.update(lastImg, req.image) || "";

        const categories = await this.categoryModel.findCategoryByNames(validated.category);

        if (!categories || categories.length !== validated.category.length) {
            throw new AppError(
                400,
                "Invalid category",
                "INVALID_CATEGORY",
            );
        }

        const article = await this.articleModel.update(id, {
            title: validated.title,
            content: validated.content,
            image: url,
        });

        await this.articleModel.replaceCategories(
            id,
            categories.map((c: any) => c.id),
        );

        return article;
    };

    // Delete article and remove associated image
    delete = async (
        id: number,
        profile: { author_id: string; roles: "admin" | "writer" | "user" },
    ) => {
        if (profile.roles !== "admin") {
            const permission = await this.articleModel.checkPermisssion(id);

            if (!permission?.id) {
                throw new AppError(
                    404,
                    `article id ${id} not found`,
                    "ARTICLE_NOT_FOUND",
                );
            }

            await checkDatabasePermission(id, profile.author_id);
        }

        const article = await this.articleModel.find(id);

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

        return true;
    };
}
