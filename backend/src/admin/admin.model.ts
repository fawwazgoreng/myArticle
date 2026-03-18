import { PrismaClientKnownRequestError } from "../infrastructure/database/generated/prisma/runtime/client";
import { verifyHash } from "../utils/jwtauth";
import { loginRequest } from "./admin.type";

export default class AdminModel {
    login = async (req : loginRequest) => {
        try {
            const admin = await prisma?.admin.findFirst({
                where: {
                    email: req.email
                },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    created_at: true
                }
            });
            await verifyHash(String(admin?.password), req.password)
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
                error: "email or password wrong"
            }
        }
    }
    monitoring = async () => {
        
    }
}