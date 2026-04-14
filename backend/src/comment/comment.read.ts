import CommentModel from "./comment.model";
import RedisWrite from "../infrastructure/redis/redis.write";
import { findPage } from "../utils/db/findPage";
import { ReadRedis } from "../infrastructure/redis/redis.read";
import { comment, commentMeta } from "./comment.type";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { meta } from "../type/global.type";
import AppError from "../utils/error";

export default class ReadComment {
    constructor(
        private commentModel = new CommentModel(),
        private redisWrite = new RedisWrite(),
        private readRedis = new ReadRedis(),
    ) {}

    show = async (req: {
        page: number;
        time: "newest" | "oldest";
        articleId: number;
    }) => {
        let cacheKey = `comments:${req.page}:${req.time}:${req.articleId}`;

        let comment: commentMeta = {
            comment: [],
            meta: {
                firstPage: 1,
                lastPage: 1,
                currentPage: 1,
                count: 10,
            },
        };

        const data = await this.readRedis.readAll(cacheKey);

        if (data) {
            comment = JSON.parse(data);
        } else {
            const page = findPage(req);

            const isNew: Prisma.SortOrder =
                page.time === "newest" ? "desc" : "asc";

            const orderBy: any[] = [];

            orderBy.push({ id: isNew });

            const take = 30;
            const skip = (req.page - 1) * take;

            const where: Prisma.CommentWhereInput = {
                article: {
                    some: {
                        article_id: req.articleId,
                    },
                },
            };

            const dataDb = await this.commentModel.show({
                take,
                skip,
                orderBy,
                where,
            });

            const meta: meta = {
                firstPage: 1,
                currentPage: req.page,
                lastPage: Math.ceil(dataDb.count / take),
                count: dataDb.count,
            };

            const res: commentMeta = {
                comment: dataDb.comment as comment[],
                meta,
            };

            if (dataDb.comment.length > 0) {
                await this.redisWrite.cacheSearch<commentMeta>(cacheKey, res);
            }

            comment = res;
        }
        return comment;
    };
    findById = async ( id: number ) => {
        const comment = await this.commentModel.find(id);
        if (!comment?.id) {
            throw new AppError(
                404,
                `comment id ${id} not found`,
                "COMMENT_NOT_FOUND",
            );
        }
        return comment;
    };
}
