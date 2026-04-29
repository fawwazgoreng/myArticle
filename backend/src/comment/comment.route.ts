import { Hono } from "hono";
import { checkToken,  } from "@utils/auth/jwtauth";
import { handleError } from "@utils/error/separated";
import ReadComment from "@/comment/comment.read";
import { comment, commentArrayResponse, commentResponse } from "@/comment/comment.type";
import WriteComment from "@/comment/comment.write";
import { StatusCode } from "hono/utils/http-status";

// Create Hono app instance for user-related routing
const app = new Hono();
const readComment = new ReadComment();
const writeComment = new WriteComment();

app
    // Secure the logout route using JWT verification middleware
    .get("/comment", async (c) => {
        try {
            const { page, time, articleId } = c.req.query();
            const comment = await readComment.show({
                page: Number(page),
                time: time as "newest" | "oldest",
                articleId: Number(articleId),
            });

            const res: commentArrayResponse = {
                status: 200,
                message: "success get comment",
                comment: comment.comment,
                meta: comment.meta,
            };
            
            return c.json(res);
        } catch (error: any) {
            throw handleError(error);
        }
    })
    .get("/comment/:id", async (c) => {
        try {
            const id = c.req.param("id");
            const comment = await readComment.findById(Number(id));
            const res = {
                status: 200,
                message: "success find comment",
                comment
            };
            return c.json(res);
        } catch (error: any) {
            throw handleError(error);
        }
    })
    .use("*", checkToken)
    .post("/comment", async (c) => {
        try {
            const request = await c.req.json();
            const comment = await writeComment.create(request) as comment;
            const res: commentResponse = {
                status: 201,
                message: "success create comment",
                comment
            }
            c.status(res.status as StatusCode);
            return c.json(res);
        } catch (error: any) {
            throw handleError(error);
        }
    })
    .delete("/comment/:id", async (c) => {
        try {
            const id = Number(c.req.param("id"));
            await writeComment.delete(id);
            const res = {
                status: 200,
                message: "deleted comment successfully",
            }
            c.status(res.status as StatusCode)
            return c.json(res);
        } catch (error: any) {
            throw handleError(error);
        }
    }).put("/comment/:id", async (c) => {
        try {
            const id = Number(c.req.param("id"));
            const request = await c.req.json();
            const comment = await writeComment.update(id, request) as comment;
            const res : commentResponse = {
                status: 200,
                message: "deleted comment successfully",
                comment
            }
            c.status(res.status as StatusCode)
            return c.json(res);
        } catch (error: any) {
            throw handleError(error);
        }
    })
;

export default app;