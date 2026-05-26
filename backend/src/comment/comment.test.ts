import { describe, it, expect, mock, afterEach } from "bun:test"

const MockRedisModule = {
    default: class MockRedisToken {
        async getToken(token: string) {
            if (token && token.endsWith("valid-refresh-token")) {
                return `enc::${JSON.stringify({
                    id:         "admin-1",
                    created_at: new Date().toISOString(),
                    roles:      "admin",
                })}`
            }
            throw { status: 401, message: "cookie expired please login first" }
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

mock.module("@infra/redis/refreshToken",            () => MockRedisModule)
mock.module("../infrastructure/redis/refreshToken", () => MockRedisModule)

mock.module("@utils/auth/encrypt", () => ({
    encryptToken: mock(async (raw: string) => `enc::${raw}`),
    decryptToken: mock(async (raw: string) => raw.replace(/^enc::/, "")),
    randomUuid:   mock(async () => "mock-uuid-1234"),
}))

mock.module("@utils/auth/decryptUserToken", () => ({
    decryptCookie: mock(async (_c: any) => ({
        id:       "admin-1",
        username: "admin",
        email:    "admin@test.com",
        roles:    "admin",
    })),
}))

mock.module("@/comment/comment.read", () => ({
    default: class MockReadComment {
        show = mock(async (query: any) => {
            if (Number(query.article_id) > 100) {
                return { comment: [], meta: { total: 0, page: 1 } }
            }
            return {
                comment: [
                    {
                        id:         1,
                        content:    "First comment",
                        article_id: query.article_id ?? 1,
                        user_id:    "user-1",
                        created_at: new Date().toISOString(),
                    },
                    {
                        id:         2,
                        content:    "Second comment",
                        article_id: query.article_id ?? 1,
                        user_id:    "user-2",
                        created_at: new Date().toISOString(),
                    },
                ],
                meta: { total: 2, page: query.page ?? 1 },
            }
        })

        findById = mock(async (id: number) => {
            if (Number(id) > 100) {
                throw { status: 404, message: "Comment not found", error: "NOT_FOUND" }
            }
            return {
                id,
                content:    "Mock comment content",
                article_id: 1,
                user_id:    "user-1",
                created_at: new Date().toISOString(),
            }
        })
    },
}))

mock.module("@/comment/comment.write", () => ({
    default: class MockWriteComment {
        create = mock(async (body: any) => {
            if (!body?.content || body.content.trim() === "") {
                throw { status: 422, message: "Validation failed", error: "content is required" }
            }
            if (!body?.article_id) {
                throw { status: 422, message: "Validation failed", error: "article_id is required" }
            }
            return {
                id:         99,
                content:    body.content,
                article_id: body.article_id,
                user_id:    body.user_id ?? "user-1",
                created_at: new Date().toISOString(),
            }
        })

        delete = mock(async (id: number) => {
            if (Number(id) > 100) {
                throw { status: 404, message: "Comment not found", error: "NOT_FOUND" }
            }
            return { id }
        })

        update = mock(async (id: number, body: any) => {
            if (Number(id) > 100) {
                throw { status: 404, message: "Comment not found", error: "NOT_FOUND" }
            }
            return {
                id,
                content:    body.content ?? "Updated content",
                article_id: body.article_id ?? 1,
                user_id:    "user-1",
                created_at: new Date().toISOString(),
            }
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

import { createJwtMock } from "@/utils/testHelper/tokenHelper.test"

const jwt = createJwtMock(process.env.JWT_SECRET ?? "test-jwt-secret", "bypass")
jwt.bypass()

import commentApp from "@/comment/comment.route"

const DEFAULT_DECRYPT_TOKEN  = async (raw: string) => raw.replace(/^enc::/, "")
const DEFAULT_DECRYPT_COOKIE = async (_c: any) => ({
    id: "admin-1", username: "admin", email: "admin@test.com", roles: "admin",
})

const BASE         = "http://localhost"
const validHeaders = { "Content-Type": "application/json", "Authorization": "Bearer valid-token" }
const noAuthHeader = { "Content-Type": "application/json" }

async function req(
    method: string,
    path: string,
    opts: {
        body?:    Record<string, any>
        headers?: Record<string, string>
        query?:   Record<string, string | number>
        cookies?: Record<string, string>
    } = {},
) {
    let url = `${BASE}${path}`

    if (opts.query) {
        const params = new URLSearchParams(
            Object.entries(opts.query).map(([k, v]) => [k, String(v)])
        )
        url += `?${params.toString()}`
    }

    const headers: Record<string, string> = opts.headers ?? noAuthHeader

    if (opts.cookies) {
        headers["Cookie"] = Object.entries(opts.cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ")
    }

    const init: RequestInit = { method, headers }
    if (opts.body) init.body = JSON.stringify(opts.body)

    return commentApp.fetch(new Request(url, init))
}

describe("Comment Unit Tests", () => {

    describe("GET /comment", () => {
        it("returns 200 with comment array and meta", async () => {
            const res  = await req("GET", "/", { query: { page: 1, article_id: 1, time: "newest" } })
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.status).toBe(200)
            expect(json.message).toBe("success get comment")
            expect(Array.isArray(json.comment)).toBe(true)
            expect(json).toHaveProperty("meta")
        })

        it("returns 200 with empty array when article_id has no comments", async () => {
            const res  = await req("GET", "/", { query: { page: 1, article_id: 99999 } })
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.comment).toHaveLength(0)
            expect(json.meta.count).toBe(0)
        })

        it("returns 200 without query params using defaults", async () => {
            const res  = await req("GET", "/")
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(Array.isArray(json.comment)).toBe(true)
        })

        it("returns comments filtered by time=oldest", async () => {
            const res  = await req("GET", "/", { query: { page: 1, article_id: 1, time: "oldest" } })
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(Array.isArray(json.comment)).toBe(true)
        })

        it("each comment item has id, content, article_id fields", async () => {
            const res  = await req("GET", "/", { query: { article_id: 1 } })
            const json = await res.json()

            for (const c of json.comment) {
                expect(c).toHaveProperty("id")
                expect(c).toHaveProperty("content")
                expect(c).toHaveProperty("article_id")
            }
        })
    })

    describe("GET /comment/:id", () => {
        it("returns 200 with correct comment when ID exists", async () => {
            const res  = await req("GET", "/1")
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.status).toBe(200)
            expect(json.message).toBe("success find comment")
            expect(json.comment).toHaveProperty("id", 1)
        })

        it("returns 404 when comment ID does not exist", async () => {
            const res  = await req("GET", "/99999")
            const json = await res.json()

            expect(res.status).toBe(404)
            expect(String(json.message).toLowerCase()).toContain("not found")
        })

        it("returns comment with all required fields", async () => {
            const res  = await req("GET", "/1")
            const json = await res.json()
            console.log(json);

            expect(json.comment).toHaveProperty("id")
            expect(json.comment).toHaveProperty("content")
            expect(json.comment).toHaveProperty("article_id")
            expect(json.comment).toHaveProperty("created_at")
        })
    })

    describe("POST /comment", () => {
        afterEach(async () => {
            const { decryptToken }  = await import("@utils/auth/encrypt")
            const { decryptCookie } = await import("@utils/auth/decryptUserToken")
            ;(decryptToken as any).mockImplementation(DEFAULT_DECRYPT_TOKEN)
            ;(decryptCookie as any).mockImplementation(DEFAULT_DECRYPT_COOKIE)
        })

        it("returns 201 with new comment data on valid payload", async () => {
            const res  = await req("POST", "/", {
                headers: validHeaders,
                body:    { user_id: "user-1", content: "Great article!", article_id: 1 },
            })
            const json = await res.json()

            expect(res.status).toBe(201)
            expect(json.status).toBe(201)
            expect(json.message).toBe("success create comment")
            expect(json.comment).toHaveProperty("content", "Great article!")
            expect(json.comment).toHaveProperty("article_id", 1)
        })

        it("returns 401 when Authorization header is absent", async () => {
            const res = await req("POST", "/", {
                headers: noAuthHeader,
                body:    { content: "No auth comment", article_id: 1 },
            })
            expect(res.status).toBe(401)
        })

        it("returns 401 when token is invalid", async () => {
            const res = await req("POST", "/", {
                headers: { ...noAuthHeader, Authorization: "Bearer bad-token" },
                body:    { content: "Bad token", article_id: 1 },
            })
            console.log(await res.json())
            expect(res.status).toBe(401)
        })

        it("returns 422 when content is empty", async () => {
            const res  = await req("POST", "/", {
                headers: validHeaders,
                body:    { content: "", article_id: 1 },
            })
            const json = await res.json()

            expect(res.status).toBe(422)
            expect(json).toHaveProperty("error")
        })

        it("returns 422 when article_id is missing", async () => {
            const res = await req("POST", "/", {
                headers: validHeaders,
                body:    { content: "Missing article id" },
            })
            expect(res.status).toBe(422)
        })
    })

    describe("DELETE /comment/:id", () => {
        it("returns 200 with success message on valid deletion", async () => {
            const res  = await req("DELETE", "/1", { headers: validHeaders })
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.status).toBe(200)
            expect(json.message).toBe("deleted comment successfully")
        })

        it("returns 404 when comment does not exist", async () => {
            const res = await req("DELETE", "/99999", { headers: validHeaders })
            expect(res.status).toBe(404)
        })

        it("returns 401 when deleting without auth token", async () => {
            const res = await req("DELETE", "/1", { headers: noAuthHeader })
            expect(res.status).toBe(401)
        })
    })

    describe("PUT /comment/:id", () => {
        it("returns 200 with updated comment data", async () => {
            const res  = await req("PUT", "/1", {
                headers: validHeaders,
                body:    { content: "Updated comment content", article_id: 1 },
            })
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.status).toBe(200)
            expect(json.comment).toHaveProperty("id", 1)
            expect(json.comment).toHaveProperty("content", "Updated comment content")
        })

        it("returns 404 when comment to update does not exist", async () => {
            const res = await req("PUT", "/99999", {
                headers: validHeaders,
                body:    { content: "Ghost update" },
            })
            expect(res.status).toBe(404)
        })

        it("returns 401 when updating without auth token", async () => {
            const res = await req("PUT", "/1", {
                headers: noAuthHeader,
                body:    { content: "No auth update" },
            })
            expect(res.status).toBe(401)
        })

        it("returns 401 when token is invalid", async () => {
            const res = await req("PUT", "/1", {
                headers: { ...noAuthHeader, Authorization: "Bearer expired-token" },
                body:    { content: "Bad token update" },
            })
            expect(res.status).toBe(401)
        })
    })

    describe("Response Shape Contracts", () => {
        it("GET /comment: always returns { status, message, comment[], meta }", async () => {
            const res  = await req("GET", "/", { query: { article_id: 1 } })
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
            expect(json).toHaveProperty("comment")
            expect(json).toHaveProperty("meta")
            expect(Array.isArray(json.comment)).toBe(true)
        })

        it("GET /comment/:id: always returns { status, message, comment }", async () => {
            const res  = await req("GET", "/1")
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
            expect(json).toHaveProperty("comment")
            expect(typeof json.comment).toBe("object")
        })

        it("POST /comment: always returns { status, message, comment }", async () => {
            const res  = await req("POST", "/", {
                headers: validHeaders,
                body:    { content: "Contract test comment", article_id: 1 },
            })
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
            expect(json).toHaveProperty("comment")
        })

        it("DELETE /comment/:id: always returns { status, message }", async () => {
            const res  = await req("DELETE", "/2", { headers: validHeaders })
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
        })

        it("PUT /comment/:id: always returns { status, message, comment }", async () => {
            const res  = await req("PUT", "/2", {
                headers: validHeaders,
                body:    { content: "Contract update", article_id: 1 },
            })
            const json = await res.json()

            expect(json).toHaveProperty("status")
            expect(json).toHaveProperty("message")
            expect(json).toHaveProperty("comment")
        })
    })
})