import { Hono } from "hono";
import { OAuth } from "./OAuth";
import { encryptToken, randomUuid } from "./encrypt";
import RedisToken from "@/infrastructure/redis/refreshToken";
import { ttl } from "@/infrastructure/redis/redis.write";
import { deleteCookie, setCookie } from "hono/cookie";
import { env } from "@/config";

const authRouter = new Hono();

authRouter.on(["POST", "GET"], "/auth/*", async (c) => {
    return OAuth.handler(c.req.raw);
});

authRouter.get("/auth/token", async (c) => {
    const session = await OAuth.api.getSession({
        headers: c.req.raw.headers,
        context: { req: c.req.raw },
    });

    if (!session?.user) {
        c.status(401);
        return c.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const user = await prisma?.user.findFirst({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            roles: true,
        },
    });

    if (!user) {
        c.status(401);
        return c.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const encryptionData = {
        id: user.id,
        created_at: new Date(),
        roles: user.roles,
    };

    const value = await encryptToken(JSON.stringify(encryptionData));
    const setTokenCookie = await encryptToken(JSON.stringify(user));
    const token = await randomUuid();
    const dateExp = new Date();

    await new RedisToken().setToken(token, value, user.id, setTokenCookie);
    dateExp.setDate(dateExp.getTime() + ttl);

    deleteCookie(c, "refresh-token");
    setCookie(c, "refresh-token", token, {
        path: "/",
        secure: true,
        domain: env.FRONT_END_URL,
        expires: dateExp,
        maxAge: 7,
        sameSite: "lax",
        httpOnly: true,
    });

    await OAuth.api.signOut({
        headers: c.req.raw.headers,
    });

    return c.json({
        status: 200,
        message: "login successfully",
        token,
    });
});

authRouter.get();

export default authRouter;
