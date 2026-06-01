import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { env } from "@/config";
import prisma from "@/infrastructure/database/prisma/prisma";
import { logger } from "@/infrastructure/logger/log";
import { userType } from "@/user/user.type";

export const OAuth = betterAuth({
    baseURL: {
        protocol: "https",
        allowedHosts: [env.APP_URL, env.FRONT_END_URL],
    },
    rateLimiting: {
        enabled: true,
        window: 10,
        max: 100,
        storage: "memory",
        modelName: "rateLimiting",
    },
    logger: {
        disabled: false,
        disableColors: false,
        level: "warn",
        log: (level, message, ...args) => {
            logger.architecture(message, { component: "INFRASTRUCTURE_FAIL", level, ...args })
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    user: {
        modelName: "user",
        create: (user : userType) => {
            return {
                ...user,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        },
        fields: {
            name: "name",
            emailVerified: "emailVerified",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    databaseHooks: {
        session: {
            create: {
                after: async (session) => {
                    await prisma.session_audit_trail.create({
                        data: {
                            userId: session.userId,
                            ip_address: session.ipAddress ?? "",
                            device_type: session.userAgent ?? "",
                            event_type: "login",
                            success: true,
                            failure_session: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    })
                }
          }
      }  
    },
    session: {
        modelName: "session",
        expiresIn: 60 * 60 * 24 * 30,
        cookieCache: {
          enabled: false,
        },
        fields: {
            userId: "userId",
            token: "token",
            ipAddress: "ipAddress",
            userAgent: "userAgent",
            expiresAt: "expiresAt",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    account: {
        modelName: "account",
        encryptOAuthTokens: true,
        storeOAuthTokens: true,
        accountLinking: {
            trustedProviders: ["google", "github"],
        },
        fields: {
            userId: "userId",
            providerId: "providerId",
            accountId: "accountId",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            accessTokenExpiresAt: "accessTokenExpiresAt",
            refreshTokenExpiresAt: "refreshTokenExpiresAt",
            scope: "scope",
            idToken: "idToken",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    verification: {
        modelName: "verification",
        fields: {
            identifier: "identifier",
            expiresAt: "expiresAt",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    socialProviders: {
        // google: {
        //     clientId: env.GOOGLE_CLIENT_ID,
        //     clientSecret: env.GOOGLE_CLIENT_SECRET,
        // },
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
    },
    secret: env.BETTER_AUTH_SECRET,
});
