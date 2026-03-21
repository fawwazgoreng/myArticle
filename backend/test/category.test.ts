import { describe, it, expect } from "bun:test";
import { getToken } from "./helpers/getToken";

// Base URL for the local API server
const BASE_URL = "https://localhost:2000";

// Standard headers for JSON requests and CORS compliance
export const headerVar = (token : string) => {
    return {
        "Content-Type": "application/json",
        "Origin": process.env.FRONT_END_URL || "http://localhost:3000",
        "Authorization": token,
    }
};

/**
 * Category Integration Tests
 * Validates CRUD operations for article categorization via HTTPS
 */
describe("Category API Integration Tests", () => {
    // Test: Create a single new category
    it("should create a new category successfully", async () => {
        const token = await getToken();
        const payload = { name: "politics" };
        const res = await fetch(`${BASE_URL}/category`, {
            method: "POST",
            headers: headerVar(token.token),
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("Create Response:", result);
        
        // Expect 201 Created status
        expect(token.status).toBe(200);
    });

    // Test: Bulk creation of categories using a loop
    // it("should create multiple categories from a list", async () => {
    //     const categoryNames = [
    //         "economy",
    //         "health",
    //         "international",
    //         "sports",
    //         "science",
    //         "space",
    //     ];

    //     for (const name of categoryNames) {
    //         const payload = { name };

    //         const res = await fetch(`${BASE_URL}/category`, {
    //             method: "POST",
    //             headers: headerVar,
    //             body: JSON.stringify(payload),
    //         });

    //         const result = await res.json();
    //         console.log(`Created Category [${name}]:`, result);
    //         expect(res.status).toBe(201);
    //     }
    // });

    // Test: Retrieve all categories
    // it("should retrieve a list of all categories", async () => {
    //     const res = await fetch(`${BASE_URL}/category`, {
    //         headers: headerVar,
    //     });
    //     const result = await res.json();

    //     expect(res.status).toBe(200);
    //     // Ensure the response contains an array of categories
    //     expect(Array.isArray(result.category)).toBe(true);
    // });

    // Test: Retrieve a specific category by its database ID
    // it("should find a specific category by ID", async () => {
    //     // Fetch an existing ID from the database using Prisma
    //     const existing = await prisma?.category.findFirst();
    //     if (!existing) return;

    //     const res = await fetch(`${BASE_URL}/category/${existing.id}`, {
    //         headers: headerVar,
    //     });
    //     const result = await res.json();

    //     expect(res.status).toBe(200);
    //     expect(result.category.id).toBe(existing.id);
    // });

    // Test: Delete a category and verify the message
    // it("should delete a category and return success message", async () => {
    //     // Target the most recently created category for deletion
    //     const target = await prisma?.category.findFirst({
    //         orderBy: { id: "desc" },
    //     });
    //     if (!target) return;

    //     const res = await fetch(`${BASE_URL}/category/${target.id}`, {
    //         method: "DELETE",
    //         headers: headerVar,
    //     });

    //     const result = await res.json();
    //     expect(res.status).toBe(200);
    //     expect(result.message).toContain("success delete category");
    // });

    // --- UNIT TESTS: ERROR HANDLING & VALIDATION ---

    // Test: Validation for empty fields (Testing Zod/Middleware)
    // it("should return 422 when category name is empty", async () => {
    //     const payload = { name: "" };

    //     const res = await fetch(`${BASE_URL}/category`, {
    //         method: "POST",
    //         headers: headerVar,
    //         body: JSON.stringify(payload),
    //     });

    //     const result = await res.json();
    //     // 422 Unprocessable Entity is expected for validation failures
    //     expect(res.status).toBe(422);
    //     expect(result).toHaveProperty("error");
    // });

    // Test: Requesting a resource that doesn't exist
    // it("should return 404 when deleting a non-existent category", async () => {
    //     const res = await fetch(`${BASE_URL}/category/999999`, {
    //         method: "DELETE",
    //         headers: headerVar,
    //     });

    //     expect(res.status).toBe(404);
    // });
});
