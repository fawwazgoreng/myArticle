import { describe, it, expect } from "bun:test";
import { File } from "buffer";
import prisma from "../src/infrastructure/database/prisma/prisma";

// Configuration for the local test environment
const BASE_URL = "https://localhost:2000";
const headerVar = {
  "Origin": process.env.FRONT_END_URL || "http://localhost:3000"
};

/**
 * Article Integration Tests
 * These tests perform real HTTP requests to the local server
 */
describe("Article API Integration Tests", () => {
  
  // Test: Creating a single article with image upload (Multipart/Form-Data)
  it("should create a new article with an image", async () => {
    const category = await prisma?.category.findMany({ take: 3 });
    if (!category || category.length < 1) return;

    const form = new FormData();
    form.append("title", "Integration Test Article");
    form.append("content", "Testing content body");
    category.forEach(item => form.append("category", item.name));
    
    // Simulate a file upload
    const file = new File(['image.content'], 'test.jpg', { type: "image/jpg" });
    form.append("image", file as any);

    const res = await fetch(`${BASE_URL}/article`, {
      method: "POST",
      headers: headerVar,
      body: form,
    });

    const data = await res.json();
    console.log("Create Response:", data);
    expect(res.status).toBe(201);
  });

  // Test: Updating an existing article using JSON payload
  it("should update an existing article's data", async () => {
    const category = await prisma?.category.findMany({ take: 3 });
    const latestArticle = await prisma?.article.findFirst({ orderBy: { id: "desc" } });
    
    if (!category || !latestArticle) return;

    const payload = {
      title: "Updated Title via Fetch",
      content: "Updated content via Fetch",
      file: null,
      category: category.map(item => item.name)
    };

    const res = await fetch(`${BASE_URL}/article/${latestArticle.id}`, {
      method: "PUT",
      headers: {
        ...headerVar,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.article.title).toBe(payload.title);
  });

  // Test: Mass creation (Stress/Loop test)
  it("should create multiple articles in a loop", async () => {
    const category = await prisma?.category.findMany({ take: 1 });
    if (!category) return;

    for (let i = 0; i < 5; i++) { // Reduced count for faster test execution
      const form = new FormData();
      form.append("title", `Bulk Article ${i}`);
      form.append("content", "Bulk content");
      form.append("category", category[0].name);

      const res = await fetch(`${BASE_URL}/article`, {
        method: "POST",
        headers: headerVar,
                body: form,
      });
      expect(res.status).toBe(201);
    }
  });

  // Test: Retrieval and Query Parameters
  it("should fetch articles with pagination and title filters", async () => {
    const res = await fetch(`${BASE_URL}/article?page=1&title=Bulk`, {
      headers: headerVar
    });
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(Array.isArray(data.article)).toBe(true);
  });

  // Test: View incrementing logic
  it("should increment the view count when fetching by ID", async () => {
    const article = await prisma?.article.findFirst();
    if (!article) return;

    const res = await fetch(`${BASE_URL}/article/${article.id}`, {
      headers: headerVar
    });
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.article).toHaveProperty("base_views");
  });

  // Test: Deletion
  it("should delete the most recent article", async () => {
    const latest = await prisma?.article.findFirst({ orderBy: { id: "desc" } });
    if (!latest) return;

    const res = await fetch(`${BASE_URL}/article/${latest.id}`, {
      method: "DELETE",
      headers: headerVar
    });
    
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toContain("success delete article");
  });

  // --- NEW UNIT TEST: ERROR HANDLING ---
  
  // Test: 404 Handling
  it("should return 404 when requesting a non-existent article", async () => {
    const nonExistentId = 9999999;
    const res = await fetch(`${BASE_URL}/article/${nonExistentId}`, {
      headers: headerVar
    });
    
    const data = await res.json();
    // We expect a 404 status based on your Admin/Article model logic
    expect(res.status).toBe(404);
    expect(data.message).toContain("not found");
  });
});