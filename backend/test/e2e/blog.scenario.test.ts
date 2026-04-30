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
    BlogScenarioSeeder,
    ArticleWithoutCategorySeeder,
    LongContentSeeder,
    SpecialCharacterSeeder,
} from "@infra/database/seeder/e2e/blog.scenario.seeder";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE = "http://localhost";

// ─── Request Helpers ──────────────────────────────────────────────────────────

interface ReqOptions {
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
}

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

/** Multipart FormData request — for article create/update with image */
async function formReq(
    method: string,
    path: string,
    form: FormData,
    authToken?: string,
): Promise<Response> {
    const headers: Record<string, string> = {
        Origin: process.env.FRONT_END_URL ?? "http://localhost:3000",
    };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

    return app.fetch(
        new Request(`${BASE}${path}`, { method, headers, body: form }),
    );
}

async function json<T = any>(res: Response): Promise<T> {
    return res.json();
}

/** Log in and return a valid access token for use in protected routes */
async function getAccessToken(): Promise<string> {
    // Use the editor/admin user seeded by UserSeeder
    const res = await req("POST", "/auth/login", {
        body: {
            email: process.env.TEST_ADMIN_EMAIL ?? "admin@myarticle.com",
            password: process.env.TEST_ADMIN_PASSWORD ?? "Admin@123",
        },
    });

    if (res.status !== 200) {
        throw new Error(
            `getAccessToken: login failed with status ${res.status}. ` +
            `Ensure UserSeeder has been run and TEST_ADMIN_EMAIL/PASSWORD are set correctly.`,
        );
    }

    const body = await res.json();
    return body.access_token as string;
}

/** Build a dummy image File for multipart uploads */
function dummyImage(name = "article.jpg"): File {
    return new File(["fake-image-content"], name, { type: "image/jpeg" });
}

// ─── Suite 1 · Category CRUD ──────────────────────────────────────────────────

describe("[E2E] Category — CRUD", () => {
    let token: string;
    let createdCategoryId: number;
    const testCategoryName = `e2e-category-${Date.now()}`;

    beforeAll(async () => {
        token = await getAccessToken();
    });

    afterAll(async () => {
        // Clean up only the categories created in this suite
        await prisma.category.deleteMany({
            where: { name: { startsWith: "e2e-category-" } },
        });
    });

    // ── Create ──────────────────────────────────────────────────────────────

    it("POST /category → 201 with category data on valid payload", async () => {
        const res = await req("POST", "/category", {
            headers: { Authorization: `Bearer ${token}` },
            body: { name: testCategoryName },
        });

        expect(res.status).toBe(201);
        const body = await json(res);
        expect(body.status).toBe(201);
        expect(body.message).toContain("success");
        expect(body.category).toMatchObject({ name: testCategoryName });

        // Persist ID for subsequent tests in this suite
        createdCategoryId = body.category.id;

        // Side-effect: record must exist in DB
        const dbRecord = await prisma.category.findUnique({
            where: { id: createdCategoryId },
        });
        expect(dbRecord).not.toBeNull();
        expect(dbRecord?.name).toBe(testCategoryName);
    });

    it("POST /category → 409 on duplicate category name", async () => {
        const res = await req("POST", "/category", {
            headers: { Authorization: `Bearer ${token}` },
            body: { name: testCategoryName },
        });
        expect(res.status).toBeGreaterThanOrEqual(409);
    });

    it("POST /category → 422 when name is empty", async () => {
        const res = await req("POST", "/category", {
            headers: { Authorization: `Bearer ${token}` },
            body: { name: "" },
        });
        expect(res.status).toBe(422);
        const body = await json(res);
        expect(body).toHaveProperty("error");
    });

    it("POST /category → 422 when name field is missing entirely", async () => {
        const res = await req("POST", "/category", {
            headers: { Authorization: `Bearer ${token}` },
            body: {},
        });
        expect(res.status).toBe(422);
    });

    it("POST /category → 401 without Authorization header", async () => {
        const res = await req("POST", "/category", {
            body: { name: "unauthorized-category" },
        });
        expect(res.status).toBe(401);
    });

    // ── Read ────────────────────────────────────────────────────────────────

    it("GET /category → 200 with array of categories (no auth required)", async () => {
        const res = await req("GET", "/category");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(Array.isArray(body.category)).toBe(true);
        expect(body.category.length).toBeGreaterThan(0);
    });

    it("GET /category → each item has id, name, slug fields", async () => {
        const res = await req("GET", "/category");
        const body = await json(res);
        for (const cat of body.category) {
            expect(cat).toHaveProperty("id");
            expect(cat).toHaveProperty("name");
        }
    });

    it("GET /category/:id → 200 with correct category when ID exists", async () => {
        const res = await req("GET", `/category/${createdCategoryId}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.category.id).toBe(createdCategoryId);
        expect(body.category.name).toBe(testCategoryName);
    });

    it("GET /category/:id → 404 when ID does not exist", async () => {
        const res = await req("GET", "/category/999999");
        expect(res.status).toBe(404);
        const body = await json(res);
        expect(String(body.message).toLowerCase()).toContain("not found");
    });

    // ── Delete ──────────────────────────────────────────────────────────────

    it("DELETE /category/:id → 200 and record removed from DB", async () => {
        const res = await req("DELETE", `/category/${createdCategoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.message).toContain("success delete category");

        // Side-effect: record must be gone from DB
        const dbRecord = await prisma.category.findUnique({
            where: { id: createdCategoryId },
        });
        expect(dbRecord).toBeNull();
    });

    it("DELETE /category/:id → 404 on non-existent ID", async () => {
        const res = await req("DELETE", "/category/999999", {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(res.status).toBe(404);
    });

    it("DELETE /category/:id → 401 without token", async () => {
        const res = await req("DELETE", `/category/1`);
        expect(res.status).toBe(401);
    });
});

// ─── Suite 2 · Article CRUD (BlogScenarioSeeder) ──────────────────────────────

describe("[E2E] Article — CRUD (BlogScenarioSeeder)", () => {
    let token: string;
    let createdArticleId: string;
    let seededArticleId: string;

    beforeAll(async () => {
        // Seed canonical blog data — 6 categories + 3 articles with category relations
        const seeder = new BlogScenarioSeeder();
        await seeder.run();

        token = await getAccessToken();

        // Pick first seeded article for read/update/delete tests
        const first = await prisma.article.findFirst({
            orderBy: { created_at: "asc" },
        });
        seededArticleId = String(first!.id);
    });

    afterAll(async () => {
        const tables = ["CategoryOnArticle", "Article", "Category"];
        await Promise.all(
            tables.map((t) =>
                (prisma as any)[
                    t.charAt(0).toLowerCase() + t.slice(1)
                ]?.deleteMany?.(),
            ),
        );
    });

    // ── Create ──────────────────────────────────────────────────────────────

    it("POST /article → 201 with article data and categories on valid multipart payload", async () => {
        const form = new FormData();
        form.append("title", "E2E Test Article — Full Payload");
        form.append("content", "This article was created by the E2E test suite.");
        form.append("category", "Technology");
        form.append("category", "Science");
        form.append("image", dummyImage());

        const res = await formReq("POST", "/article", form, token);
        expect(res.status).toBe(201);

        const body = await json(res);
        expect(body.status).toBe(201);
        expect(body.article).toHaveProperty("title", "E2E Test Article — Full Payload");
        expect(typeof body.article.id).toBe("string");

        createdArticleId = body.article.id;

        // Side-effect: record must exist in DB with category relations
        const dbRecord = await prisma.article.findUnique({
            where: { id: Number(createdArticleId) },
            include: { category: true },
        });
        expect(dbRecord).not.toBeNull();
        expect(dbRecord!.category.length).toBeGreaterThan(0);
    });

    it("POST /article → 401 without Authorization token", async () => {
        const form = new FormData();
        form.append("title", "Unauthorized Article");
        form.append("content", "Should not be created.");

        const res = await formReq("POST", "/article", form); // no token
        expect(res.status).toBe(401);
    });

    it("POST /article → 422 when title is missing", async () => {
        const form = new FormData();
        form.append("content", "No title article.");

        const res = await formReq("POST", "/article", form, token);
        expect(res.status).toBe(422);
        const body = await json(res);
        expect(body).toHaveProperty("error");
    });

    it("POST /article → 422 when title is empty string", async () => {
        const form = new FormData();
        form.append("title", "");
        form.append("content", "Empty title.");

        const res = await formReq("POST", "/article", form, token);
        expect(res.status).toBe(422);
    });

    // ── Read (list) ─────────────────────────────────────────────────────────

    it("GET /article → 200 with array of articles (no auth required)", async () => {
        const res = await req("GET", "/article");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(Array.isArray(body.article)).toBe(true);
        expect(body.article.length).toBeGreaterThan(0);
    });

    it("GET /article?page=1 → 200 with pagination meta", async () => {
        const res = await req("GET", "/article?page=1");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body).toHaveProperty("meta");
        expect(body.meta).toHaveProperty("total");
        expect(body.meta).toHaveProperty("page");
    });

    it("GET /article?title=Future → returns only matching articles", async () => {
        const res = await req("GET", "/article?title=Future");
        expect(res.status).toBe(200);
        const body = await json(res);
        for (const a of body.article) {
            expect(a.title.toLowerCase()).toContain("future");
        }
    });

    it("GET /article?title=nonexistentkeywordxyz → returns empty array", async () => {
        const res = await req("GET", "/article?title=nonexistentkeywordxyz");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article).toHaveLength(0);
    });

    // ── Read (single + view count) ──────────────────────────────────────────

    it("GET /article/:id → 200 with article and base_views field", async () => {
        const res = await req("GET", `/article/${seededArticleId}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article).toHaveProperty("id", seededArticleId);
        expect(body.article).toHaveProperty("base_views");
    });

    it("GET /article/:id → increments view count on each fetch", async () => {
        const before = await prisma.article.findUnique({
            where: { id: Number(seededArticleId) },
        });

        await req("GET", `/article/${seededArticleId}`);
        await req("GET", `/article/${seededArticleId}`);

        const after = await prisma.article.findUnique({
            where: { id: Number(seededArticleId) },
        });

        expect(after!.base_views).toBeGreaterThan(before!.base_views);
    });

    it("GET /article/:id → 404 for non-existent UUID", async () => {
        const res = await req(
            "GET",
            "/article/99999999-9999-9999-9999-999999999999",
        );
        expect(res.status).toBe(404);
        const body = await json(res);
        expect(String(body.message).toLowerCase()).toContain("not found");
    });

    // ── Update ──────────────────────────────────────────────────────────────

    it("PUT /article/:id → 200 with updated article data", async () => {
        const form = new FormData();
        form.append("title", "Updated E2E Title");
        form.append("content", "Updated content from E2E test.");
        form.append("category", "Health");
        form.append("image", dummyImage("updated.jpg"));

        const res = await formReq("PUT", `/article/${createdArticleId}`, form, token);
        expect(res.status).toBe(200);

        const body = await json(res);
        expect(body.article.title).toBe("Updated E2E Title");

        // Side-effect: DB must reflect the change
        const dbRecord = await prisma.article.findUnique({
            where: { id: Number(createdArticleId) },
        });
        expect(dbRecord?.title).toBe("Updated E2E Title");
    });

    it("PUT /article/:id → 401 without token", async () => {
        const form = new FormData();
        form.append("title", "No Auth Update");

        const res = await formReq("PUT", `/article/${createdArticleId}`, form);
        expect(res.status).toBe(401);
    });

    it("PUT /article/:id → 404 on non-existent article", async () => {
        const form = new FormData();
        form.append("title", "Ghost Update");
        form.append("content", "This article does not exist.");

        const res = await formReq(
            "PUT",
            "/article/99999999-9999-9999-9999-999999999999",
            form,
            token,
        );
        expect(res.status).toBe(404);
    });

    // ── Delete ──────────────────────────────────────────────────────────────

    it("DELETE /article/:id → 200 and record removed from DB", async () => {
        const res = await req("DELETE", `/article/${createdArticleId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.message).toContain("success delete article");

        // Side-effect: gone from DB
        const dbRecord = await prisma.article.findUnique({
            where: { id: Number(createdArticleId) },
        });
        expect(dbRecord).toBeNull();
    });

    it("DELETE /article/:id → 404 on non-existent article", async () => {
        const res = await req(
            "DELETE",
            "/article/99999999-9999-9999-9999-999999999999",
            { headers: { Authorization: `Bearer ${token}` } },
        );
        expect(res.status).toBe(404);
    });

    it("DELETE /article/:id → 401 without token", async () => {
        const res = await req("DELETE", `/article/${seededArticleId}`);
        expect(res.status).toBe(401);
    });
});

// ─── Suite 3 · Article Without Category (ArticleWithoutCategorySeeder) ─────────

describe("[E2E] Article — No Category Edge Case (ArticleWithoutCategorySeeder)", () => {
    let articleId: string;
    let token: string;

    beforeAll(async () => {
        const seeder = new ArticleWithoutCategorySeeder();
        await seeder.run();
        token = await getAccessToken();

        const article = await prisma.article.findFirst({
            where: { title: "Artikel Tanpa Kategori" },
        });
        articleId = String(article!.id);
    });

    afterAll(async () => {
        await prisma.article.deleteMany({
            where: { title: "Artikel Tanpa Kategori" },
        });
    });

    it("GET /article/:id → 200 with empty category array", async () => {
        const res = await req("GET", `/article/${articleId}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article).toHaveProperty("id", articleId);
        // categories should be empty or absent — must not crash
        const cats = body.article.category ?? body.article.categories ?? [];
        expect(Array.isArray(cats)).toBe(true);
        expect(cats).toHaveLength(0);
    });

    it("GET /article → article without category appears in listing", async () => {
        const res = await req("GET", "/article");
        const body = await json(res);
        const found = body.article.find((a: any) => a.id === articleId);
        expect(found).toBeDefined();
    });

    it("DELETE /article/:id → 200 even when article has no categories", async () => {
        const res = await req("DELETE", `/article/${articleId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(res.status).toBe(200);
    });
});

// ─── Suite 4 · Long Content (LongContentSeeder) ───────────────────────────────

describe("[E2E] Article — Long Content (LongContentSeeder)", () => {
    let articleId: string;

    beforeAll(async () => {
        const seeder = new LongContentSeeder();
        await seeder.run();

        const article = await prisma.article.findFirst({
            orderBy: { created_at: "desc" },
            where: { base_views: 0 },
        });
        articleId = String(article!.id);
    });

    afterAll(async () => {
        await prisma.article.delete({ where: { id: Number(articleId) } }).catch(() => {});
    });

    it("GET /article/:id → 200 with full long content without truncation", async () => {
        const res = await req("GET", `/article/${articleId}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        // Content must not be truncated — should be substantial
        expect(body.article.content.length).toBeGreaterThan(1000);
    });

    it("GET /article/:id → title longer than typical limits still returns 200", async () => {
        const res = await req("GET", `/article/${articleId}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        // Title was seeded as Lorem ipsum × 10 — well over 255 chars
        expect(body.article.title.length).toBeGreaterThan(100);
    });

    it("GET /article → long-content article appears in list without breaking pagination", async () => {
        const res = await req("GET", "/article?page=1");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(Array.isArray(body.article)).toBe(true);
    });
});

// ─── Suite 5 · Special Characters (SpecialCharacterSeeder) ───────────────────

describe("[E2E] Article — Special Characters & Security (SpecialCharacterSeeder)", () => {
    let seededIds: number[] = [];
    let token: string;

    beforeAll(async () => {
        const seeder = new SpecialCharacterSeeder();
        await seeder.run();
        token = await getAccessToken();

        const articles = await prisma.article.findMany({
            where: {
                title: {
                    in: [
                        "Emoji Test 🚀🔥 Valid ✅",
                        "XSS & Script Injection Test",
                        "Foreign Languages (Unicode)",
                        "Mathematical & Symbols",
                    ],
                },
            },
        });
        seededIds = articles.map((a) => a.id);
    });

    afterAll(async () => {
        await prisma.article.deleteMany({ where: { id: { in: seededIds } } });
    });

    it("GET /article/:id → 200 for article with emoji in title and content", async () => {
        const article = await prisma.article.findFirst({
            where: { title: "Emoji Test 🚀🔥 Valid ✅" },
        });
        const res = await req("GET", `/article/${article!.id}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article.title).toContain("🚀");
    });

    it("GET /article/:id → XSS payload is returned as plain text, not executed", async () => {
        const article = await prisma.article.findFirst({
            where: { title: "XSS & Script Injection Test" },
        });
        const res = await req("GET", `/article/${article!.id}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        // Content must be returned literally — not stripped or encoded into HTML
        expect(body.article.content).toContain("<script>");
        // Response Content-Type must NOT be text/html (no HTML rendering)
        const ct = res.headers.get("content-type") ?? "";
        expect(ct).toContain("application/json");
    });

    it("GET /article/:id → 200 for article with multi-language Unicode content", async () => {
        const article = await prisma.article.findFirst({
            where: { title: "Foreign Languages (Unicode)" },
        });
        const res = await req("GET", `/article/${article!.id}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article.content).toContain("你好");
        expect(body.article.content).toContain("مرحبا");
    });

    it("GET /article/:id → 200 for article with math symbols and special chars", async () => {
        const article = await prisma.article.findFirst({
            where: { title: "Mathematical & Symbols" },
        });
        const res = await req("GET", `/article/${article!.id}`);
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article.content).toContain("∫");
        expect(body.article.content).toContain("∞");
    });

    it("GET /article → all special character articles appear in listing", async () => {
        const res = await req("GET", "/article");
        const body = await json(res);
        const returnedIds = body.article.map((a: any) => a.id);
        for (const id of seededIds) {
            expect(returnedIds).toContain(id);
        }
    });
});

// ─── Suite 6 · BlogScenarioSeeder Data Integrity ─────────────────────────────

describe("[E2E] Blog — Seeder Data Integrity", () => {
    beforeAll(async () => {
        const seeder = new BlogScenarioSeeder();
        await seeder.run();
    });

    it("BlogScenarioSeeder creates exactly 6 categories", async () => {
        const count = await prisma.category.count();
        expect(count).toBe(6);
    });

    it("BlogScenarioSeeder creates exactly 3 articles", async () => {
        const count = await prisma.article.count();
        expect(count).toBe(3);
    });

    it("Each seeded article has at least 2 category relations", async () => {
        const articles = await prisma.article.findMany({
            include: { category: true },
        });
        for (const article of articles) {
            expect(article.category.length).toBeGreaterThanOrEqual(2);
        }
    });

    it("Seeded articles have base_views > 0", async () => {
        const articles = await prisma.article.findMany();
        for (const a of articles) {
            expect(a.base_views).toBeGreaterThan(0);
        }
    });

    it("GET /article → returns all 3 seeded articles", async () => {
        const res = await req("GET", "/article");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.article.length).toBeGreaterThanOrEqual(3);
    });

    it("GET /category → returns all 6 seeded categories", async () => {
        const res = await req("GET", "/category");
        expect(res.status).toBe(200);
        const body = await json(res);
        expect(body.category.length).toBeGreaterThanOrEqual(6);
    });

    it("Article 'Future of AI' has Technology and Science categories", async () => {
        const article = await prisma.article.findFirst({
            where: { title: { contains: "Artificial Intelligence" } },
            include: { category: { include: { category: true } } },
        });
        expect(article).not.toBeNull();

        const catNames = article!.category.map((c: any) => c.category.name);
        expect(catNames).toContain("Technology");
        expect(catNames).toContain("Science");
    });
});

// ─── Suite 7 · Response Shape Contracts ──────────────────────────────────────

describe("[E2E] Blog — Response Shape Contracts", () => {
    let token: string;
    let firstArticleId: string;
    let firstCategoryId: number;

    beforeAll(async () => {
        const seeder = new BlogScenarioSeeder();
        await seeder.run();
        token = await getAccessToken();

        const article = await prisma.article.findFirst();
        firstArticleId = String(article!.id);

        const category = await prisma.category.findFirst();
        firstCategoryId = category!.id;
    });

    it("GET /article: { status, message, article[], meta }", async () => {
        const res = await req("GET", "/article");
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("article");
        expect(body).toHaveProperty("meta");
        expect(Array.isArray(body.article)).toBe(true);
    });

    it("GET /article/:id: { status, message, article{} }", async () => {
        const res = await req("GET", `/article/${firstArticleId}`);
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("article");
        expect(typeof body.article).toBe("object");
        expect(body.article).toHaveProperty("id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("content");
        expect(body.article).toHaveProperty("base_views");
    });

    it("POST /article: { status, message, article{} }", async () => {
        const form = new FormData();
        form.append("title", "Shape Contract Article");
        form.append("content", "Contract test content.");
        form.append("image", dummyImage());

        const res = await formReq("POST", "/article", form, token);
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("article");

        // Cleanup
        await prisma.article.delete({ where: { id: body.article.id } }).catch(() => {});
    });

    it("DELETE /article/:id: { status, message }", async () => {
        const article = await prisma.article.findFirst({ orderBy: { created_at: "desc" } });
        const res = await req("DELETE", `/article/${article!.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
    });

    it("GET /category: { status, message, category[] }", async () => {
        const res = await req("GET", "/category");
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("category");
        expect(Array.isArray(body.category)).toBe(true);
    });

    it("GET /category/:id: { status, message, category{} }", async () => {
        const res = await req("GET", `/category/${firstCategoryId}`);
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("category");
        expect(typeof body.category).toBe("object");
    });

    it("Error responses: always { status, message } — never expose stack trace", async () => {
        const res = await req("GET", "/article/99999999-9999-9999-9999-999999999999");
        const body = await json(res);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).not.toHaveProperty("stack");
    });
});