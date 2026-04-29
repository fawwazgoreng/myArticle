import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { decryptCookie } from "@utils/auth/decryptUserToken";
import { ContentfulStatusCode } from "hono/utils/http-status";
import ArticleModel from "@/article/article.model";
import { toHttpException } from "@utils/error/separated";
import AppError from "@utils/error";

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
        throw toHttpException(new AppError(403,"you dont have permission to do this action","UNAUTHORIZED"));
    }
};

export const checkDatabasePermission = async (
    id: number,
    author_id: string,
) => {
    const article = await new ArticleModel().checkPermisssion(id);
    // Throw error if article does not exist
    if (!article?.id) {
        throw toHttpException(new AppError(404,`article id ${id} not found`,"NOT FOUND"));
    }
    if (article.author_id != author_id) {
        throw toHttpException(new AppError(403,"you dont have permission to do this action","UNAUTHORIZED"));
    }
};
