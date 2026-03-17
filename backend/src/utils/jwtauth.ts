import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import {jwt} from "hono/jwt"
import { ContentfulStatusCode } from "hono/utils/http-status";
import { SignatureKey } from "hono/utils/jwt/jws";

export const checkToken = async (c : Context , next: Next) => {
    try {
        const jwtMiddleware = jwt({
            secret: (String(process.env["SECRET_TOKEN"])) as SignatureKey,
            alg: "HS256"
        })
        await jwtMiddleware(c , next);
    } catch (error) {
        const res = c.json({
            status: 401,
            message: 'unauthorized',
        });
        throw new HTTPException(res.status as ContentfulStatusCode, { res });
    }
}