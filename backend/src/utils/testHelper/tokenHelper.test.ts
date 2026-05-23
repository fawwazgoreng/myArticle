import { sign } from "hono/jwt";
import { mock } from "bun:test";
import { env } from "@/config";

export type mockUserPayload = {
    id: string;
    username: string;
    role: string;
    email: string;
}

export type jwtMockmode = "bypass" | "real";

export type jwtMockHelper = {
    mode: jwtMockmode;

    generateToken: (override: Partial<mockUserPayload>) => Promise<string>;
    bypass: () => void;
    restore: () => void;
}

const defaultPayload: mockUserPayload = {
    id: "admin-1",
    username: "admin",
    role: "admin",
    email: "admin@example.com",
};

export const createJwtMock = ( jwtSecret: string, initialMode: jwtMockmode = "real"): jwtMockHelper => {
    let currentMode = initialMode;

    let checkTokenMock: ReturnType<typeof mock> | null = null;

    const generateToken = async (override: Partial<mockUserPayload> = {}): Promise<string> => {
        const payload = {
            ...defaultPayload,
            ...override,
            exp: Math.floor(Date.now() / 1000) + 3600,
            
        };
        return await sign(payload, env.SECRET_KEY , "HS256");
    }

    const bypass = (): void => {
        currentMode = "bypass";
        checkTokenMock = mock(async (_c: any, next: any) => {
            await next();
        });

        mock.module("@utils/auth/jwtauth", () => ({
            hashPassword: mock(async () => "hashed-password"),
            checkToken: checkTokenMock,
            signToken: mock(async () => "mock-jwt-access-token"),
            getUserHasUsed: mock(async () => ({
                ip_address: "127.0.0.1", device_type: "desktop", event_type: "login",
            })),
        }))
    }

    const restore = (): void => {
        currentMode = "real";

        mock.module("@utils/auth/jwtauth", async () => {
            const real = await import("@utils/auth/jwtauth");
            return real;
        })
    }

    return {
        get mode() {
            return currentMode;
        },
        generateToken,
        bypass,
        restore,
    };
}

export const jwtMock = createJwtMock(
    process.env.JWT_SECRET ?? "test-jwt-secret"
)