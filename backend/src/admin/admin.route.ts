import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import AdminWrite from "./admin.write";
import AdminRead from "./admin.read";
import { encryptToken } from "../utils/encrypt";
import AdminModel from "./admin.model";

const app = new Hono();
const adminWrite = new AdminWrite();
const adminRead = new AdminRead();
const adminModel = new AdminModel();

app
    .post('login', async (c) => {
        try {
            const request = await c.req.json();
            const admin = adminWrite.login(request);
            const token = encryptToken(JSON.stringify(admin));
            adminModel.monitoring();
            c.status(200);
            return c.json({
                
            });
        } catch (error : any) {
            const res = {
                status: error.status,
                message: error.message,
                error: error.error,
            }
            throw new HTTPException(res.status, res);
        }
    })
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