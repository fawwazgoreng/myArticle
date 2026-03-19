import { adminType, loginRequest } from "./admin.type";
import { AdminValidate } from "./admin.validate";
import { ZodError } from "zod";
import AdminModel from "./admin.model";
import RedisToken from "../infrastructure/redis/refreshToken";
import { decryptToken, encryptToken } from "../utils/encrypt";
import { email } from "zod/v4/core/regexes.cjs";

export default class AdminWrite {
    constructor(private adminValidate = new AdminValidate() , private adminModel = new AdminModel() , private redisToken = new RedisToken()) { }
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
            return {
                id: admin.id,
                username: admin.username,
                email: admin.email,
            };
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
    logout = async (refreshToken: string) => {
        try {
            const res = await this.redisToken.getToken(refreshToken);
            const admin: adminType = JSON.parse(await decryptToken(res));
            await this.redisToken.deleteToken(refreshToken , admin.id);
            return admin;
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
    refreshData = async (id: string) => {
        try {
            const admin = await this.adminModel.find(id);
            if (!admin) {
                throw {
                    status: 404,
                    message: "Admin not found"
                }
            }
            const value = await encryptToken(JSON.stringify(admin));
            await this.redisToken.refreshData(admin.id, value);
            return admin;
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
}