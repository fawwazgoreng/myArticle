import { Hono } from "hono";
import { checkToken,  } from "../utils/auth/jwtauth";
import { handleError } from "../utils/error/separated";
import ReadComment from "./comment.read";
import { commentArrayResponse } from "./comment.type";

// Create Hono app instance for user-related routing
const app = new Hono();
const readComment = new ReadComment();

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
            return c.json(comment);
        } catch (error: any) {
            throw handleError(error);
        }
    })
    .use("*", checkToken)
    .post("/comment", async (c) => {
        try {
            
        } catch (error: any) {
            throw handleError(error);
        }
    })
    .delete("/comment/:id", async (c) => {
        try {
        } catch (error: any) {
            throw handleError(error);
        }
    }).put("/comment/:id", async () => {
        try {
        } catch (error: any) {
            throw handleError(error);
        }
    })
;

export default app;