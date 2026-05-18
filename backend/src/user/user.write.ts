import { userType, loginRequest, registerType } from "@/user/user.type";
import { UserValidate } from "@/user/user.validate";
import UserModel from "@/user/user.model";
import RedisToken from "@infra/redis/refreshToken";
import { decryptToken, encryptToken } from "@utils/auth/encrypt";
import { hashPassword } from "@utils/auth/jwtauth";
import AppError from "@utils/error";

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
        // Validate the registration request against the Zod schema        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.status).toBe(200)
        expect(json.message).toBe("logout successfully")
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

        // Return sanitized admin data (excluding sensitive fields like password)getToken
        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            roles: admin.roles,
        };
    };

    // Terminate admin session by removing tokens from the cache
    logout = async (refreshToken: string) => {
        const encryptedSession = await this.redisToken.getToken(refreshToken)
        const sessionRaw = await decryptToken(encryptedSession)
        let session: { id: string; created_at: string; roles: string }
        try {
            session = JSON.parse(sessionRaw.trim())
        } catch {
            throw new AppError(400, "invalid token format", "TOKEN_MALFORMED")
        }
        const encryptedUser = await this.redisToken.findToken(session.id)
        if (!encryptedUser) {
            throw new AppError(401, "session not found", "SESSION_NOT_FOUND")
        }
        const userRaw = await decryptToken(encryptedUser)
        let user: userType
        try {
            user = JSON.parse(userRaw.trim())
        } catch {
            throw new AppError(400, "invalid user data", "TOKEN_MALFORMED")
        }
        await this.redisToken.deleteToken(refreshToken, session.id)
        return user;
    }

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
