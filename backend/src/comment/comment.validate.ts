import { commentPayload } from "./comment.type"
import z from "zod"

const createComment = z.object({
    user_id: z.string(),
    content: z.string().min(3).max(150),
    article_id: z.number()
});

const updateComment = z.object({
    id: z.number(),
    content: z.string().min(3).max(150),
});

export default class CommentValidate {
    create = async (req: commentPayload) => {
        return createComment.parse(req);
    }
    update = async (id: number, req: {
        content: string
    }) => {
        return updateComment.parse({id , ...req});
    }
}