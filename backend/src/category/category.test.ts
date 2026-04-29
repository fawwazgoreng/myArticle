import { describe, it, expect, mock,  } from "bun:test";

// --- Prisma ---
mock.module("../src/infrastructure/database/prisma/prisma", () => ({
    default: {
        category: {
            findFirst: mock(async (opts?: any) => {
                if (opts?.orderBy?.id === "desc") {
                    return { id: 5, name: "science" };
                }
                return { id: 1, name: "politics" };
            }),
            create: mock(async (data: any) => ({
                id: 99,
                name: data.data.name,
            })),
            findMany: mock(async () => [
                { id: 1, name: "politics" },
                { id: 2, name: "economy" },
                { id: 3, name: "health" },
            ]),
            findUnique: mock(async ({ where }: any) => {
                const db: Record<number, { id: number; name: string }> = {
                    1: { id: 1, name: "politics" },
                    2: { id: 2, name: "economy" },
                    3: { id: 3, name: "health" },
                };
                return db[where.id] ?? null;
            }),
            delete: mock(async ({ where }: any) => {
                if (where.id === 999999) throw { code: "P2025" };
                return { id: where.id, name: "deleted-category" };
            }),
        },
    },
}));

// --- CategoryModel (DB layer) ---
mock.module("../src/category/category.model", () => ({
    default: class MockCategoryModel {
        create = mock(async (name: string) => {
            if (!name || name.trim() === "") {
                throw { status: 422, message: "Validation failed", error: "name is required" };
            }
            if (name === "politics") {
                // first call creates; second call is duplicate
                const seen = (MockCategoryModel as any)._seen ?? new Set();
                (MockCategoryModel as any)._seen = seen;
                if (seen.has(name)) {
                    throw { status: 409, message: "Category already exists", error: "DUPLICATE" };
                }
                seen.add(name);
            }
            return { id: 99, name };
        });

        findAll = mock(async () => [
            { id: 1, name: "politics" },
            { id: 2, name: "economy" },
            { id: 3, name: "health" },
        ]);

        findById = mock(async (id: number) => {
            const db: Record<number, { id: number; name: string }> = {
                1: { id: 1, name: "politics" },
                2: { id: 2, name: "economy" },
            };
            if (!db[id]) throw { status: 404, message: "Category not found", error: "NOT_FOUND" };
            return db[id];
        });

        delete = mock(async (id: number) => {
            if (id === 999999) throw { status: 404, message: "Category not found", error: "NOT_FOUND" };
            return { id, name: "deleted" };
        });
    },
}));

// --- CategoryValidate ---
mock.module("../src/category/category.validate", () => ({
    CategoryValidate: class MockCategoryValidate {
        create = mock((body: any) => {
            if (!body?.name || body.name.trim() === "") {
                throw { status: 422, message: "Validation failed", error: "name must not be empty" };
            }
            return { name: body.name };
        });
    },
}));

// --- Auth middleware ---
mock.module("../src/utils/auth/jwtauth", () => ({
    checkToken: mock(async (c: any, next: any) => {
        const auth = c.req.header("Authorization");
        if (!auth || !auth.startsWith("Bearer valid-")) {
            const { HTTPException } = require("hono/http-exception");
            throw new HTTPException(401, { message: "Unauthorized" });
        }
        await next();
    }),
    signToken: mock(async (_user: any) => "mock-access-token"),
    getUserHasUsed: mock(async () => ({ ip_address: "127.0.0.1", device_type: "desktop", event_type: "test" })),
}));

// --- handleError ---
mock.module("../src/utils/error/separated", () => ({
    handleError: mock((err: any) => {
        const { HTTPException } = require("hono/http-exception");
        const status = err?.status ?? 500;
        return new HTTPException(status, { message: err?.message || "Internal server error" });
    }),
}));

// --- Config ---
mock.module("../src/config", () => ({
    env: { FRONT_END_URL: "http://localhost:3000" },
}));


// Import subject AFTER mocks

import categoryApp from "./category.route"; // adjust path


// Helpers

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
    } = {},
) {
    const init: RequestInit = {
        method,
        headers: opts.headers ?? noAuthHeader,
    };
    if (opts.body) init.body = JSON.stringify(opts.body);
    return categoryApp.fetch(new Request(`${BASE}${path}`, init));
}


// Tests


describe("Category Unit Tests", () => {

    // ── POST /category ──────────────────────────────────────────────────────

    describe("POST /category — create", () => {
        it("returns 201 with success message on valid payload", async () => {
            const res = await req("POST", "/category", {
                headers: validAuthHeader,
                body: { name: "economy" },
            });

            expect(res.status).toBe(201);
            const json = await res.json();
            expect(json.message).toContain("success");
        });

        it("creates multiple categories consistently", async () => {
            const names = ["health", "international", "sports", "space"];

            for (const name of names) {
                const res = await req("POST", "/category", {
                    headers: validAuthHeader,
                    body: { name },
                });
                expect(res.status).toBe(201);
                const json = await res.json();
                expect(json.message).toContain("success");
            }
        });

        it("returns 422 when name is empty string", async () => {
            const res = await req("POST", "/category", {
                headers: validAuthHeader,
                body: { name: "" },
            });

            expect(res.status).toBe(422);
            const json = await res.json();
            expect(json).toHaveProperty("error");
        });

        it("returns 422 when body is missing name field", async () => {
            const res = await req("POST", "/category", {
                headers: validAuthHeader,
                body: {},
            });

            expect(res.status).toBe(422);
            const json = await res.json();
            expect(json).toHaveProperty("error");
        });

        it("returns 401 when Authorization header is absent", async () => {
            const res = await req("POST", "/category", {
                headers: noAuthHeader,
                body: { name: "unauthorized_test" },
            });

            expect(res.status).toBe(401);
        });

        it("returns 401 when Authorization token is invalid", async () => {
            const res = await req("POST", "/category", {
                headers: {
                    ...noAuthHeader,
                    Authorization: "Bearer bad-token",
                },
                body: { name: "test" },
            });

            expect(res.status).toBe(401);
        });

        it("returns 4xx when creating a duplicate category name", async () => {
            // First create
            await req("POST", "/category", {
                headers: validAuthHeader,
                body: { name: "politics" },
            });

            // Duplicate
            const res = await req("POST", "/category", {
                headers: validAuthHeader,
                body: { name: "politics" },
            });

            expect(res.status).toBeGreaterThanOrEqual(400);
        });
    });

    // ── GET /category ───────────────────────────────────────────────────────

    describe("GET /category — list all", () => {
        it("returns 200 with array of categories without auth", async () => {
            const res = await req("GET", "/category");

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(Array.isArray(json.category)).toBe(true);
        });

        it("each category item has id and name fields", async () => {
            const res = await req("GET", "/category");
            const json = await res.json();

            for (const cat of json.category) {
                expect(cat).toHaveProperty("id");
                expect(cat).toHaveProperty("name");
            }
        });
    });

    // ── GET /category/:id ───────────────────────────────────────────────────

    describe("GET /category/:id — find by id", () => {
        it("returns 200 with the correct category when ID exists", async () => {
            const res = await req("GET", "/category/1");

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.category.id).toBe(1);
        });

        it("returns 404 when category ID does not exist", async () => {
            const res = await req("GET", "/category/999999");

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /category/:id ────────────────────────────────────────────────

    describe("DELETE /category/:id — delete", () => {
        it("returns 200 with success message when category is deleted", async () => {
            const res = await req("DELETE", "/category/5", {
                headers: validAuthHeader,
            });

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.message).toContain("success delete category");
        });

        it("returns 404 when deleting a non-existent category", async () => {
            const res = await req("DELETE", "/category/999999", {
                headers: validAuthHeader,
            });

            expect(res.status).toBe(404);
        });

        it("returns 401 when deleting without auth token", async () => {
            const res = await req("DELETE", "/category/1", {
                headers: noAuthHeader,
            });

            expect(res.status).toBe(401);
        });
    });

    // ── Response Shape Contracts ─────────────────────────────────────────────

    describe("Response Shape Contracts", () => {
        it("create: response always has { status, message } keys", async () => {
            const res = await req("POST", "/category", {
                headers: validAuthHeader,
                body: { name: "contract-test" },
            });
            const json = await res.json();
            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
        });

        it("list: response always has { category } key as array", async () => {
            const res = await req("GET", "/category");
            const json = await res.json();
            expect(json).toHaveProperty("category");
            expect(Array.isArray(json.category)).toBe(true);
        });

        it("find by id: response always has { category } key as object", async () => {
            const res = await req("GET", "/category/1");
            const json = await res.json();
            expect(json).toHaveProperty("category");
            expect(typeof json.category).toBe("object");
        });

        it("delete: response always has { status, message } keys", async () => {
            const res = await req("DELETE", "/category/2", {
                headers: validAuthHeader,
            });
            const json = await res.json();
            expect(json).toHaveProperty("status");
            expect(json).toHaveProperty("message");
        });
    });
});