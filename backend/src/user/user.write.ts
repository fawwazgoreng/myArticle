import { userType, loginRequest, registerType } from "./user.type";
import { UserValidate } from "./user.validate";
import UserModel from "./user.model";
import RedisToken from "../infrastructure/redis/refreshToken";
import { decryptToken, encryptToken } from "../utils/auth/encrypt";
import { hashPassword } from "../utils/auth/jwtauth";
import AppError from "../utils/error";

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
        // Validate the registration request against the Zod schema
        const validated = this.userValidate.register(req);

        // Hash the plain-text password before database storage
        const hashed = await hashPassword(validated.password);

        // Construct the final payload with the secured password
        const payload: registerType = {
            ...validated,
            password: hashed,
            roles: req.roles,
            is_verify: false
        };

        // Persist the new admin record to the database
        const admin = await this.userModel.register(payload);
        return admin;
    };

    // Execute admin login workflow including validation and credential verification
    login = async (req: loginRequest) => {
        // Validate incoming request body against defined schema
        const validate = this.userValidate.login(req);

        // Check credentials via the database model
        const admin = await this.userModel.login(validate);

        // Explicitly handle failed authentication attempts
        if (!admin) {
            throw new AppError(
                422,
                "Email or password wrong",
                "Email or password wrong",
            );
        }

        // Return sanitized admin data (excluding sensitive fields like password)
        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            roles: admin.roles,
        };
    };

    // Terminate admin session by removing tokens from the cache
    logout = async (refreshToken: string) => {
        const res = await this.redisToken.getToken(refreshToken);
        const admin: userType = JSON.parse(await decryptToken(res));

        await this.redisToken.deleteToken(refreshToken, admin.id);
        return admin;
    };

    // Synchronize latest database profile data into the Redis session store
    refreshData = async (id: string) => {
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
    };
}
