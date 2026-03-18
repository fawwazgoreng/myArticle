import WriteRedis from "../infrastructure/redis/redis.write";
import { getCookie } from "hono/cookie";
import { loginRequest } from "./admin.type";
import { AdminValidate } from "./admin.validate";
import { ZodError } from "zod";
import AdminModel from "./admin.model";

export default class AdminWrite {
    constructor(private writeRedis = new WriteRedis() , private adminValidate = new AdminValidate() , private adminModel = new AdminModel()) { }
    login = async(req: loginRequest) => {
        try {
            const validate = await this.adminValidate.login(req);
            const admin = await this.adminModel.login(validate);
            if (!admin) {
                throw {
                    status: 422,
                    message:"Email or password wrong",
                    error: "Email or password wrong"
                }
            }
            const payload = {
                id: admin.id,
                email: admin.email,
                time: admin.created_at
            }
            return payload;
        } catch (error: any) {
            if (error instanceof ZodError) {
                throw {
                    status: 422,
                    message: error.issues[0].message,
                    error: error.issues
                };
            }
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
}