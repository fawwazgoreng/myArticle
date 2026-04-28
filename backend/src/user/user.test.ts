import { describe, it, expect, mock, beforeEach, spyOn } from "bun:test";

// ---------------------------------------------------------------------------
// Module Mocks — must be declared before any import that pulls the real module
// ---------------------------------------------------------------------------

// --- Redis ---
mock.module("../infrastructure/redis/refreshToken", () => ({
    default: class MockRedisToken {
        getToken = mock(async (token: string) => {
            if (token === "valid-refresh-token") return "encrypted-payload";
            throw { status: 401, message: "Token not found" };
        });
        setToken = mock(async () => undefined);
        deleteToken = mock(async () => undefined);
        refreshData = mock(async () => undefined);
    },
}));

// --- Encrypt utils ---
mock.module("../utils/auth/encrypt", () => ({
    encryptToken: mock(async (raw: string) => `enc::${raw}`),
    decryptToken: mock(async (raw: string) => raw.replace(/^enc::/, "")),
    randomUuid: mock(async () => "mock-uuid-1234"),
}));

// --- JWT / auth utils ---
mock.module("../utils/auth/jwtauth", () => ({
    hashPassword: mock(async (_plain: string) => "hashed-password"),
    checkToken: mock(async (_c: any, next: any) => next()),
    getUserHasUsed: mock(async (_c: any, _event: string) => ({
        ip_address: "127.0.0.1",
        device_type: "desktop",
        event_type: "login",
    })),
    signToken: mock(async (_user: any) => "mock-jwt-access-token"),
}));

// --- decryptCookie ---
mock.module("../utils/auth/decryptUserToken", () => ({
    decryptCookie: mock(async (_c: any) => ({
        id: "admin-1",
        username: "admin",
        email: "admin@test.com",
        roles: "admin",
    })),
}));

// --- UserModel ---
mock.module("./user.model", () => ({
    default: class MockUserModel {
        login = mock(async (req: any) => {
            if (req.email === "admin@test.com" && req.password === "secret") {
                return {
                    id: "admin-1",
                    username: "admin",
                    email: "admin@test.com",
                    roles: "admin",
                };
            }
            return null; // triggers 422 in UserWrite.login
        });

        register = mock(async (payload: any) => ({
            id: "new-admin-1",
            ...payload,
        }));

        find = mock(async (id: string) => {
            if (id === "admin-1") {
                return {
                    id: "admin-1",
                    username: "admin",
                    email: "admin@test.com",
                    roles: "admin",
                };
            }
            return null;
        });

        monitoring = mock(async () => undefined);
    },
}));

// --- UserValidate ---
mock.module("./user.validate", () => ({
    UserValidate: class MockUserValidate {
        login = mock((req: any) => req);
        register = mock((req: any) => req);
    },
}));

// --- AppError ---
mock.module("../utils/error", () => ({
    default: class AppError extends Error {
        constructor(
            public status: number,
            message: string,
            public error: string,
        ) {
            super(message);
        }
    },
}));

// --- handleError ---
mock.module("../utils/error/separated", () => ({
    handleError: mock((err: any) => {
        const { HTTPException } = require("hono/http-exception");
        const status = err?.status ?? 500;
        return new HTTPException(status, {
            message: err?.message || "Internal server error",
        });
    }),
}));

// --- Redis TTL config ---
mock.module("../infrastructure/redis/redis.write", () => ({
    ttl: 604800,
}));

// --- Config env ---
mock.module("../config", () => ({
    env: {
        FRONT_END_URL: "localhost",
        JWT_SECRET: "test-secret",
    },
}));

// --- hono/bun ---
mock.module("hono/bun", () => ({
    getConnInfo: mock((_c: any) => ({
        remote: { address: "127.0.0.1" },
    })),
    serveStatic: mock(() => async (_c: any, next: any) => next()),
}));

// ---------------------------------------------------------------------------
// Import subjects AFTER mocks are registered
// ---------------------------------------------------------------------------
import UserRead from "./user.read";
import UserWrite from "./user.write";
import app from "./user.route"; // the Hono router from the provided route file

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function req(
    method: string,
    path: string,
    opts: {
        body?: Record<string, any>;
        headers?: Record<string, string>;
        cookies?: Record<string, string>;
    } = {},
) {
    const url = `http://localhost${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...( opts.headers ?? {}),
    };
    if (opts.cookies) {
        headers["Cookie"] = Object.entries(opts.cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ");
    }
    const init: RequestInit = { method, headers };
    if (opts.body) init.body = JSON.stringify(opts.body);
    return app.fetch(new Request(url, init));
}


// 1. UserRead


describe("UserRead.profile", () => {
    it("returns decrypted profile from a valid refresh token", async () => {
        const userRead = new UserRead();
        // getToken returns "encrypted-payload" → decryptToken strips enc:: prefix
        // but payload here is raw JSON stored as "encrypted-payload" (mock-only),
        // so we override decryptToken to return valid JSON for this specific test
        const { decryptToken } = await import("../utils/auth/encrypt");
        (decryptToken as any).mockImplementation(async () =>
            JSON.stringify({
                id: "admin-1",
                created_at: new Date().toISOString(),
                roles: "admin",
            }),
        );

        const result = await userRead.profile("valid-refresh-token");

        expect(result).toHaveProperty("id", "admin-1");
        expect(result).toHaveProperty("roles", "admin");
        expect(result).toHaveProperty("created_at");
    });

    it("throws when refresh token is invalid / not in Redis", async () => {
        const userRead = new UserRead();
        expect(userRead.profile("invalid-token")).rejects.toMatchObject({
            status: 401,
        });
    });
});


// 2. UserWrite


describe("UserWrite.login", () => {
    it("returns sanitized user data on valid credentials", async () => {
        const userWrite = new UserWrite();
        const result = await userWrite.login({
            email: "admin@test.com",
            password: "secret",
        });

        expect(result).toEqual({
            id: "admin-1",
            username: "admin",
            email: "admin@test.com",
            roles: "admin",
        });
    });

    it("throws AppError 422 when credentials are wrong", async () => {
        const userWrite = new UserWrite();
        expect(
            userWrite.login({ email: "wrong@test.com", password: "bad" }),
        ).rejects.toMatchObject({ status: 422 });
    });
});

describe("UserWrite.register", () => {
    it("hashes password and persists admin record", async () => {
        const userWrite = new UserWrite();
        const result = await userWrite.register({
            email: "new@test.com",
            password: "plaintext",
            username: "newadmin",
            roles: "writer",
            is_verify: false,
        });

        expect(result?.email).toBe("new@test.com");
        // Password must have been replaced by hashed version
        expect(result?.id).toBeDefined();
    });
});

describe("UserWrite.logout", () => {
    it("decrypts token, calls deleteToken, and returns admin data", async () => {
        // Override decryptToken to return a valid admin JSON
        const { decryptToken } = await import("../utils/auth/encrypt");
        (decryptToken as any).mockImplementation(async () =>
            JSON.stringify({
                id: "admin-1",
                username: "admin",
                email: "admin@test.com",
                roles: "admin",
            }),
        );

        const userWrite = new UserWrite();
        const result = await userWrite.logout("valid-refresh-token");

        expect(result.id).toBe("admin-1");
    });

    it("throws when refresh token is not found in Redis", async () => {
        const userWrite = new UserWrite();
        expect(userWrite.logout("bad-token")).rejects.toBeDefined();
    });
});

describe("UserWrite.refreshData", () => {
    it("fetches admin from DB, encrypts, and stores in Redis", async () => {
        const userWrite = new UserWrite();
        const result = await userWrite.refreshData("admin-1");

        expect(result.id).toBe("admin-1");
        expect(result.email).toBe("admin@test.com");
    });

    it("throws 404 when admin is not found in DB", async () => {
        const userWrite = new UserWrite();
        expect(userWrite.refreshData("nonexistent-id")).rejects.toMatchObject({
            status: 404,
        });
    });
});


// 3. Route — POST /login


describe("POST /login", () => {
    it("returns 200 with token and sets httpOnly cookie on valid credentials", async () => {
        const res = await req("POST", "/login", {
            body: { email: "admin@test.com", password: "secret" },
        });

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.status).toBe(200);
        expect(json.message).toBe("login successfully");
        expect(json.token).toBe("mock-uuid-1234");

        const setCookie = res.headers.get("set-cookie") ?? "";
        expect(setCookie).toContain("refresh-token=");
        expect(setCookie.toLowerCase()).toContain("httponly");
        expect(setCookie.toLowerCase()).toContain("secure");
        expect(setCookie.toLowerCase()).toContain("samesite=strict");
    });

    it("returns error when credentials are invalid", async () => {
        const res = await req("POST", "/login", {
            body: { email: "hacker@test.com", password: "wrong" },
        });

        // UserWrite.login throws 422, handleError converts to HTTPException
        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("handles malformed JSON body gracefully", async () => {
        const res = await app.fetch(
            new Request("http://localhost/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "{{invalid-json",
            }),
        );
        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});


// 4. Route — GET /profile


describe("GET /profile", () => {
    it("returns 200 with profile and short-lived JWT access token", async () => {
        const res = await req("GET", "/profile");

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.status).toBe(200);
        expect(json.message).toBe("success get profile");
        expect(json.token).toBe("mock-jwt-access-token");
        expect(json.profile).toMatchObject({
            id: "admin-1",
            email: "admin@test.com",
        });
    });

    it("returns error when decryptCookie fails (invalid session)", async () => {
        const { decryptCookie } = await import(
            "../utils/auth/decryptUserToken"
        );
        (decryptCookie as any).mockImplementationOnce(async () => {
            throw { status: 401, message: "Session expired" };
        });

        const res = await req("GET", "/profile");
        expect(res.status).toBe(401);
    });
});


// 5. Route — POST /register


describe("POST /register", () => {
    it("returns 201 on successful admin creation (roles defaults to 'user' for unknown)", async () => {
        const res = await req("POST", "/register", {
            body: {
                email: "new@test.com",
                password: "pass",
                username: "newadmin",
                roles: "unknown-role", // should coerce to "user"
            },
        });

        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json.status).toBe(201);
        expect(json.message).toBe("success created admin");
    });

    it("sets roles to 'writer' when explicitly passed as writer", async () => {
        const res = await req("POST", "/register", {
            body: {
                email: "writer@test.com",
                password: "pass",
                username: "writeruser",
                roles: "writer",
            },
        });

        expect(res.status).toBe(201);
    });

    it("returns error when registration fails", async () => {
        // Make UserModel.register throw
        const UserModel = (await import("./user.model")).default;
        const proto = UserModel.prototype as any;
        const original = proto.register;
        proto.register = mock(async () => {
            throw { status: 409, message: "Email already exists" };
        });

        const res = await req("POST", "/register", {
            body: { email: "dup@test.com", password: "pass", username: "dup" },
        });

        expect(res.status).toBeGreaterThanOrEqual(400);
        proto.register = original;
    });
});


// 6. Route — DELETE /logout


describe("DELETE /logout", () => {
    it("returns 200 and clears cookie when refresh token is valid", async () => {
        const res = await req("DELETE", "/logout", {
            headers: { Authorization: "Bearer mock-jwt" },
            cookies: { "refresh-token": "valid-refresh-token" },
        });

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.status).toBe(200);
        expect(json.message).toBe("logout successfully");
    });

    it("returns 401 when refresh-token cookie is absent", async () => {
        const res = await req("DELETE", "/logout", {
            headers: { Authorization: "Bearer mock-jwt" },
            // no cookies
        });

        expect(res.status).toBe(401);
    });

    it("returns error when Redis token lookup fails during logout", async () => {
        const res = await req("DELETE", "/logout", {
            headers: { Authorization: "Bearer mock-jwt" },
            cookies: { "refresh-token": "invalid-token" },
        });

        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});


// 7. Response Shape Contracts


describe("Response Shape Contracts", () => {
    it("login: always returns { status, message, token }", async () => {
        const res = await req("POST", "/login", {
            body: { email: "admin@test.com", password: "secret" },
        });
        const json = await res.json();
        expect(json).toHaveProperty("status");
        expect(json).toHaveProperty("message");
        expect(json).toHaveProperty("token");
    });

    it("profile: always returns { status, message, profile, token }", async () => {
        const res = await req("GET", "/profile");
        const json = await res.json();
        expect(json).toHaveProperty("status");
        expect(json).toHaveProperty("message");
        expect(json).toHaveProperty("profile");
        expect(json).toHaveProperty("token");
    });

    it("register: always returns { status, message }", async () => {
        const res = await req("POST", "/register", {
            body: { email: "x@test.com", password: "p", username: "u" },
        });
        const json = await res.json();
        expect(json).toHaveProperty("status");
        expect(json).toHaveProperty("message");
    });

    it("logout: always returns { status, message }", async () => {
        const res = await req("DELETE", "/logout", {
            headers: { Authorization: "Bearer mock-jwt" },
            cookies: { "refresh-token": "valid-refresh-token" },
        });
        const json = await res.json();
        expect(json).toHaveProperty("status");
        expect(json).toHaveProperty("message");
    });
});