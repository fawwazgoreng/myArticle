import { PrismaClientKnownRequestError } from "../infrastructure/database/generated/prisma/runtime/client";
import { logger } from "../infrastructure/logger/log";
import { verifyHash } from "../utils/jwtauth";
import { loginRequest, monitoring, registerType } from "./user.type";

// user model responsible for database operations and authentication related to administrators
export default class UserModel {
    // Authenticate user user by email and password verification
    login = async (req: loginRequest) => {
        try {
            // Retrieve user record matching the provided email
            const user = await prisma?.user.findFirst({
                where: {
                    email: req.email,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    password: true,
                    roles: true
                },
            });

            // Verify the provided plain-text password against the stored hash
            await verifyHash(String(user?.password), req.password);

            return user;
        } catch (error: any) {
            // Handle known Prisma database errors
            if (error instanceof PrismaClientKnownRequestError) {
                throw {
                    status: 400,
                    message: Object.values(error.message)[0],
                    error: error.message,
                };
            }
            // Fallback for failed authentication or unexpected errors
            throw {
                status: 500,
                message: "email or password wrong",
                error: "email or password wrong",
            };
        }
    };

    // Log administrative actions into the session audit trail
    monitoring = async (req: monitoring) => {
        try {
            // Create a new audit trail entry with the provided request data
            await prisma?.session_audit_trail.create({
                data: req
            });
        } catch (error: any) {
            // Log failure to record monitoring data without throwing to prevent blocking the main flow
            logger.error({
                status: 500,
                message: Object.values(error.message)[0],
                error: error.message,
            });
        }
    };

    // Retrieve specific user details by unique ID
    find = async (id: string) => {
        try {
            // Fetch minimal user info for profile or verification purposes
            const user = await prisma?.user.findFirst({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    roles: true
                },
            });
            return user;
        } catch (error: any) {
            // Handle known database errors during retrieval
            if (error instanceof PrismaClientKnownRequestError) {
                throw {
                    status: 400,
                    message: Object.values(error.message)[0],
                    error: error.message,
                };
            }
            // Generic error handling for data retrieval failures
            throw {
                status: 500,
                message: "email or password wrong",
                error: "email or password wrong",
            };
        }
    }
    
    // register a new user
    register = async (req: registerType) => {
        try {
            const user = await prisma?.user.create({
                data: req,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    roles: true
                }
            });
            return user;
        } catch (error: any) {
            // Handle known Prisma database errors
            if (error instanceof PrismaClientKnownRequestError) {
                throw {
                    status: 400,
                    message: Object.values(error.message)[0],
                    error: error.message,
                };
            }
            // Fallback for failed authentication or unexpected errors
            throw {
                status: 500,
                message: "email or password wrong",
                error: "email or password wrong",
            };
        }
    }
}