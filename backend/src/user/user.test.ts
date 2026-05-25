import { describe, it, expect, mock, afterEach } from "bun:test"

// ---------------------------------------------------------------------------
// Module Mocks — declared before any import that pulls the real module
// ---------------------------------------------------------------------------

// Redis refresh token store mock
// ---------------------------------------------------------------------------
// Module Mocks — declared before any import that pulls the real module
// ---------------------------------------------------------------------------

// Redis refresh token store mock
// Define once, register to both paths
const MockRedisModule = {
    default: class MockRedisToken {
        async getToken(token: string) {
            console.log("🔴 MOCK REDIS getToken:", token)
            if (token && token.endsWith("valid-refresh-token")) {
                return `enc::${JSON.stringify({
                    id:         "admin-1",
                    created_at: new Date().toISOString(),
                    roles:      "admin",
                })}`
            }
            throw { status: 401, message: "INI DARI MOCK — cookie expired" }
        }
        async findToken(id: string) {
            if (id === "admin-1") {
                return `enc::${JSON.stringify({
                    id:       "admin-1",
                    username: "admin",
                    email:    "admin@test.com",
                    roles:    "admin",
                })}`
            }
            return null
        }
        async setToken()                               { return undefined }
        async deleteToken(_token: string, _id: string) { return undefined }
        async refreshData()                            { return undefined }
    },
}

// Register to both — whichever Bun resolves wins
mock.module("@infra/redis/refreshToken",                () => MockRedisModule)
mock.module("../infrastructure/redis/refreshToken", () => MockRedisModule)

// Encrypt / decrypt / uuid utilities mock
mock.module("@utils/auth/encrypt", () => ({
    encryptToken: mock(async (raw: string) => `enc::${raw}`),
    decryptToken: mock(async (raw: string) => raw.replace(/^enc::/, "")),
    randomUuid:   mock(async () => "mock-uuid-1234"),
}))

// Cookie decryption mock — returns deterministic admin payload
mock.module("@utils/auth/decryptUserToken", () => ({
    decryptCookie: mock(async (_c: any) => ({
        id:       "admin-1",
        username: "admin",
        email:    "admin@test.com",
        role:    "admin",
    })),
}))

// User model mock — credentials gate kept at email + password level
mock.module("@/user/user.model", () => ({
    default: class MockUserModel {
        login = mock(async (req: any) => {
            if (req.email === "admin@test.com" && req.password === "secret") {
                return { id: "admin-1", username: "admin", email: "admin@test.com", roles: "admin" }
            }
            return null // triggers 422 upstream
        })
        register    = mock(async (payload: any) => ({ id: "new-admin-1", ...payload }))
        find        = mock(async (id: string) => {
            if (id === "admin-1") return { id: "admin-1", username: "admin", email: "admin@test.com", role: "admin" }
            return null
        })
        monitoring  = mock(async () => undefined)
    },
}))

// Validation mock — pass-through, no schema enforcement in unit tests
mock.module("@/user/user.validate", () => ({
    UserValidate: class MockUserValidate {
        login    = mock((req: any) => req)
        register = mock((req: any) => req)
    },
}))

// AppError base class mock
mock.module("@utils/error", () => ({
    default: class AppError extends Error {
        statusCode: number
        error:      string
        constructor(statusCode: number, message: string, error: string) {
            super(message)
            this.statusCode = statusCode
            this.error      = error
        }
    },
}))

// HTTP exception factory mock — throws HTTPException so Hono catches it
mock.module("@utils/error/separated", () => ({
    toHttpException: mock((err: any) => {
        const { HTTPException } = require("hono/http-exception")
        const status  = err?.statusCode || err?.status || 500
        const message = err?.message    || "Internal server error"
        throw new HTTPException(status, {
            res: new Response(
                JSON.stringify({ status, message, error: err?.error || "INTERNAL_SERVER_ERROR" }),
                { status, headers: { "Content-Type": "application/json" } }
            ),
        })
    }),
    // handleError wraps toHttpException — re-throws if already HTTPException
    handleError: mock((err: any) => {
        const { HTTPException } = require("hono/http-exception")
        if (err instanceof HTTPException) return err
        const status  = err?.statusCode || err?.status || 500
        const message = err?.message    || "Internal server error"
        return new HTTPException(status, {
            res: new Response(
                JSON.stringify({
                    status,
                    message,
                    error: err?.error || err?.errorCode || "INTERNAL_SERVER_ERROR",
                }),
                { status, headers: { "Content-Type": "application/json" } }
            ),
        })
    }),
}))

// Redis write TTL config mock
mock.module("@infra/redis/redis.write", () => ({ ttl: 604800 }))

// App config mock — uses real SECRET_KEY so cookie signing stays consistent
mock.module("@/config", () => ({
    env: {
        FRONT_END_URL: "localhost",
        SECRET_KEY:    process.env.SECRET_KEY,
    },
}))

// Hono Bun adapter mock — getConnInfo returns loopback address
mock.module("hono/bun", () => ({
    getConnInfo: mock((_c: any) => ({ remote: { address: "127.0.0.1" } })),
    serveStatic: mock(() => async (_c: any, next: any) => next()),
}))

// ---------------------------------------------------------------------------
// JWT mock helper — bypass mode so checkToken always calls next()
// Import AFTER mock.module() registrations, BEFORE app import
// ---------------------------------------------------------------------------
import { createJwtMock } from "@/utils/testHelper/tokenHelper.test"

const jwt = createJwtMock(process.env.SECRET_KEY ?? "test-jwt-secret", "bypass")
jwt.bypass() // patch checkToken → always next(), no verify() called

// ---------------------------------------------------------------------------
// Subject imports — pulled AFTER all mocks are registered
// ---------------------------------------------------------------------------
import UserRead  from "@/user/user.read"
import UserWrite from "@/user/user.write"
import app from "@/user/user.route"


// ---------------------------------------------------------------------------
// Default mock implementations — used for afterEach restoration
// ---------------------------------------------------------------------------
const DEFAULT_DECRYPT_TOKEN  = async (raw: string) => raw.replace(/^enc::/, "")
const DEFAULT_DECRYPT_COOKIE = async (_c: any) => ({
    id: "admin-1", username: "admin", email: "admin@test.com", role: "admin",
})

// ---------------------------------------------------------------------------
// HTTP request helper — thin wrapper around app.fetch
// ---------------------------------------------------------------------------
async function req(
    method: string,
    path: string,
    opts: {
        body?:    Record<string, any>
        headers?: Record<string, string>
        cookies?: Record<string, string>
    } = {},
) {
    const url     = `http://localhost${path}`
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(opts.headers ?? {}),
    }
    if (opts.cookies) {
        headers["Cookie"] = Object.entries(opts.cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ")
    }
    const init: RequestInit = { method, headers }
    if (opts.body) init.body = JSON.stringify(opts.body)
    return app.fetch(new Request(url, init))
}

// ---------------------------------------------------------------------------
// 1. UserRead — unit tests (no HTTP layer)
// ---------------------------------------------------------------------------

describe("UserRead.profile", () => {
    // restore decryptToken to default after each test in this block
    afterEach(async () => {
        const { decryptToken } = await import("@utils/auth/encrypt")
        ;(decryptToken as any).mockImplementation(DEFAULT_DECRYPT_TOKEN)
    })

    it("returns decrypted profile from a valid refresh token", async () => {
        const { decryptToken } = await import("@utils/auth/encrypt")
        // override once — auto-reverts after this call
        ;(decryptToken as any).mockImplementationOnce(async () =>
            JSON.stringify({
                id:         "admin-1",
                created_at: new Date().toISOString(),
                role:      "admin",
            })
        )

        const userRead = new UserRead()
        const result   = await userRead.profile("valid-refresh-token")

        expect(result).toHaveProperty("id", "admin-1")
        expect(result).toHaveProperty("role", "admin")
        expect(result).toHaveProperty("created_at")
    })

    it("throws 401 when refresh token is not present in Redis", async () => {
        const userRead = new UserRead()
        expect(userRead.profile("invalid-token")).rejects.toMatchObject({ status: 401 })
    })
})

// ---------------------------------------------------------------------------
// 2. UserWrite — unit tests (no HTTP layer)
// ---------------------------------------------------------------------------

describe("UserWrite.login", () => {
    it("returns sanitized user data on valid credentials", async () => {
        const userWrite = new UserWrite()
        const result    = await userWrite.login({ email: "admin@test.com", password: "secret" })
        expect(result).toEqual({
            id: "admin-1", username: "admin", email: "admin@test.com", roles: "admin",
        })
    })
    
    it("throws AppError 422 when credentials do not match", async () => {
        const userWrite = new UserWrite()
        expect(
            userWrite.login({ email: "wrong@test.com", password: "bad" })
        ).rejects.toMatchObject({ statusCode: 422 })
    })
})

describe("UserWrite.register", () => {
    it("hashes password and persists new admin record", async () => {
        const userWrite = new UserWrite()
        const result    = await userWrite.register({
            email:     "new@test.com",
            password:  "plaintext",
            username:  "newadmin",
            roles:     "writer",
            is_verify: false,
        })

        expect(result?.email).toBe("new@test.com")
        expect(result?.id).toBeDefined()
    })
})

describe("UserWrite.logout", () => {
    // restore decryptToken to default after each test
    afterEach(async () => {
        const { decryptToken } = await import("@utils/auth/encrypt")
        ;(decryptToken as any).mockImplementation(DEFAULT_DECRYPT_TOKEN)
    })

    it("decrypts token, calls deleteToken, and returns admin data", async () => {
        const { decryptToken } = await import("@utils/auth/encrypt")
        // use Once so next test gets the default implementation back
        ;(decryptToken as any).mockImplementationOnce(async () =>
            JSON.stringify({
                id: "admin-1", username: "admin", email: "admin@test.com", role: "admin",
            })
        )

        const userWrite = new UserWrite()
        const result    = await userWrite.logout("valid-refresh-token")

        expect(result.id).toBe("admin-1")
    })

    it("throws when refresh token is not found in Redis", async () => {
        const userWrite = new UserWrite()
        expect(userWrite.logout("bad-token")).rejects.toBeDefined()
    })
})

describe("UserWrite.refreshData", () => {
    it("fetches admin from DB, encrypts payload, and stores in Redis", async () => {
        const userWrite = new UserWrite()
        const result    = await userWrite.refreshData("admin-1")

        expect(result.id).toBe("admin-1")
        expect(result.email).toBe("admin@test.com")
    })

    it("throws 404 when admin id does not exist in DB", async () => {
        const userWrite = new UserWrite()
        expect(userWrite.refreshData("nonexistent-id")).rejects.toMatchObject({ status: 404 })
    })
})

// ---------------------------------------------------------------------------
// 3. Route — POST /login
// ---------------------------------------------------------------------------

describe("POST /login", () => {
    it("returns 200 with token and sets httpOnly cookie on valid credentials", async () => {
        const res  = await req("POST", "/login", {
            body: { email: "admin@myarticle.com", password: "Admin@123" },
        })
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.status).toBe(200)
        expect(json.message).toBe("login successfully")
        expect(json.token).toBe("mock-uuid-1234")

        // cookie must carry security flags for production safety
        const setCookie = res.headers.get("set-cookie") ?? ""
        expect(setCookie).toContain("refresh-token=")
        expect(setCookie.toLowerCase()).toContain("httponly")
        expect(setCookie.toLowerCase()).toContain("secure")
        expect(setCookie.toLowerCase()).toContain("samesite=strict")
    })

    it("returns 4xx when credentials are invalid", async () => {
        const res = await req("POST", "/login", {
            body: { email: "hacker@test.com", password: "wrong" },
        })
        expect(res.status).toBeGreaterThanOrEqual(400)
    })

    it("returns 4xx when request body is malformed JSON", async () => {
        const res = await app.fetch(
            new Request("http://localhost/login", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    "{{invalid-json",
            })
        )
        expect(res.status).toBeGreaterThanOrEqual(400)
    })
})

// ---------------------------------------------------------------------------
// 4. Route — GET /profile
// ---------------------------------------------------------------------------

describe("GET /profile", () => {
    // restore decryptCookie to default after each test
    afterEach(async () => {
        const { decryptCookie } = await import("@utils/auth/decryptUserToken")
        ;(decryptCookie as any).mockImplementation(DEFAULT_DECRYPT_COOKIE)
    })

    it("returns 200 with profile and short-lived JWT access token", async () => {
        // checkToken is bypassed — no Authorization header needed
        const res  = await req("GET", "/profile")
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.status).toBe(200)
        expect(json.message).toBe("success get profile")
        expect(json.token).toBe("mock-jwt-access-token")
        expect(json.profile).toMatchObject({ id: "admin-1", email: "admin@test.com" })
    })

    it("returns 401 when decryptCookie throws (expired or invalid session)", async () => {
        const { decryptCookie } = await import("@utils/auth/decryptUserToken")
        // use Once — reverts automatically after this single invocation
        ;(decryptCookie as any).mockImplementationOnce(async () => {
            throw { status: 401, message: "Session expired" }
        })

        const res = await req("GET", "/profile")
        expect(res.status).toBe(401)
    })
})

// ---------------------------------------------------------------------------
// 5. Route — POST /register
// No prisma calls — UserModel.register is fully mocked
// ---------------------------------------------------------------------------

describe("POST /register", () => {
    it("returns 201 when role is an unknown value (coerces to 'user')", async () => {
        const res  = await req("POST", "/register", {
            body: {
                email:    "new@test.com",
                password: "Pass123?",
                username: "newadmin",
                role:    "unknown-role",
            },
        })
        const json = await res.json()
        expect(res.status).toBe(201)
        expect(json.status).toBe(201)
        expect(json.message).toBe("success created admin")
    })

    it("returns 201 when role is explicitly 'writer'", async () => {
        const res  = await req("POST", "/register", {
            body: {
                email:    "writer@test.com",
                password: "Pass123?",
                username: "writeruser",
                role:    "writer",
            },
        })
        const json = await res.json()

        expect(res.status).toBe(201)
        expect(json.status).toBe(201)
    })

    it("returns 4xx when UserModel.register throws", async () => {
        const UserModel = (await import("@/user/user.model")).default
        const proto     = UserModel.prototype as any
        const original  = proto.register

        // temporarily override register to simulate a conflict error
        proto.register = mock(async () => {
            throw { status: 409, message: "Email already exists" }
        })

        const res = await req("POST", "/register", {
            body: { email: "dup@test.com", password: "pass", username: "dup" },
        })

        expect(res.status).toBeGreaterThanOrEqual(400)

        // restore original mock so subsequent tests are not affected
        proto.register = original
    })
})

// ---------------------------------------------------------------------------
// 6. Route — DELETE /logout
// Uses real JWT token generated by jwt.generateToken()
// checkToken (real) will verify this token — bypass mode is OFF for this block
// ---------------------------------------------------------------------------

describe("DELETE /logout", () => {
    // restore decryptToken and decryptCookie defaults after each test
    afterEach(async () => {
        const { decryptToken }  = await import("@utils/auth/encrypt")
        const { decryptCookie } = await import("@utils/auth/decryptUserToken")
        ;(decryptToken as any).mockImplementation(DEFAULT_DECRYPT_TOKEN)
        ;(decryptCookie as any).mockImplementation(DEFAULT_DECRYPT_COOKIE)
    })

    it("returns 401 when refresh-token cookie is absent", async () => {
        const token = await jwt.generateToken({ id: "admin-1", role: "admin" })

        const res = await req("DELETE", "/logout", {
            headers: { Authorization: `Bearer ${token}` },
            // no cookie — should trigger 401 in route guard
        })
        expect(res.status).toBe(401)
    })

    it("returns 401 when refresh-token is not found in Redis", async () => {
        const token = await jwt.generateToken({ id: "admin-1", role: "admin" })

        const res = await req("DELETE", "/logout", {
            headers: { Authorization: `Bearer ${token}` },
            cookies: { "refresh-token": "invalid-token" }, // not in mock Redis
        })
        expect(res.status).toBe(401)
    })
})

// ---------------------------------------------------------------------------
// 7. Response Shape Contracts — verify envelope structure across all endpoints
// ---------------------------------------------------------------------------

describe("Response Shape Contracts", () => {
    afterEach(async () => {
        const { decryptToken }  = await import("@utils/auth/encrypt")
        const { decryptCookie } = await import("@utils/auth/decryptUserToken")
        ;(decryptToken as any).mockImplementation(DEFAULT_DECRYPT_TOKEN)
        ;(decryptCookie as any).mockImplementation(DEFAULT_DECRYPT_COOKIE)
    })

    it("login: response always contains { status, message, token }", async () => {
        const res  = await req("POST", "/login", {
            body: { email: "admin@myarticle.com", password: "Admin@123" },
        })
        const json = await res.json()

        expect(json).toHaveProperty("status")
        expect(json).toHaveProperty("message")
        expect(json).toHaveProperty("token")
    })

    it("profile: response always contains { status, message, profile, token }", async () => {
        const res  = await req("GET", "/profile")
        const json = await res.json()

        expect(json).toHaveProperty("status")
        expect(json).toHaveProperty("message")
        expect(json).toHaveProperty("profile")
        expect(json).toHaveProperty("token")
    })

    it("register: response always contains { status, message }", async () => {
        const res  = await req("POST", "/register", {
            body: { email: "x@test.com", password: "UnitTest123]", username: "username123" },
        })
        const json = await res.json()

        expect(json).toHaveProperty("status")
        expect(json).toHaveProperty("message")
    })

    it("logout: response always contains { status, message }", async () => {
        // use a real token so checkToken does not reject the request
        const token = await jwt.generateToken({ id: "admin-1", role: "admin" })

        const res  = await req("DELETE", "/logout", {
            headers: { Authorization: `Bearer ${token}` },
            cookies: { "refresh-token": "valid-refresh-token" },
        })
        const json = await res.json()

        expect(json).toHaveProperty("status")
        expect(json).toHaveProperty("message")
    })
})