import { PrismaClientKnownRequestError } from "../infrastructure/database/generated/prisma/runtime/client";
import { logger } from "../infrastructure/logger/log";
import { verifyHash } from "../utils/jwtauth";
import { loginRequest, monitoring } from "./admin.type";

export default class AdminModel {
    login = async (req: loginRequest) => {
        try {
            const admin = await prisma?.admin.findFirst({
                where: {
                    email: req.email,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    password: true,
                },
            });
            await verifyHash(String(admin?.password), req.password);
            return admin;
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw {
                    status: 400,
                    message: Object.values(error.message)[0],
                    error: error.message,
                };
            }
            throw {
                status: 500,
                message: "email or password wrong",
                error: "email or password wrong",
            };
        }
    };
    monitoring = async (req: monitoring) => {
        try {
            await prisma?.session_audit_trail.create({
                data: req
            });
        } catch (error: any) {
            logger.error({
                status: 500,
                message: Object.values(error.message)[0],
                error: error.message,
            });
        }
    };
    find = async (id: string) => {
        try {
            const admin = await prisma?.admin.findFirst({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                },
            });
            return admin;
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw {
                    status: 400,
                    message: Object.values(error.message)[0],
                    error: error.message,
                };
            }
            throw {
                status: 500,
                message: "email or password wrong",
                error: "email or password wrong",
            };
        }
    }
}
