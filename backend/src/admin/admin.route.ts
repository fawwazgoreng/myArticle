import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import AdminWrite from "./admin.write";
import AdminRead from "./admin.read";
import { decryptToken, encryptToken } from "../utils/encrypt";
import { logger } from "../infrastructure/logger/log";

const app = new Hono();
const adminWrite = new AdminWrite();
const adminRead = new AdminRead();

app
    .get('/profile', async (c) => {
        try {
            const profile = await adminRead.profile(c);
        } catch (error: any) {
            const res = {
                status: error.status,
                message: error.message,
                error: error.error,
            }
            throw new HTTPException(res.status, res);
    }
})

export default app;