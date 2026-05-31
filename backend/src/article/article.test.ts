import { describe, it, expect, mock } from "bun:test"

// ---------------------------------------------------------------------------
// Module Mocks
// ---------------------------------------------------------------------------

// --- ArticleModel ---
mock.module("@/article/article.model", () => ({
    default: class MockArticleModel {
        show = mock(async () => ({
            article: [
                { id: 1, title: "Test Article", content: "Content", base_views: 10, image: "test.jpg", category: [] },
                { id: 2, title: "Bulk Article 0", content: "Content", base_views: 5, image: "bulk.jpg", category: [] },
            ],
            count: 2,
        }))
        create = mock(async (data: any) => ({
            id: 1, title: data.title, content: data.content,
            image: data.image, base_views: 0,
            created_at: new Date(), updated_at: new Date(),
            author_id: data.author_id,
            category: [],
        }))
        findById = mock(async (id: number) => {
            if (id === 1) return { id: 1, title: "Test Article", content: "Content", base_views: 10, image: "test.jpg", category: [] }
            return null
        })
        checkPermisssion = mock(async (id: number) => {
            if (id === 1) return { id: 1, author_id: "admin-1" }
            return null
        })
        update = mock(async (data: any) => ({
            id: data.id, title: data.title, content: data.content,
            image: data.image, base_views: 0, category: [],
        }))
        replaceCategories = mock(async () => undefined)
        delete = mock(async (id: number) => ({ id }))
        raw = mock(async () => undefined)
        findImage = mock(async (id: number) => {
            if (id === 1) return { id: 1, image: "test.jpg" }
            return null
        })
    },
}))

// --- ReadRedis ---
mock.module("@infra/redis/redis.read", () => ({
    ReadRedis: class MockReadRedis {
        readAll  = mock(async (_key: string) => null)   // null = cache miss → hit DB
        readShow = mock(async (_id: number)  => null)   // null = cache miss → hit DB
        readViews = mock(async (_ids: string[]) => ({})) // empty = no view overrides
    },
}))

// --- WriteRedis ---
mock.module("@infra/redis/redis.write", () => ({
    default: class MockWriteRedis {
        increment   = mock(async (_key: any) => 11)
        cacheSearch = mock(async () => undefined)
        newArticle  = mock(async () => undefined)
        delete      = mock(async () => undefined)
        syncData    = mock(async () => "synced")
    },
}))

// --- ElasticSearch ---
mock.module("@infra/elasticSearch/elastic.case", () => ({
    default: class MockElasticSearchCase {
        search = mock(async () => ({
            hits: {
                total: { value: 2 },
                hits: [
                    { _source: { id: 1, title: "Test Article",  content: "Content", base_views: 10, image: "test.jpg",  category: [] } },
                    { _source: { id: 2, title: "Bulk Article 0", content: "Content", base_views: 5,  image: "bulk.jpg", category: [] } },
                ],
            },
        }))
        buildQuery = mock((_req: any) => ({ match_all: {} }))
    },
}))

// --- ArticleWrite deps ---
mock.module("@infra/storage/cloudinary", () => ({
    default: { upload: mock(async (_file: any) => "https://cdn.example.com/test.jpg") },
}))

mock.module("@/article/article.validate", () => ({
    ArticleValidate: class MockArticleValidate {
        create = mock((req: any) => req)
        update = mock((req: any) => req)
    },
}))

mock.module("@/category/category.model", () => ({
    default: class MockCategoryModel {
        findByNames = mock(async (names: string[]) =>
            names.map((name, i) => ({ id: i + 1, name }))
        )
    },
}))

// --- AppError ---
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

// --- handleError ---
mock.module("@utils/error/separated", () => ({
    toHttpException: mock((err: any) => {
            const { HTTPException } = require("hono/http-exception");            
            const status = err?.statusCode || err?.status || 500;
            const message = err?.message || "Internal server error";
            const jsonResponse = new Response(
                JSON.stringify({
                    status: status,
                    message: message,
                    error: err?.error || "INTERNAL_SERVER_ERROR"
                }),
                {
                    status: status,
                    headers: { "Content-Type": "application/json" }
                }
            );
            throw new HTTPException(status, { res: jsonResponse });
        }),
}));

// --- checkToken ---
mock.module("@utils/auth/jwtauth", () => ({
    checkToken:     mock(async (_c: any, next: any) => next()),
    signToken:      mock(async (_user: any) => "mock-jwt-access-token"),
    hashPassword:   mock(async (_plain: string) => "hashed-password"),
    getUserHasUsed: mock(async () => ({ ip_address: "127.0.0.1", device_type: "desktop", event_type: "login" })),
}))

// --- checkPermission ---
mock.module("@utils/auth/checkPermission", () => ({
    checkPermisssion: mock(async (_c: any, next: any) => next()),
}))

// --- Config ---
mock.module("@/config", () => ({
    env: { FRONT_END_URL: "http://localhost:3000", SECRET_KEY: "test-secret", JWT_SECRET: "test-jwt-secret" },
}))

// --- hono/bun ---
mock.module("hono/bun", () => ({
    getConnInfo: mock(() => ({ remote: { address: "127.0.0.1" } })),
}))

// ---------------------------------------------------------------------------
// Import subjects AFTER mocks
// ---------------------------------------------------------------------------
import index       from "./article.route"
import ReadArticle  from "./article.read"

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
async function req(
    method: string,
    path: string,
    opts: {
        body?:    Record<string, any> | FormData
        headers?: Record<string, string>
        cookies?: Record<string, string>
    } = {},
) {
    const url     = `http://localhost${path}`
    const headers: Record<string, string> = {
        "Origin": "http://localhost:3000",
        ...(opts.headers ?? {}),
    }
    if (opts.cookies) {
        headers["Cookie"] = Object.entries(opts.cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ")
    }
    const init: RequestInit = { method, headers }
    if (opts.body instanceof FormData) {
        init.body = opts.body
    } else if (opts.body) {
        headers["Content-Type"] = "application/json"
        init.body = JSON.stringify(opts.body)
    }
    return index.fetch(new Request(url, init))
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` })

// ---------------------------------------------------------------------------
// Route Tests
// ---------------------------------------------------------------------------
describe("GET /", () => {
    it("returns 200 with article list", async () => {
        const res  = await req("GET", "/")
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(Array.isArray(json.article)).toBe(true)
    })

    it("returns 200 with pagination and title filter", async () => {
        const res  = await req("GET", "/?page=1&title=Bulk")
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(json.meta).toHaveProperty("currentPage")
    })
})

describe("GET /:id", () => {
    it("returns 200 with article and base_views for valid id", async () => {
        const res  = await req("GET", "/1")
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(json.article).toHaveProperty("base_views")
    })

    it("returns 404 for non-existent article", async () => {
        const res = await req("GET", "/99999999")
        expect(res.status).toBe(404)
    })
})

describe("POST /", () => {
    it("returns 401 without Authorization header", async () => {
        const form = new FormData()
        form.append("title", "Unauthorized Test")
        const res = await req("POST", "/", { body: form })
        expect(res.status).toBe(401)
    })

    it("returns 201 on successful article creation", async () => {
        const refreshToken = await getTokenMock(); 
        const form = new FormData()
        form.append("title", "Integration Test Article")
        form.append("content", "Test content body.")
        form.append("category", "tech")
        form.append("image", new File(["data"], "test.jpg", { type: "image/jpeg" }) as any)
        const res = await req("POST", "/", {
            body: form, headers: authHeaders(refreshToken.res.token), cookies: {
            "refresh-token": refreshToken.refreshToken
        }})
        const json = await res.json()
        expect(res.status).toBe(201)
        expect(json.article).toHaveProperty("title")
    })
})

describe("PUT /:id", () => {
    it("returns 200 on successful update", async () => {
        const refreshToken = await getTokenMock(); 
        const form = new FormData()
        form.append("title", "Updated Title")
        form.append("content", "Updated content.")
        form.append("category", "tech")
        form.append("image", new File(["data"], "updated.jpg", { type: "image/jpeg" }) as any)
        const res = await req("PUT", "/1", {
            body: form, headers: authHeaders(refreshToken.res.token), cookies: {
                "refresh-token": refreshToken.refreshToken
        }})
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(json.article.title).toBe("Updated Title")
    })
})

describe("DELETE /:id", () => {
    it("returns 200 on successful delete", async () => {
        const refreshToken = await getTokenMock(); 
        const res = await req("DELETE", "/1", {
            headers: authHeaders(refreshToken.res.token), cookies: {
                "refresh-token": refreshToken.refreshToken
        }})
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(json.message).toContain("success delete article")
    })
})

// ---------------------------------------------------------------------------
// Unit — ReadArticle
// ---------------------------------------------------------------------------
describe("ReadArticle.show", () => {
    it("returns paginated articles from ElasticSearch on cache miss", async () => {
        const service = new ReadArticle()
        const result  = await service.show({ page: 1, title: "", time: "newest", populer: false })
        expect(Array.isArray(result.article)).toBe(true)
        expect(result.meta).toHaveProperty("currentPage", 1)
    })

    it("returns cached articles on cache hit", async () => {
        const cachedData = JSON.stringify({
            article: [{ id: 3, title: "Cached Article", content: "Cached", base_views: 99, image: "cached.jpg", category: [] }],
            meta: { firstPage: 1, currentPage: 1, lastPage: 1, count: 1 },
        })
        // Override readAll mock untuk simulate cache hit
        const { ReadRedis } = await import("@infra/redis/redis.read")
        const instance = new ReadRedis()
        ;(instance.readAll as any).mockResolvedValueOnce(cachedData)

        const service = new ReadArticle()
        const result  = await service.show({ page: 1, title: "", time: "newest", populer: false })
        expect(result.article.length).toBeGreaterThan(0)
    })
})

describe("ReadArticle.findById", () => {
    it("returns article for valid id", async () => {
        const service = new ReadArticle()
        const result  = await service.findById(1)
        expect(result).toHaveProperty("id", 1)
    })

    it("throws 404 for non-existent id", async () => {
        const service = new ReadArticle()
        expect(service.findById(99999)).rejects.toMatchObject({ statusCode: 404 })
    })
})