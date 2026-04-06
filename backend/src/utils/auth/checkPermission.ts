import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { decryptCookie } from "./decryptUserToken";
import { ContentfulStatusCode } from "hono/utils/http-status";
import ArticleModel from "../../article/article.model";

export const checkPermisssion = async (
    c: Context,
    next: Next,
    permission: string[],
) => {
    try {
        const profile = await decryptCookie(c);
        if (!permission.find((name) => name == profile.roles)) {
            const res = c.json({
                status: 403,
                message: "you dont have permission to do this action",
            });
            throw new HTTPException(res.status as ContentfulStatusCode, {
                res,
            });
        }
        c.set("profile", profile);
        await next();
    } catch (error: any) {
        const res = c.json({
            status: 403,
            message: "you dont have permission to do this action",
        });
        throw new HTTPException(res.status as ContentfulStatusCode, { res });
    }
};

export const checkDatabasePermission = async (
    id: number,
    author_id: string,
) => {
    const article = await new ArticleModel().checkPermisssion(id);
    // Throw error if article does not exist
    if (!article?.id) {
        throw {
            status: 404,
            message: "article id " + id + " not found",
        };
    }
    if (article.author_id != author_id) {
        throw {
            status: 401,
            message: "you dont have permission to access this resource",
        };
    }
};
