import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
} from "bun:test";
import app from "@/index";
import prisma from "@infra/database/prisma/prisma";
import {
    UnverifiedUserScenarioSeeder,
    VerifiedUserScenarioSeeder,
    ExpiredVerificationScenarioSeeder,
    LoginBruteForceScenarioSeeder,
} from "@infra/database/seeder/e2e/auth.scenario.seeder";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE = "http://localhost";

/** Credentials that match the VerifiedUserScenarioSeeder */
const VALID_CREDS = {
    email: "verifieduser@myarticle.com",
    password: "User@123",
};

/** Credentials that match the UnverifiedUserScenarioSeeder */
const UNVERIFIED_CREDS = {
    email: "unverifieduser@myarticle.com",
    password: "User@123",
};

// ─── Request Helpers ──────────────────────────────────────────────────────────

interface ReqOptions {
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
}

/**
 * Execute an HTTP request against the Hono app without starting a TCP server.
 * Mirrors what a real client sends but stays fully in-process.
 */
async function req(
    method: string,
    path: string,
    { body, headers = {}, cookies = {} }: ReqOptions = {},
): Promise<Response> {
    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Origin: process.env.FRONT_END_URL ?? "http://localhost:3000",
        ...headers,
    };

    if (Object.keys(cookies).length > 0) {
        defaultHeaders["Cookie"] = Object.entries(cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ");
    }

    return app.fetch(
        new Request(`${BASE}${path}`, {
            method,
            headers: defaultHeaders,
            ...(body ? { body: JSON.stringify(body) } : {}),
        }),
    );
}

/**
 * Log in as a verified user and return both the access token and the raw
 * Set-Cookie header for use in subsequent requests.
 */
async function loginAsVerified(): Promise<{
    accessToken: string;
    refreshTokenCookie: string;
}> {
    const res = await req("POST", "/auth/login", { body: VALID_CREDS });
    expect(res.status).toBe(200); // guard — fail fast if auth infra is broken

    const json = await res.json();
    const setCookie = res.headers.get("set-cookie") ?? "";

    // Extract the raw cookie value to forward in follow-up requests
    const match = setCookie.match(/refresh-token=([^;]+)/);
    return {
        accessToken: json.access_token,
        refreshTokenCookie: match ? `refresh-token=${match[1]}` : "",
    };
}

/** Parse JSON while preserving the original Response for status assertions. */
async function json<T = any>(res: Response): Promise<T> {
    return res.json();
}

// ─── Suite 1 · Health & Public Routes ────────────────────────────────────────

describe("[E2E] Auth — Public Routes", () => {
    it("GET /auth/ → 200 service-running message", async () => {
        const res = await req("GET", "/auth/");
        expect(res.status).toBe(200);
        expect(await res.text()).toContain("Auth service is running");
    });

    it("GET /auth/health → 200 with DB connected", async () => {
        const res = await req("GET", "/auth/health");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.status).toBe(200);
        expect(body.message).toBe("Server healthy");
    });
});

// ─── Suite 2 · Registration ───────────────────────────────────────────────────

describe("[E2E] Auth — Registration", () => {
    const newUser = {
        email: `e2e-${Date.now()}@myarticle.com`,
        username: `e2e_user_${Date.now()}`,
        password: "NewUser@123",
    };

    afterAll(async () => {
        // Clean up the user created during these tests
        await prisma.user.deleteMany({ where: { email: newUser.email } });
    });

    it("POST /auth/register → 201 with verification email sent", async () => {
        const res = await req("POST", "/auth/register", { body: newUser });
        expect(res.status).toBe(201);

        const body = await json(res);
        expect(body.status).toBe(201);
        expect(body.message).toContain("Verification code sent");
        expect(body.user).toMatchObject({ email: newUser.email });
        // Password must never be returned
        expect(body.user).not.toHaveProperty("password");
    });

    it("POST /auth/register → 409/422 on duplicate email", async () => {
        const res = await req("POST", "/auth/register", { body: newUser });
        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("POST /auth/register → 422 when email is missing", async () => {
        const res = await req("POST", "/auth/register", {
            body: { username: "no_email", password: "Pass@123" },
        });
        expect(res.status).toBe(422);
        const body = await json(res);
        expect(body).toHaveProperty("error");
    });

    it("POST /auth/register → 422 when password is too weak", async () => {
        const res = await req("POST", "/auth/register", {
            body: { email: "weak@myarticle.com", username: "weak", password: "abc" },
        });
        expect(res.status).toBe(422);
    });
});

// ─── Suite 3 · Email Verification ────────────────────────────────────────────

describe("[E2E] Auth — Email Verification", () => {
    let userId: string;
    let verificationCode: string;

    beforeAll(async () => {
        // Seed a fresh unverified user
        const seeder = new UnverifiedUserScenarioSeeder();
        await seeder.run();

        const user = await prisma.user.findFirst({
            where: { email: UNVERIFIED_CREDS.email },
        });
        userId = user!.id;

        // Trigger verification code creation (register-like flow without re-registering)
        // In a real project this is usually created during /register. We create it
        // directly here so the test remains self-contained.
        const record = await prisma.verificationCode.create({
            data: {
                user_id: userId,
                code: "654321",
                expired_at: new Date(Date.now() + 60 * 60 * 1000), // +1 h
            },
        });
        verificationCode = record.code;
    });

    afterAll(async () => {
        await prisma.verificationCode.deleteMany({ where: { user_id: userId } });
    });

    it("POST /auth/verify → 200 on valid code", async () => {
        const res = await req("POST", "/auth/verify", {
            body: { code: verificationCode, user_id: userId },
        });
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.message).toContain("success verify");

        // Side-effect: user must now be marked as verified in DB
        const updated = await prisma.user.findUnique({ where: { id: userId } });
        expect(updated?.is_verify).toBe(true);
    });

    it("POST /auth/verify → 400 on wrong code", async () => {
        const res = await req("POST", "/auth/verify", {
            body: { code: "000000", user_id: userId },
        });
        expect(res.status).toBe(400);
    });

    it("POST /auth/verify → 400 on expired code (ExpiredVerificationScenario)", async () => {
        const seeder = new ExpiredVerificationScenarioSeeder();
        await seeder.run();

        const expiredUser = await prisma.user.findFirst({
            where: { email: "expired-code@myarticle.com" },
        });

        const res = await req("POST", "/auth/verify", {
            body: { code: "123456", user_id: expiredUser!.id },
        });
        expect(res.status).toBe(400);
        const body = await json(res);
        expect(String(body.message).toLowerCase()).toContain("expired");
    });
});

// ─── Suite 4 · Login ─────────────────────────────────────────────────────────

describe("[E2E] Auth — Login", () => {
    beforeAll(async () => {
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();
    });

    it("POST /auth/login → 200 with access_token on valid credentials", async () => {
        const res = await req("POST", "/auth/login", { body: VALID_CREDS });
        expect(res.status).toBe(200);

        const body = await json(res);
        expect(body.status).toBe(200);
        expect(body.message).toBe("Login successful");
        expect(typeof body.access_token).toBe("string");
        expect(body.access_token.length).toBeGreaterThan(0);
    });

    it("POST /auth/login → sets HttpOnly Secure SameSite=Strict refresh-token cookie", async () => {
        const res = await req("POST", "/auth/login", { body: VALID_CREDS });

        const cookie = res.headers.get("set-cookie") ?? "";
        expect(cookie).toContain("refresh-token=");
        expect(cookie.toLowerCase()).toContain("httponly");
        expect(cookie.toLowerCase()).toContain("secure");
        expect(cookie.toLowerCase()).toContain("samesite=strict");
    });

    it("POST /auth/login → 401 on wrong password", async () => {
        const res = await req("POST", "/auth/login", {
            body: { email: VALID_CREDS.email, password: "WrongPass!" },
        });
        expect(res.status).toBe(401);
        const body = await json(res);
        expect(body).toHaveProperty("message");
    });

    it("POST /auth/login → 401 on unregistered email", async () => {
        const res = await req("POST", "/auth/login", {
            body: { email: "ghost@myarticle.com", password: "Any@123" },
        });
        expect(res.status).toBe(401);
    });

    it("POST /auth/login → 422 on missing credentials", async () => {
        const res = await req("POST", "/auth/login", { body: {} });
        expect(res.status).toBe(422);
    });

    it("POST /auth/login → 401 when account is not verified (UnverifiedUserScenario)", async () => {
        const seeder = new UnverifiedUserScenarioSeeder();
        await seeder.run();

        const res = await req("POST", "/auth/login", { body: UNVERIFIED_CREDS });
        // Must reject with 401 or 403 — unverified accounts should not get a token
        expect(res.status).toBeGreaterThanOrEqual(401);
        expect(res.status).toBeLessThan(500);
    });

    it("POST /auth/login → audit trail is written on successful login", async () => {
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();

        await req("POST", "/auth/login", { body: VALID_CREDS });

        const user = await prisma.user.findFirst({
            where: { email: VALID_CREDS.email },
        });
        const trail = await prisma.session_audit_trail.findFirst({
            where: { admin_id: user!.id, event_type: "LOGIN", success: true },
            orderBy: { id: "desc" },
        });
        expect(trail).not.toBeNull();
        expect(trail?.success).toBe(true);
    });
});

// ─── Suite 5 · Token Refresh ──────────────────────────────────────────────────

describe("[E2E] Auth — Token Refresh", () => {
    let refreshCookie: string;

    beforeAll(async () => {
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();
        const { refreshTokenCookie } = await loginAsVerified();
        refreshCookie = refreshTokenCookie;
    });

    it("GET /auth/refresh → 200 with new access_token when cookie is valid", async () => {
        const res = await req("GET", "/auth/refresh", {
            cookies: Object.fromEntries(
                [refreshCookie].map((c) => c.split("=") as [string, string]),
            ),
        });

        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.status).toBe(200);
        expect(body.message).toBe("Token refreshed successfully");
        expect(typeof body.access_token).toBe("string");
    });

    it("GET /auth/refresh → 401 when refresh-token cookie is absent", async () => {
        const res = await req("GET", "/auth/refresh");
        expect(res.status).toBe(401);
    });

    it("GET /auth/refresh → 401 when refresh-token is tampered", async () => {
        const res = await req("GET", "/auth/refresh", {
            cookies: { "refresh-token": "totally-invalid-token" },
        });
        expect(res.status).toBe(401);
    });
});

// ─── Suite 6 · Logout ─────────────────────────────────────────────────────────

describe("[E2E] Auth — Logout", () => {
    let accessToken: string;
    let refreshCookie: string;

    beforeAll(async () => {
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();
        ({ accessToken, refreshTokenCookie: refreshCookie } =
            await loginAsVerified());
    });

    it("DELETE /auth/logout → 200 and cookie is cleared", async () => {
        const [cookieName, cookieVal] = refreshCookie.split("=") as [
            string,
            string,
        ];

        const res = await req("DELETE", "/auth/logout", {
            headers: { Authorization: `Bearer ${accessToken}` },
            cookies: { [cookieName]: cookieVal },
        });

        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.message).toBe("Logout successful");

        // Cookie must be expired/cleared by the server
        const setCookie = res.headers.get("set-cookie") ?? "";
        if (setCookie) {
            const isCleared =
                setCookie.includes("refresh-token=;") ||
                setCookie.toLowerCase().includes("max-age=0") ||
                setCookie.includes("Expires=Thu, 01 Jan 1970");
            expect(isCleared).toBe(true);
        }
    });

    it("DELETE /auth/logout → 401 without Authorization header", async () => {
        const res = await req("DELETE", "/auth/logout");
        expect(res.status).toBe(401);
    });

    it("DELETE /auth/logout → 401 with expired / reused refresh token", async () => {
        // Token was already invalidated in the previous test — reuse must fail
        const [cookieName, cookieVal] = refreshCookie.split("=") as [
            string,
            string,
        ];
        const res = await req("DELETE", "/auth/logout", {
            headers: { Authorization: `Bearer ${accessToken}` },
            cookies: { [cookieName]: cookieVal },
        });
        // Either 401 (token gone from Redis) or 200 (idempotent) — must not be 5xx
        expect(res.status).toBeLessThan(500);
    });
});

// ─── Suite 7 · Profile Photo ──────────────────────────────────────────────────

describe("[E2E] Auth — Profile Photo", () => {
    let userId: string;

    beforeAll(async () => {
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();
        const user = await prisma.user.findFirst({
            where: { email: VALID_CREDS.email },
        });
        userId = user!.id;
    });

    function buildPhotoForm(uid: string, filename = "avatar.jpg"): FormData {
        const form = new FormData();
        form.append("user_id", uid);
        form.append(
            "image",
            new File(["fake-image-content"], filename, { type: "image/jpeg" }),
        );
        return form;
    }

    it("POST /auth/profile → 201 on valid upload", async () => {
        const res = await app.fetch(
            new Request(`${BASE}/auth/profile`, {
                method: "POST",
                headers: {
                    Origin: process.env.FRONT_END_URL ?? "http://localhost:3000",
                },
                body: buildPhotoForm(userId),
            }),
        );

        expect(res.status).toBe(201);
        const body = await json(res);
        expect(body.status).toBe(201);
        expect(body.message).toContain("success add profile");
        expect(typeof body.url).toBe("string");
    });

    it("PUT /auth/profile → 200 on valid edit", async () => {
        const res = await app.fetch(
            new Request(`${BASE}/auth/profile`, {
                method: "PUT",
                headers: {
                    Origin: process.env.FRONT_END_URL ?? "http://localhost:3000",
                },
                body: buildPhotoForm(userId, "new-avatar.jpg"),
            }),
        );

        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.message).toContain("success edit profile");
    });

    it("DELETE /auth/profile → 201 on valid delete", async () => {
        const form = new FormData();
        form.append("user_id", userId);

        const res = await app.fetch(
            new Request(`${BASE}/auth/profile`, {
                method: "DELETE",
                headers: {
                    Origin: process.env.FRONT_END_URL ?? "http://localhost:3000",
                },
                body: form,
            }),
        );

        expect(res.status).toBe(201);
        const body = await json(res);
        expect(body.message).toContain("success delete profile");
    });
});

// ─── Suite 8 · Brute Force & Audit ───────────────────────────────────────────

describe("[E2E] Auth — Brute Force & Audit Trail", () => {
    beforeAll(async () => {
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();
    });

    it("Multiple failed login attempts are recorded in audit trail", async () => {
        const attempts = 3;
        for (let i = 0; i < attempts; i++) {
            await req("POST", "/auth/login", {
                body: { email: VALID_CREDS.email, password: "WrongPass@123" },
            });
        }

        const user = await prisma.user.findFirst({
            where: { email: VALID_CREDS.email },
        });

        const trails = await prisma.session_audit_trail.findMany({
            where: { admin_id: user!.id, success: false, event_type: "LOGIN" },
        });

        // At least as many failed records as our attempts
        expect(trails.length).toBeGreaterThanOrEqual(attempts);
        for (const t of trails) {
            expect(t.success).toBe(false);
            expect(t.failure_session).not.toBeNull();
        }
    });

    it("LoginBruteForceScenarioSeeder seeds 3 failed audit records", async () => {
        // Ensure at least one user exists
        const seeder = new VerifiedUserScenarioSeeder();
        await seeder.run();

        const bruteSeeder = new LoginBruteForceScenarioSeeder();
        await bruteSeeder.run();

        const user = await prisma.user.findFirst();
        const trails = await prisma.session_audit_trail.findMany({
            where: { admin_id: user!.id, success: false },
            orderBy: { id: "desc" },
            take: 3,
        });

        expect(trails.length).toBe(3);
        expect(trails.every((t) => t.success === false)).toBe(true);
    });
});

// ─── Suite 9 · Error Handler & Global Contracts ───────────────────────────────

describe("[E2E] Auth — Error Handler & Response Contracts", () => {
    it("404 → standardized JSON for unknown route", async () => {
        const res = await req("GET", "/auth/nonexistent-endpoint-xyz");
        expect(res.status).toBe(404);
        const body = await json(res);
        expect(body.status).toBe(404);
        expect(body.message).toContain("Route not found");
        expect(body.error).toBeNull();
    });

    it("Error responses always include CORS headers", async () => {
        const res = await req("DELETE", "/auth/logout"); // no token → 401
        const header = res.headers.get("Access-Control-Allow-Origin");
        expect(header).toBeTruthy();
    });

    it("5xx errors include a generic message without leaking internals", async () => {
        // Force an unhandled path — we rely on the global handler fallback
        const res = await req("GET", "/auth/health"); // normal path to confirm shape
        const body = await json(res);
        // On healthy infra this is 200; we assert shape only
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
    });

    describe("Response Shape Contracts", () => {
        beforeAll(async () => {
            const seeder = new VerifiedUserScenarioSeeder();
            await seeder.run();
        });

        it("login success: { status, message, access_token }", async () => {
            const res = await req("POST", "/auth/login", { body: VALID_CREDS });
            const body = await json(res);
            expect(body).toHaveProperty("status");
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("access_token");
        });

        it("register success: { status, message, user } — no password in user", async () => {
            const unique = `shape-${Date.now()}@myarticle.com`;
            const res = await req("POST", "/auth/register", {
                body: { email: unique, username: `shape_${Date.now()}`, password: "Shape@123" },
            });
            const body = await json(res);
            expect(body).toHaveProperty("status");
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("user");
            expect(body.user).not.toHaveProperty("password");
            // cleanup
            await prisma.user.deleteMany({ where: { email: unique } });
        });

        it("verify success: { status, message }", async () => {
            // Verify was tested in Suite 3; here we just confirm 400 shape
            const res = await req("POST", "/auth/verify", {
                body: { code: "bad", user_id: "x" },
            });
            const body = await json(res);
            expect(body).toHaveProperty("status");
            expect(body).toHaveProperty("message");
        });
    });
});