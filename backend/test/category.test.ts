import { describe, it, expect } from "bun:test";
import { getToken } from "./helpers/getToken";
import prisma from "../src/infrastructure/database/prisma/prisma";

// Base URL for the local API server
const BASE_URL = "https://localhost:2000";

export const headerVar = (token: string) => {
    return {
        "Content-Type": "application/json",
        "Origin": process.env.FRONT_END_URL || "http://localhost:3000",
        "Authorization": "Bearer " + token,
    };
};

/**
 * Standard headers for public or unauthenticated JSON requests
 */
export const header = {
    "Content-Type": "application/json",
    "Origin": process.env.FRONT_END_URL || "http://localhost:3000",
};

/**
 * Category Integration Tests
 * Validates CRUD operations and error handling for article categorization
 */
describe("Category API Integration Tests", () => {

    // Test: Successful single category creation
    it("should create a new category successfully", async () => {
        const auth = await getToken();
        const payload = { name: "politics" };
        
        const res = await fetch(`${BASE_URL}/category`, {
            method: "POST",
            headers: headerVar(auth.token),
            body: JSON.stringify(payload),
        });
        
        const result = await res.json();
        console.log("Create Response:", result);
        
        // Ensure the API returns 201 Created
        expect(res.status).toBe(201);
        expect(result.message).toContain("success");
    });

    // Test: Bulk category creation using a loop to test consistency
    it("should create multiple categories from a list", async () => {
        const auth = await getToken();
        const categoryNames = ["economy", "health", "international", "sports", "science", "space"];

        for (const name of categoryNames) {
            const payload = { name };

            const res = await fetch(`${BASE_URL}/category`, {
                method: "POST",
                headers: headerVar(auth.token),
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log(`Created Category [${name}]:`, result);
            expect(res.status).toBe(201);
        }
    });

    // Test: Public access to retrieve all category entries
    it("should retrieve a list of all categories without auth", async () => {
        const res = await fetch(`${BASE_URL}/category`, {
            headers: header,
        });
        const result = await res.json();
        
        expect(res.status).toBe(200);
        // Validate that the response body contains the category array
        expect(Array.isArray(result.category)).toBe(true);
    });

    // Test: Retrieve a single category using a valid ID from the database
    it("should find a specific category by ID", async () => {
        const existing = await prisma?.category.findFirst();
        if (!existing) return;

        const res = await fetch(`${BASE_URL}/category/${existing.id}`, {
            headers: header,
        });
        const result = await res.json();
        
        expect(res.status).toBe(200);
        expect(result.category.id).toBe(existing.id);
    });

    // Test: Authorized deletion of the most recent category entry
    it("should delete a category and return success message", async () => {
        const auth = await getToken();
        const target = await prisma?.category.findFirst({
            orderBy: { id: "desc" },
        });
        if (!target) return;

        const res = await fetch(`${BASE_URL}/category/${target.id}`, {
            method: "DELETE",
            headers: headerVar(auth.token),
        });

        const result = await res.json();
        expect(res.status).toBe(200);
        expect(result.message).toContain("success delete category");
    });

    // --- VALIDATION & ERROR HANDLING TESTS ---

    // Test: Zod validation for empty or invalid payloads
    it("should return 422 when category name is empty", async () => {
        const auth = await getToken();
        const payload = { name: "" };
        
        const res = await fetch(`${BASE_URL}/category`, {
            method: "POST",
            headers: headerVar(auth.token),
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        // 422 Unprocessable Entity is expected for schema validation failures
        expect(res.status).toBe(422);
        expect(result).toHaveProperty("error");
    });

    // Test: Unauthorized access protection (Missing Bearer Token)
    it("should return 401 when creating category without token", async () => {
        const payload = { name: "unauthorized_test" };
        
        const res = await fetch(`${BASE_URL}/category`, {
            method: "POST",
            headers: header, // No Authorization header
            body: JSON.stringify(payload),
        });

        expect(res.status).toBe(401);
    });

    // Test: Database constraint validation (Unique name check)
    it("should return error when creating a duplicate category name", async () => {
        const auth = await getToken();
        const existing = await prisma?.category.findFirst();
        if (!existing) return;

        const payload = { name: existing.name };

        const res = await fetch(`${BASE_URL}/category`, {
            method: "POST",
            headers: headerVar(auth.token),
            body: JSON.stringify(payload),
        });

        // Expecting a conflict or validation error depending on your controller setup
        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    // Test: Handling non-existent resources
    it("should return 404 when deleting a non-existent category", async () => {
        const auth = await getToken();
        const res = await fetch(`${BASE_URL}/category/999999`, {
            method: "DELETE",
            headers: headerVar(auth.token),
        });
        const log = await res.json();
        
        expect(res.status).toBe(404);
    });
});