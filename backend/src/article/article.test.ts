import { describe, it, expect } from "bun:test"
import { File } from "buffer"
import prisma from "@infra/database/prisma/prisma"
import { getToken } from "@utils/testHelper/getToken"
import index from "./article.route"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function req(
    method: string,
    path: string,
    opts: {
        body?: Record<string, any> | FormData
        headers?: Record<string, string>
        cookies?: Record<string, string>
    } = {},
) {
    const url = `https://localhost${path}`
    const headers: Record<string, string> = {
        "Origin": process.env.FRONT_END_URL || "https://localhost:3000",
        ...(opts.headers ?? {}),
    }
    if (opts.cookies) {
        headers["Cookie"] = Object.entries(opts.cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ")
    }

    const init: RequestInit = { method, headers };
    if (opts.body) init.body = JSON.stringify(opts.body);
    return index.fetch(new Request(url, init));
}

// ---------------------------------------------------------------------------
// Article API Integration Tests
// ---------------------------------------------------------------------------
describe("Article API Integration Tests", () => {

    it("should create a new article with an image successfully", async () => {
        const auth = await getToken()
        const categories = await prisma?.category.findMany({ take: 2 })
        if (!categories || categories.length < 1) return

        const form = new FormData()
        form.append("title", "Integration Test Article")
        form.append("content", "This is a test content body.")
        categories.forEach((cat) => form.append("category", cat.name))
        form.append("image", new File(["sample_image_data"], "test.jpg", { type: "image/jpeg" }) as any)

        const res = await req("POST", "/article", {
            body: form,
            headers: { Authorization: `Bearer ${auth.res.token}` },
            cookies: { "refresh-token": auth.refreshToken },
        })

        const data = await res.json();
        console.log("Create Article Response:", data)

        expect(res.status).toBe(201)
        expect(data.article).toHaveProperty("title", "Integration Test Article")
    })

    it("should update an existing article's data and image", async () => {
        const auth = await getToken()
        const latestArticle = await prisma?.article.findFirst({ orderBy: { id: "desc" } })
        const categories = await prisma?.category.findMany({ take: 1 })
        if (!latestArticle || !categories) return

        const form = new FormData()
        form.append("title", "Updated Title via req")
        form.append("content", "Updated content body.")
        form.append("category", categories[0].name)
        form.append("image", new File(["updated_image_data"], "updated.jpg", { type: "image/jpeg" }) as any)

        const res = await req("PUT", `/article/${latestArticle.id}`, {
            body: form,
            headers: { Authorization: `Bearer ${auth.res.token}` },
            cookies: { "refresh-token": auth.refreshToken },
        })

        const data = await res.json()
        console.log("Update Article Response:", data)

        expect(res.status).toBe(200)
        expect(data.article.title).toBe("Updated Title via req")
    })

    it("should create multiple articles in a sequential loop", async () => {
        const auth = await getToken()
        const category = await prisma?.category.findFirst()
        if (!category) return

        for (let i = 0; i < 3; i++) {
            const form = new FormData()
            form.append("title", `Bulk Article ${i}`)
            form.append("content", "Sequential bulk creation test content.")
            form.append("category", category.name)

            const res = await req("POST", "/article", {
                body: form,
                headers: { Authorization: `Bearer ${auth.res.token}` },
                cookies: { "refresh-token": auth.refreshToken },
            })

            const data = await res.json()
            console.log(`Bulk Article ${i} Response:`, data)

            expect(res.status).toBe(201)
        }
    })

    it("should fetch articles with pagination and title filters", async () => {
        const res = await req("GET", "/article?page=1&title=Bulk")

        const data = await res.json()
        console.log("Fetch Articles Response:", data)

        expect(res.status).toBe(200)
        expect(Array.isArray(data.article)).toBe(true)
    })

    it("should increment the view count when fetching by ID", async () => {
        const article = await prisma?.article.findFirst()
        if (!article) return

        const res = await req("GET", `/article/${article.id}`)

        const data = await res.json()
        console.log("View Article Response:", data)

        expect(res.status).toBe(200)
        expect(data.article).toHaveProperty("base_views")
    })

    it("should delete the most recent article successfully", async () => {
        const auth = await getToken()
        const latest = await prisma?.article.findFirst({ orderBy: { id: "desc" } })
        if (!latest) return

        const res = await req("DELETE", `/article/${latest.id}`, {
            headers: { Authorization: `Bearer ${auth.res.token}` },
            cookies: { "refresh-token": auth.refreshToken },
        })

        const data = await res.json()
        console.log("Delete Article Response:", data)

        expect(res.status).toBe(200)
        expect(data.message).toContain("success delete article")
    })

    it("should return 401 when trying to create an article without a token", async () => {
        const form = new FormData()
        form.append("title", "Unauthorized Test")

        const res = await req("POST", "/article", { body: form })

        const data = await res.json()
        console.log("Unauthorized Response:", data)

        expect(res.status).toBe(401)
    })

    it("should return 404 when requesting a non-existent article", async () => {
        const res = await req("GET", "/article/99999999-9999-9999-9999-999999999999")

        const data = await res.json()
        console.log("Not Found Response:", data)

        expect(res.status).toBe(404)
        expect(String(data.message).toLowerCase()).toContain("not found")
    })
})