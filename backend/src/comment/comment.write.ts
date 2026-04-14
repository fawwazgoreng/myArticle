import CommentModel from "./comment.model";
import { commentPayload } from "./comment.type";
import CommentValidate from "./comment.validate";

export default class WriteComment {
    constructor(
        private commentValidate = new CommentValidate(),
        private commentModel = new CommentModel(),
    ) {}

    create = async (req: commentPayload) => {
        const validated = await this.commentValidate.create(req);
        return await this.commentModel.create(validated);
    };

    update = async (
        id: number,
        req: {
            content: string;
        },
    ) => {
        const validated = await this.commentValidate.update(id, req);
        return await this.commentModel.update({
            id: validated.id,
            content: validated.content,
        });
    };

    delete = async (id: number) => {
        await this.commentModel.delete(id);
    };
}
