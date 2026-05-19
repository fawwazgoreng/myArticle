import { expect, mock, test } from "bun:test"

// ---------------------------------------------------------------------------
// Module Mocks
// ---------------------------------------------------------------------------

mock.module("@infra/redis/refreshToken", () => ({
    default: class MockRedisToken {
        getToken = mock(async (token: string) => {
            if (token === "valid-refresh-token") {
                return `enc::${JSON.stringify({
                    id: "admin-1",
                    created_at: new Date().toISOString(),
                    roles: "admin",
                })}`
            }
            throw { status: 401, message: "cookie expired please login first" }
        })
        findToken = mock(async (id: string) => {
            if (id === "admin-1") {
                return `enc::${JSON.stringify({
                    id: "admin-1",
                    username: "admin",
                    email: "admin@test.com",
                    roles: "admin",
                })}`
            }
            return null
        })
        setToken    = mock(async () => undefined)
        deleteToken = mock(async () => undefined)
        refreshData = mock(async () => undefined)
    },
}))

mock.module("@utils/auth/encrypt", () => ({
    encryptToken: mock(async (raw: string) => `enc::${raw}`),
    decryptToken: mock(async (raw: string) => raw.replace(/^enc::/, "")),
    randomUuid:   mock(async () => "valid-refresh-token"),
}))

mock.module("@utils/auth/jwtauth", () => ({
    hashPassword:   mock(async () => "hashed-password"),
    checkToken:     mock(async (_c: any, next: any) => next()),
    getUserHasUsed: mock(async () => ({
        ip_address: "127.0.0.1", device_type: "desktop", event_type: "login",
    })),
    signToken: mock(async (_user: any) => "mock-jwt-access-token"),
}))

mock.module("@utils/auth/decryptUserToken", () => ({
    decryptCookie: mock(async (_c: any) => ({
        id: "admin-1", username: "admin", email: "admin@test.com", roles: "admin",
    })),
}))

mock.module("@/user/user.model", () => ({
    default: class MockUserModel {
        login = mock(async (req: any) => {
            if (req.email === "admin@test.com" && req.password === "Admin@123") {
                return {
                    id: "admin-1", username: "admin",
                    email: "admin@test.com", roles: "admin", password: "hashed-password",
                }
            }
            return null
        })
        register    = mock(async (payload: any) => ({ id: "new-admin-1", ...payload }))
        find        = mock(async (id: string) => {
            if (id === "admin-1") return { id: "admin-1", username: "admin", email: "admin@test.com", roles: "admin" }
            return null
        })
        monitoring  = mock(async () => undefined)
    },
}))

mock.module("@/user/user.validate", () => ({
    UserValidate: class MockUserValidate {
        login    = mock((req: any) => req)
        register = mock((req: any) => req)
    },
}))

mock.module("@utils/error", () => ({
    default: class AppError extends Error {
        statusCode: number
        errorCode:  string
        details:    any
        constructor(statusCode: number, message: string, errorCode: string, details?: any) {
            super(message)
            this.statusCode = statusCode
            this.errorCode  = errorCode
            this.details    = details
        }
    },
}))

mock.module("@/utils/error/separated", () => {
    const { HTTPException } = require("hono/http-exception")
    const toHttpException = (err: any) =>
        new HTTPException(err.statusCode ?? 500, {
            res: new Response(
                JSON.stringify({
                    status:  err.statusCode ?? 500,
                    message: err.message,
                    error:   err.errorCode  ?? "INTERNAL_ERROR",
                    details: err.details    ?? null,
                }),
                { status: err.statusCode ?? 500, headers: { "Content-Type": "application/json" } }
            ),
        })
    const handleError = (err: any) => {
        if (err instanceof HTTPException) return err
        return toHttpException(err)
    }
    return { handleError: mock(handleError), toHttpException: mock(toHttpException) }
})

mock.module("@infra/redis/redis.write", () => ({ ttl: 604800 }))

mock.module("@/config", () => ({
    env: {
        FRONT_END_URL: "http://localhost:3000",
        SECRET_KEY:    "test-secret-key-32-chars-minimum!",
        JWT_SECRET:    "test-jwt-secret",
    },
}))

mock.module("hono/bun", () => ({
    getConnInfo: mock(() => ({ remote: { address: "127.0.0.1" } })),
    serveStatic: mock(() => async (_c: any, next: any) => next()),
}))

// ---------------------------------------------------------------------------
// Import AFTER mocks
// ---------------------------------------------------------------------------
import app from "@/user/user.route"

// ---------------------------------------------------------------------------
// getToken helper
// ---------------------------------------------------------------------------
export const getTokenMock = async () => {
    const loginRes = await app.fetch(
        new Request("http://localhost/login", {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin":       "http://localhost:3000",
            },
            body: JSON.stringify({
                email:    "admin@myarticle.com",
                password: "Admin@123",
            }),
        })
    )

    if (!loginRes.ok) {
        throw new Error(`getToken: login failed with status ${loginRes.status}`)
    }

    const loginJson = await loginRes.json()
    const profileRes = await app.fetch(
        new Request("http://localhost/profile", {
            method:  "GET",
            headers: {
                "Origin": "http://localhost:3000",
                "Cookie": `refresh-token=${loginJson.token}`,
            },
        })
    )
    if (!profileRes.ok) {
        throw new Error(`getToken: profile failed with status ${profileRes.status}`)
    }
    const profileJson = await profileRes.json()
    return {
        refreshToken: loginJson.token,   // "valid-refresh-token"
        res:          profileJson,        // { status, token, profile }
    }
}

test("test", async () => {
    const res = await getTokenMock();
    console.log(res);
    expect(res.res.status).toBe(200);
})

export type TokenResult = {
    refreshToken: string
    res: {
        status:  number
        token:   string
        profile: {
            id:       string
            username: string
            email:    string
            roles:    string
        }
    }
}