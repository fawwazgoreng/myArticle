import { loginRequest, monitoring, registerType } from "@/user/user.type";

// user model responsible for database operations and authentication related to administrators
export default class UserModel {
    // Authenticate user user by email and password verification
    login = async (req: loginRequest) => {
        // Retrieve user record matching the provided email
        return await prisma?.user.findFirst({
            where: {
                email: req.email,
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                roles: true,
            },
        });
    };

    // Log administrative actions into the session audit trail
    monitoring = async (req: monitoring) => {
        // Create a new audit trail entry with the provided request data
        await prisma?.session_audit_trail.create({
            data: req,
        });
    };

    // Retrieve specific user details by unique ID
    find = async (id: string) => {
        // Fetch minimal user info for profile or verification purposes
        return await prisma?.user.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                email: true,
                username: true,
                roles: true,
            },
        });
    };

    // register a new user
    register = async (req: registerType) => {
        return await prisma?.user.create({
            data: req,
            select: {
                id: true,
                username: true,
                email: true,
                roles: true,
            },
        });
    };
}
