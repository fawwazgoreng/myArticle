import { adminType, loginRequest } from "./admin.type";
import { AdminValidate } from "./admin.validate";
import { ZodError } from "zod";
import AdminModel from "./admin.model";
import RedisToken from "../infrastructure/redis/refreshToken";
import { decryptToken, encryptToken } from "../utils/encrypt";

// AdminWrite service responsible for state-changing operations like authentication and session sync
export default class AdminWrite {
    // Initialize dependencies for validation, database access, and token management
    constructor(
        private adminValidate = new AdminValidate(),
        private adminModel = new AdminModel(),
        private redisToken = new RedisToken(),
    ) {}

    // Execute admin login workflow including validation and credential verification
    login = async (req: loginRequest) => {
        try {
            // Validate incoming request body against defined schema
            const validate = await this.adminValidate.login(req);

            // Check credentials via the database model
            const admin = await this.adminModel.login(validate);

            // Explicitly handle failed authentication attempts
            if (!admin) {
                throw {
                    status: 422,
                    message: "Email or password wrong",
                    error: "Email or password wrong",
                };
            }

            // Return sanitized admin data (excluding sensitive fields like password)
            return {
                id: admin.id,
                username: admin.username,
                email: admin.email,
            };
        } catch (error: any) {
            // Transform Zod validation errors into a standardized response format
            if (error instanceof ZodError) {
                throw {
                    status: 422,
                    message: error.issues[0].message,
                    error: error.issues,
                };
            }
            // Standardize generic or custom errors
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    };

    // Terminate admin session by removing tokens from the cache
    logout = async (refreshToken: string) => {
        try {
            // Retrieve the stored encrypted token from Redis
            const res = await this.redisToken.getToken(refreshToken);

            // Decrypt and parse the token to identify the admin owner
            const admin: adminType = JSON.parse(await decryptToken(res));

            // Delete the token pair to invalidate the session globally
            await this.redisToken.deleteToken(refreshToken, admin.id);

            return admin;
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    };

    // Synchronize latest database profile data into the Redis session store
    refreshData = async (id: string) => {
        try {
            // Fetch the most recent admin data from the database
            const admin = await this.adminModel.find(id);

            if (!admin) {
                throw {
                    status: 404,
                    message: "Admin not found",
                };
            }

            // Encrypt the updated data string before storage
            const value = await encryptToken(JSON.stringify(admin));

            // Update the existing session entry in Redis
            await this.redisToken.refreshData(admin.id, value);

            return admin;
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    };
}
