import { userType, loginRequest, registerType } from "./user.type";
import { UserValidate } from "./user.validate";
import { ZodError } from "zod";
import UserModel from "./user.model";
import RedisToken from "../infrastructure/redis/refreshToken";
import { decryptToken, encryptToken } from "../utils/encrypt";
import { hashPassword } from "../utils/jwtauth";

// UserWrite service responsible for state-changing operations like authentication and session sync
export default class UserWrite {
    // Initialize dependencies for validation, database access, and token management
    constructor(
        private userValidate = new UserValidate(),
        private userModel = new UserModel(),
        private redisToken = new RedisToken(),
    ) {}

    // Handle new administrator registration, including validation and password hashing
    register = async (req: registerType) => {
        try {
            // Validate the registration request against the Zod schema
            const validated = await this.userValidate.register(req);

            // Hash the plain-text password before database storage
            const hashed = await hashPassword(validated.password);

            // Construct the final payload with the secured password
            const payload: registerType = {
                ...validated,
                password: hashed,
                roles: req.roles
            };

            // Persist the new admin record to the database
            const admin = await this.userModel.register(payload);
            return admin;
        } catch (error: any) {
            // Transform Zod validation errors into a standardized response format
            if (error instanceof ZodError) {
                throw {
                    status: 422,
                    message: error.issues[0].message,
                    error: error.issues
                };
            }
            // Standardize generic or custom errors
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
    
    // Execute admin login workflow including validation and credential verification
    login = async (req: loginRequest) => {
        try {
            // Validate incoming request body against defined schema
            const validate = await this.userValidate.login(req);

            // Check credentials via the database model
            const admin = await this.userModel.login(validate);

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
                roles: admin.roles
            };
        } catch (error: any) {
            if (error instanceof ZodError) {
                throw {
                    status: 422,
                    message: error.issues[0].message,
                    error: error.issues,
                };
            }
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
            const res = await this.redisToken.getToken(refreshToken);
            const admin: userType = JSON.parse(await decryptToken(res));

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
            const admin = await this.userModel.find(id);

            if (!admin) {
                throw {
                    status: 404,
                    message: "Admin not found",
                };
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
    };
}