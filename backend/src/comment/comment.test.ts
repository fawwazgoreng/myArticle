import { describe, it, expect, mock } from "bun:test";

// ---------------------------------------------------------------------------
// Module Mocks — must be declared before importing the route
// ---------------------------------------------------------------------------

// --- ReadComment ---
mock.module("@/comment/comment.read", () => ({
    default: class MockReadComment {
        show = mock(async (query: any) => {
            // Simulate empty result for unknown articleId
            if (query.articleId === 99999) {
                return { comment: [], meta: { total: 0, page: 1 } };
            }
            return {
                comment: [
                    {
                        id: 1,
                        content: "First comment",
                        article_id: query.articleId ?? 1,
                        user_id: "user-1",
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        content: "Second comment",
                        article_id: query.articleId ?? 1,
                        user_id: "user-2",
                        created_at: new Date().toISOString(),
                    },
                ],
                meta: { total: 2, page: query.page ?? 1 },
            };
        });

        findById = mock(async (id: number) => {
            if (id === 99999) {
                throw { status: 404, message: "Comment not found", error: "NOT_FOUND" };
            }
            return {
                id,
                content: "Mock comment content",
                article_id: 1,
                user_id: "user-1",
                created_at: new Date().toISOString(),
            };
        });
    },
}));

// --- WriteComment ---
mock.module("@/comment/comment.write", () => ({
    default: class MockWriteComment {
        create = mock(async (body: any) => {
            if (!body?.content || body.content.trim() === "") {
                throw { status: 422, message: "Validation failed", error: "content is required" };
            }
            if (!body?.article_id) {
                throw { status: 422, message: "Validation failed", error: "article_id is required" };
            }
            return {
                id: 99,
                content: body.content,
                article_id: body.article_id,
                user_id: body.user_id ?? "user-1",
                created_at: new Date().toISOString(),
            };
        });

        delete = mock(async (id: number) => {
            if (id === 99999) {
                throw { status: 404, message: "Comment not found", error: "NOT_FOUND" };
            }
            return { id };
        });

        update = mock(async (id: number, body: any) => {
            if (id === 99999) {
                throw { status: 404, message: "Comment not found", error: "NOT_FOUND" };
            }
            return {
                id,
                content: body.content ?? "Updated content",
                article_id: body.article_id ?? 1,
                user_id: "user-1",
                created_at: new Date().toISOString(),
            };
        });
    },
}));

// --- Auth middleware ---
mock.module("@utils/auth/jwtauth", () => ({
    checkToken: mock(async (c: any, next: any) => {
        const auth = c.req.header("Authorization");
        if (!auth || !auth.startsWith("Bearer valid-")) {
            const { HTTPException } = require("hono/http-exception");
            throw new HTTPException(401, { message: "Unauthorized" });
        }
        await next();
    }),
}));

// --- handleError ---
mock.module("@utils/error/separated", () => ({
    handleError: mock((err: any) => {
        const { HTTPException } = require("hono/http-exception");
        const status = err?.status ?? 500;
        return new HTTPException(status, {
            message: err?.message || "Internal server error",
        });
    }),
}));

// ---------------------------------------------------------------------------
// Import subject AFTER mocks
// ---------------------------------------------------------------------------
import commentApp from "@/comment/comment.route"; // adjust path if needed

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const BASE = "http://localhost";

const validAuthHeader = {
    "Content-Type": "application/json",
    "Origin": "http://localhost:3000",
    "Authorization": "Bearer valid-token",
};

const noAuthHeader = {
    "Content-Type": "application/json",
    "Origin": "http://localhost:3000",
};

async function req(
    method: string,
    path: string,
    opts: {
        body?: Record<string, any>;
        headers?: Record<string, string>;
        query?: Record<string, string | number>;
    } = {},
) {
    let url = `${BASE}${path}`;

    if (opts.query) {
        const params = new URLSearchParams(
            Object.entries(opts.query).map(([k, v]) => [k, String(v)]),
        );
        url += `?${params.toString()}`;
    }

    const init: RequestInit = {
        method,
        headers: opts.headers ?? noAuthHeader,
    };

    if (opts.body) init.body = JSON.stringify(opts.body);

    return commentApp.fetch(new Request(url, init));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Comment Unit Tests", () => {

    // ── GET /comment ─────────────────────────────────────────────────────────

    describe("GET /comment — list with pagination & filters", () => {
        it("returns 200 with array of comments and meta (no auth required)", async () => {
            const res = await req("GET", "/comment", {
                query: { page: 1, articleId: 1, time: "newest" },
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.status).toBe(200);
            expect(json.message).toBe("success get comment");
            expect(Array.isArray(json.comment)).toBe(true);
            expect(json).toHaveProperty("meta");
        });

        it("returns 200 with empty array when articleId has no comments", async () => {
            const res = await req("GET", "/comment", {
                query: { page: 1, articleId: 99999 },
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.comment).toHaveLength(0);
            expect(json.meta.total).toBe(0);
        });

        it("returns 200 without any query params (defaults applied)", async () => {
            const res = await req("GET", "/comment");

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(Array.isArray(json.comment)).toBe(true);
        });

        it("returns comments filtered by time=oldest", async () => {
            const res = await req("GET", "/comment", {
                query: { page: 1, articleId: 1, time: "oldest" },
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(Array.isArray(json.comment)).toBe(true);
        });

        it("each comment item has id, content, article_id fields", async () => {
            const res = await req("GET", "/comment", {
                query: { articleId: 1 },
            });

            const json = await res.json();
            for (const c of json.comment) {
                expect(c).toHaveProperty("id");
                expect(c).toHaveProperty("content");
                expect(c).toHaveProperty("article_id");
            }
        });
    });

    // ── GET /comment/:id ─────────────────────────────────────────────────────

    describe("GET /comment/:id — find by ID", () => {
        it("returns 200 with correct comment when ID exists", async () => {
            const res = await req("GET", "/comment/1");

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.status).toBe(200);
            expect(json.message).toBe("success find comment");
            expect(json.comment).toHaveProperty("id", 1);
        });

        it("returns 404 when comment ID does not exist", async () => {
            const res = await req("GET", "/comment/99999");

            expect(res.status).toBe(404);
            const json = await res.json();
            expect(String(json.message).toLowerCase()).toContain("not found");
        });

        it("returns comment with all required fields", async () => {
            const res = await req("GET", "/comment/2");
            const json = await res.json();

            expect(json.comment).toHaveProperty("id");
            expect(json.comment).toHaveProperty("content");
            expect(json.comment).toHaveProperty("article_id");
            expect(json.comment).toHaveProperty("created_at");
        });
    });

    // ── POST /comment — create ────────────────────────────────────────────────

    describe("POST /comment — create", () => {
        it("returns 201 with new comment data on valid payload", async () => {
            const res = await req("POST", "/comment", {
                headers: validAuthHeader,
                body: { content: "Great article!", article_id: 1 },
            });

            expect(res.status).toBe(201);
            const json = await res.json();
            expect(json.status).toBe(201);
            expect(json.message).toBe("success create comment");
            expect(json.comment).toHaveProperty("content", "Great article!");
            expect(json.comment).toHaveProperty("article_id", 1);
        });

        it("returns 401 when Authorization header is absent", async () => {
            const res = await req("POST", "/comment", {
                headers: noAuthHeader,
                body: { content: "No auth comment", article_id: 1 },
            });

            expect(res.status).toBe(401);
        });

        it("returns 401 when token is invalid", async () => {
            const res = await req("POST", "/comment", {
                headers: { ...noAuthHeader, Authorization: "Bearer bad-token" },
                body: { content: "Bad token", article_id: 1 },
            });

            expect(res.status).toBe(401);
        });

        it("returns 422 when content is empty", async () => {
            const res = await req("POST", "/comment", {
                headers: validAuthHeader,
                body: { content: "", article_id: 1 },
            });

            expect(res.status).toBe(422);
            const json = await res.json();
            expect(json).toHaveProperty("error");
        });

        it("returns 422 when article_id is missing", async () => {
            const res = await req("POST", "/comment", {
                headers: validAuthHeader,
                body: { content: "Missing article id" },
            });

            expect(res.status).toBe(422);
        });
    });

    // ── DELETE /comment/:id ───────────────────────────────────────────────────

    describe("DELETE /comment/:id — delete", () => {
        it("returns 200 with success message on valid deletion", async () => {
            const res = await req("DELETE", "/comment/1", {
                headers: validAuthHeader,
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.status).toBe(200);
            expect(json.message).toBe("deleted comment successfully");
        });

        it("returns 404 when comment does not exist", async () => {
            const res = await req("DELETE", "/comment/99999", {
                headers: validAuthHeader,
            });

            expect(res.status).toBe(404);
        });

        it("returns 401 when deleting without auth token", async () => {
            const res = await req("DELETE", "/comment/1", {
                headers: noAuthHeader,
            });

            expect(res.status).toBe(401);
        });
    });

    // ── PUT /comment/:id — update ─────────────────────────────────────────────

    describe("PUT /comment/:id — update", () => {
        it("returns 200 with updated comment data", async () => {
            const res = await req("PUT", "/comment/1", {
                headers: validAuthHeader,
                body: { content: "Updated comment content", article_id: 1 },
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.status).toBe(200);
            expect(json.comment).toHaveProperty("id", 1);
            expect(json.comment).toHaveProperty("content", "Updated comment content");
        });

        it("returns 404 when comment to update does not exist", async () => {
            const res = await req("PUT", "/comment/99999", {
                headers: validAuthHeader,
                body: { content: "Ghost update" },
            });

            expect(res.status).toBe(404);
        });

        it("returns 401 when updating without auth token", async () => {
            const res = await req("PUT", "/comment/1", {
                headers: noAuthHeader,
                body: { content: "No auth update" },
            });

            expect(res.status).toBe(401);
        });

        it("returns 401 when token is invalid", async () => {
            const res = await req("PUT", "/comment/1", {
                headers: { ...noAuthHeader, Authorization: "Bearer expired-token" },
                body: { content: "Bad token update" },
            });

            expect(res.status).toBe(401);
        });
    });

    // ── Response Shape Contracts ───────────────────────────────────────────────

    describe("Response Shape Contracts", () => {
        it("GET /comment: always returns { status, message, comment[], meta }", async () => {
            const res = await req("GET", "/comment", { query: { articleId: 1 } });
            const json = await res.json();

            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
            expect(json).toHaveProperty("comment");
            expect(json).toHaveProperty("meta");
            expect(Array.isArray(json.comment)).toBe(true);
        });

        it("GET /comment/:id: always returns { status, message, comment }", async () => {
            const res = await req("GET", "/comment/1");
            const json = await res.json();

            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
            expect(json).toHaveProperty("comment");
            expect(typeof json.comment).toBe("object");
        });

        it("POST /comment: always returns { status, message, comment }", async () => {
            const res = await req("POST", "/comment", {
                headers: validAuthHeader,
                body: { content: "Contract test comment", article_id: 1 },
            });
            const json = await res.json();

            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
            expect(json).toHaveProperty("comment");
        });

        it("DELETE /comment/:id: always returns { status, message }", async () => {
            const res = await req("DELETE", "/comment/2", {
                headers: validAuthHeader,
            });
            const json = await res.json();

            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
        });

        it("PUT /comment/:id: always returns { status, message, comment }", async () => {
            const res = await req("PUT", "/comment/2", {
                headers: validAuthHeader,
                body: { content: "Contract update", article_id: 1 },
            });
            const json = await res.json();

            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
            expect(json).toHaveProperty("comment");
        });
    });
});