import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { decryptCookie } from "./decryptUserToken";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const checkPermisssion = async (c : Context , next : Next , permission: string[]) => {
    try {
        const profile = await decryptCookie(c);
        if (!permission.find(name => name == profile.roles)) {
            const res = c.json({
                status: 403,
                message: 'you dont have permission to do this action',
            });
            throw new HTTPException(res.status as ContentfulStatusCode, { res });
        }
        c.set("profile" , profile);
        await next();
    } catch (error : any) {
        const res = c.json({
            status: 403,
            message: 'you dont have permission to do this action',
        });
        throw new HTTPException(res.status as ContentfulStatusCode, { res });
    }
}