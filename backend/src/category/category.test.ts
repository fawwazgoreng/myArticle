import { describe, it, expect, mock } from "bun:test"

mock.module("@infra/database/prisma/prisma", () => ({
    default: {
        category: {
            findFirst: mock(async (opts?: any) => {
                if (opts?.orderBy?.id === "desc") return { id: 5, name: "science" }
                return { id: 1, name: "politics" }
            }),
            create:     mock(async (data: any) => ({ id: 99, name: data.data.name })),
            findMany:   mock(async () => [
                { id: 1, name: "politics" },
                { id: 2, name: "economy" },
                { id: 3, name: "health" },
            ]),
            findUnique: mock(async ({ where }: any) => {
                const db: Record<number, { id: number; name: string }> = {
                    1: { id: 1, name: "politics" },
                    2: { id: 2, name: "economy" },
                    3: { id: 3, name: "health" },
                }
                return db[where.id] ?? null
            }),
            delete: mock(async ({ where }: any) => {
                if (where.id === 999999) throw { code: "P2025" }
                return { id: where.id, name: "deleted-category" }
            }),
        },
    },
}))
mock.module("@infra/database/prisma/prisma", () => ({
    default: {
        $transaction: mock(async (promises: Promise<any>[]) => {
            return Promise.all(promises);
        }),

        // 2. Mock untuk tabel Category
        category: {
            findFirst: mock(async (opts?: any) => {
                if (opts?.where?.id) {
                    if (opts.where.id === 999999) return null;
                    return {
                        id: opts.where.id,
                        name: "politics",
                        article: [
                            {
                                article_id: 10,
                                article: {
                                    id: 10,
                                    title: "Mock Title",
                                    content: "Mock Content",
                                    base_views: 100,
                                    author: { id: 1, username: "admin" }
                                }
                            }
                        ]
                    };
                }
                if (opts?.orderBy?.id === "desc") return { id: 5, name: "science" };
                return { id: 1, name: "politics" };
            }),
            create: mock(async (data: any) => ({ id: 99, name: data.data.name })),
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

        categoryOnArticle: {
            count: mock(async (opts?: any) => {
                return 1;
            }),
        }
    },
}));

mock.module("@/category/category.validate", () => ({
    CategoryValidate: class MockCategoryValidate {
        create = mock((body: any) => {
            if (!body?.name || body.name.trim() === "") {
                throw { status: 422, message: "Validation failed", error: "name must not be empty" }
            }
            return { name: body.name }
        })
    },
}))

mock.module("@utils/auth/jwtauth", () => ({
    checkToken: mock(async (c: any, next: any) => {
        const auth = c.req.header("Authorization")
        if (!auth || !auth.startsWith("Bearer valid-")) {
            const { HTTPException } = require("hono/http-exception")
            throw new HTTPException(401, { message: "Unauthorized" })
        }
        await next()
    }),
    signToken:      mock(async (_user: any) => "mock-access-token"),
    getUserHasUsed: mock(async () => ({
        ip_address: "127.0.0.1", device_type: "desktop", event_type: "test",
    })),
}))

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
    handleError: mock((err: any) => {
        const { HTTPException } = require("hono/http-exception")
        if (err instanceof HTTPException) return err
        const status  = err?.statusCode || err?.status || 500
        const message = err?.message    || "Internal server error"
        return new HTTPException(status, {
            res: new Response(
                JSON.stringify({ status, message, error: err?.error || "INTERNAL_SERVER_ERROR" }),
                { status, headers: { "Content-Type": "application/json" } }
            ),
        })
    }),
}))

mock.module("@/config", () => ({
    env: { FRONT_END_URL: "http://localhost:3000" },
}))

import categoryApp from "./category.route"

const BASE         = "http://localhost"
const validHeaders = { "Content-Type": "application/json", "Authorization": "Bearer valid-token" }
const noAuthHeader = { "Content-Type": "application/json" }

async function req(
    method: string,
    path: string,
    opts: {
        body?:    Record<string, any>
        headers?: Record<string, string>
    } = {},
) {
    const init: RequestInit = { method, headers: opts.headers ?? noAuthHeader }
    if (opts.body) init.body = JSON.stringify(opts.body)
    return categoryApp.fetch(new Request(`${BASE}${path}`, init))
}

describe("Category Unit Tests", () => {

    describe("POST /category", () => {
        it("returns 201 with success message on valid payload", async () => {
            const res  = await req("POST", "", { headers: validHeaders, body: { name: "economy" } })
            const json = await res.json()

            expect(res.status).toBe(201)
            expect(json.message).toContain("success")
        })

        it("creates multiple categories consistently", async () => {
            for (const name of ["health", "international", "sports", "space"]) {
                const res  = await req("POST", "", { headers: validHeaders, body: { name } })
                const json = await res.json()

                expect(res.status).toBe(201)
                expect(json.message).toContain("success")
            }
        })

        it("returns 422 when name is empty string", async () => {
            const res  = await req("POST", "", { headers: validHeaders, body: { name: "" } })
            const json = await res.json()

            expect(res.status).toBe(422)
            expect(json).toHaveProperty("error")
        })

        it("returns 422 when body is missing name field", async () => {
            const res  = await req("POST", "", { headers: validHeaders, body: {} })
            const json = await res.json()

            expect(res.status).toBe(422)
            expect(json).toHaveProperty("error")
        })

        it("returns 401 when Authorization header is absent", async () => {
            const res = await req("POST", "", { headers: noAuthHeader, body: { name: "unauthorized_test" } })
            expect(res.status).toBe(401)
        })

        it("returns 401 when Authorization token is invalid", async () => {
            const res = await req("POST", "", {
                headers: { ...noAuthHeader, Authorization: "Bearer bad-token" },
                body:    { name: "test" },
            })
            expect(res.status).toBe(401)
        })

        it("returns 4xx when creating a duplicate category name", async () => {
            await req("POST", "", { headers: validHeaders, body: { name: "politics" } })

            const res = await req("POST", "", { headers: validHeaders, body: { name: "politics" } })
            expect(res.status).toBeGreaterThanOrEqual(400)
        })
    })

    describe("GET /category", () => {
        it("returns 200 with array of categories without auth", async () => {
            const res  = await req("GET", "")
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(Array.isArray(json.category)).toBe(true)
        })

        it("each category item has id and name fields", async () => {
            const res  = await req("GET", "")
            const json = await res.json()

            for (const cat of json.category) {
                expect(cat).toHaveProperty("id")
                expect(cat).toHaveProperty("name")
            }
        })
    })

    describe("GET /category/:id", () => {
        it("returns 200 with the correct category when ID exists", async () => {
            const res  = await req("GET", "/1")
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.category.id).toBe(1)
        })

        it("returns 404 when category ID does not exist", async () => {
            const res = await req("GET", "/999999")
            expect(res.status).toBe(404)
        })
    })

    describe("DELETE /category/:id", () => {
        it("returns 200 with success message when category is deleted", async () => {
            const res  = await req("DELETE", "/5", { headers: validHeaders })
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.message).toContain("success delete category")
        })

        it("returns 404 when deleting a non-existent category", async () => {
            const res = await req("DELETE", "/999999", { headers: validHeaders })
            expect(res.status).toBe(404)
        })

        it("returns 401 when deleting without auth token", async () => {
            const res = await req("DELETE", "/1", { headers: noAuthHeader })
            expect(res.status).toBe(401)
        })
    })

    describe("Response Shape Contracts", () => {
        it("create: response always has { status, message }", async () => {
            const res  = await req("POST", "", { headers: validHeaders, body: { name: "contract-test" } })
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
        })

        it("list: response always has { category } as array", async () => {
            const res  = await req("GET", "")
            const json = await res.json()

            expect(json).toHaveProperty("category")
            expect(Array.isArray(json.category)).toBe(true)
        })

        it("find by id: response always has { category } as object", async () => {
            const res  = await req("GET", "/1")
            const json = await res.json()

            expect(json).toHaveProperty("category")
            expect(typeof json.category).toBe("object")
        })

        it("delete: response always has { status, message }", async () => {
            const res  = await req("DELETE", "/2", { headers: validHeaders })
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
        })
    })
})