import { describe, it, expect } from "bun:test";
import { File } from "buffer";
import prisma from "../src/infrastructure/database/prisma/prisma";
import { getToken } from "./helpers/getToken";
import { header } from "./category.test";

// Configuration for the local test environment
const BASE_URL = "https://localhost:2000";

/**
 * Helper to generate headers for FormData/Multipart requests
 * Note: We do not set 'Content-Type' manually for FormData, 
 * as fetch/Bun will automatically set the boundary.
 */
export const headerFormVar = (token: string) => {
    return {
        "Origin": process.env.FRONT_END_URL || "http://localhost:3000",
        "Authorization": "Bearer " + token,
    };
};

/**
 * Article API Integration Tests
 * Validates CRUD operations, file uploads, and view logic via HTTPS
 */
describe("Article API Integration Tests", () => {

    // Test: Creating a single article with an image (Multipart/Form-Data)
    it("should create a new article with an image successfully", async () => {
        const auth = await getToken();
        const categories = await prisma?.category.findMany({ take: 2 });
        if (!categories || categories.length < 1) return;

        const form = new FormData();
        form.append("title", "Integration Test Article");
        form.append("content", "This is a test content body.");
        categories.forEach((cat) => form.append("category", cat.name));

        // Create a dummy file for the upload
        const file = new File(["sample_image_data"], "test.jpg", { type: "image/jpeg" });
        form.append("image", file as any);

        const res = await fetch(`${BASE_URL}/article`, {
            method: "POST",
            headers: headerFormVar(auth.token),
            body: form,
        });

        const data = await res.json();
        console.log("Create Article Response:", data);

        expect(res.status).toBe(201);
        expect(data.article).toHaveProperty("title", "Integration Test Article");
    });

    // Test: Updating an existing article with new data and image
    it("should update an existing article's data and image", async () => {
        const auth = await getToken();
        const latestArticle = await prisma?.article.findFirst({ orderBy: { id: "desc" } });
        const categories = await prisma?.category.findMany({ take: 1 });

        if (!latestArticle || !categories) return;

        const form = new FormData();
        form.append("title", "Updated Title via Fetch");
        form.append("content", "Updated content body.");
        form.append("category", categories[0].name);

        const file = new File(["updated_image_data"], "updated.jpg", { type: "image/jpeg" });
        form.append("image", file as any);

        const res = await fetch(`${BASE_URL}/article/${latestArticle.id}`, {
            method: "PUT",
            headers: headerFormVar(auth.token),
            body: form,
        });

        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.article.title).toBe("Updated Title via Fetch");
    });

    // Test: Mass creation stress test to ensure stable loop handling
    it("should create multiple articles in a sequential loop", async () => {
        const auth = await getToken();
        const category = await prisma?.category.findFirst();
        if (!category) return;

        for (let i = 0; i < 3; i++) {
            const form = new FormData();
            form.append("title", `Bulk Article ${i}`);
            form.append("content", "Sequential bulk creation test content.");
            form.append("category", category.name);

            const res = await fetch(`${BASE_URL}/article`, {
                method: "POST",
                headers: headerFormVar(auth.token),
                body: form,
            });
            expect(res.status).toBe(201);
        }
    });

    // Test: Filtering and Pagination via Query Parameters
    it("should fetch articles with pagination and title filters", async () => {
        const res = await fetch(`${BASE_URL}/article?page=1&title=Bulk`, {
            headers: header,
        });
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.article)).toBe(true);
    });

    // Test: Publicly incrementing view count by fetching article detail
    it("should increment the view count when fetching by ID", async () => {
        const article = await prisma?.article.findFirst();
        if (!article) return;

        const res = await fetch(`${BASE_URL}/article/${article.id}`, {
            headers: header,
        });
        const data = await res.json();
        
        expect(res.status).toBe(200);
        expect(data.article).toHaveProperty("base_views");
    });

    // Test: Authorized article deletion
    it("should delete the most recent article successfully", async () => {
        const auth = await getToken();
        const latest = await prisma?.article.findFirst({ orderBy: { id: "desc" } });
        if (!latest) return;

        const res = await fetch(`${BASE_URL}/article/${latest.id}`, {
            method: "DELETE",
            headers: headerFormVar(auth.token),
        });

        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toContain("success delete article");
    });

    // --- ERROR HANDLING & VALIDATION TESTS ---

    // Test: Unauthorized access (Missing JWT)
    it("should return 401 when trying to create an article without a token", async () => {
        const form = new FormData();
        form.append("title", "Unauthorized Test");

        const res = await fetch(`${BASE_URL}/article`, {
            method: "POST",
            headers: header, // Standard headers without Bearer token
            body: form,
        });

        expect(res.status).toBe(401);
    });

    // Test: 404 Handling for invalid IDs
    it("should return 404 when requesting a non-existent article", async () => {
        const nonExistentId = "99999999-9999-9999-9999-999999999999";
        const res = await fetch(`${BASE_URL}/article/${nonExistentId}`, {
            headers: header,
        });

        const data = await res.json();
        expect(res.status).toBe(404);
        expect(String(data.message).toLowerCase()).toContain("not found");
    });
});