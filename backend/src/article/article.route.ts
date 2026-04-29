import { Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";
import WriteArticle from "@/article/article.write";
import ReadArticle from "@/article/article.read";
import WriteRedis from "@infra/redis/redis.write";
import {
    articleArrayResponse,
    articlePayload,
    articleResponse,
} from "@/article/article.type";
import { RedisKey } from "ioredis";
import { checkToken } from "@utils/auth/jwtauth";
import { checkPermisssion } from "@utils/auth/checkPermission";
import { handleError } from "@utils/error/separated";

type variable = {
    profile: {
        id: string;
        created_at: Date;
        roles: "admin" | "writer" | "user";
    };
};

const index = new Hono<{ Variables: variable }>();

const writeArticle = new WriteArticle();
const readArticle = new ReadArticle();
const writeRedis = new WriteRedis();

const parseCategory = (input: any): string[] => {
    if (Array.isArray(input)) return input;
    if (input) return [String(input)];
    return [];
};

const parseBodyToPayload = async (c: any): Promise<articlePayload> => {
    const body = await c.req.parseBody();
    const profile = c.get("profile");

    return {
        title: String(body["title"] || ""),
        content: String(body["content"] || ""),
        image:
            typeof body["image"] === "string"
                ? null
                : (body["image"] as File) || null,
        category: parseCategory(body["category"]),
        profile: { ...profile, author_id: profile.id },
    };
};

index
    .get("/", async (c) => {
        try {
            const { page, title, populer, oldest, category } = c.req.query();

            const payload: {
                page: number,
                title: string,
                time: "oldest" | "newest",
                populer: boolean,
                category?: string 
            } = {
                page: Number(page) || 1,
                title: title || "",
                time: typeof oldest === "string" ? "oldest" : "newest",
                populer: Boolean(populer),
                category: category ?? undefined,
            };

            const result = await readArticle.show(payload);

            const res: articleArrayResponse = {
                status: 200,
                message: "success get article",
                article: result.article,
                meta: result.meta,
            };

            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    .get("/:id", async (c) => {
        try {
            const id = Number(c.req.param("id"));

            const article = await readArticle.findById(id);

            const views = await writeRedis.increment(
                String(article.id) as RedisKey,
            );

            article.base_views = views;

            return c.json({
                status: 200,
                message: "success get article",
                article,
            });
        } catch (error) {
            throw handleError(error);
        }
    })

    .use("/", checkToken)
    .use("/", (c, next) => checkPermisssion(c, next, ["admin", "writer"]))

    .post("/", async (c) => {
        try {
            const payload = await parseBodyToPayload(c);

            const article = await writeArticle.create(payload);

            const res: articleResponse = {
                status: 200,
                message: "success create article",
                article,
            };

            c.status(res.status as StatusCode);
            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    .put("/:id", async (c) => {
        try {
            const id = Number(c.req.param("id"));

            const payload = await parseBodyToPayload(c);

            const article = await writeArticle.update({ id, articlePayload: payload });

            await writeRedis.newArticle(article);

            const res: articleResponse = {
                status: 200,
                message: "success update article",
                article,
            };

            c.status(res.status as StatusCode);
            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    .delete("/:id", async (c) => {
        try {
            const id = Number(c.req.param("id"));
            const profile = c.get("profile");
            await writeArticle.checkPermission(id, {
                ...profile,
                author_id: profile.id,
            });

            await writeRedis.delete(String(id) as RedisKey);
            await writeArticle.delete(id);

            return c.json({
                status: 200,
                message: `success delete article id ${id}`,
            });
        } catch (error) {
            throw handleError(error);
        }
    });

export default index;
