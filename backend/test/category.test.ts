import { describe, it, expect } from "bun:test";
import App from "../src/index";

export const headerVar =  {
  "Content-Type" : "application/json",
  "Origin" : process.env.FRONT_END_URL || "http://localhost:3001"
};

describe("category test", () => {
  it("should created", async () => {
    const payload = {
      name: "politik",
    };
    const res = await App.request("/category", {
      method: "POST",
      headers:headerVar,
      body: JSON.stringify(payload),
    });
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(201);
  });
  it("should created many category", async () => {
    const category = ["ekonomi" , "kesehatan" , "luar negeri" , "olahraga" , "sains" , "luar angkasa"];
    for (const item of category) {
      const payload = {
        name: item
      };
      const res = await App.request("/category", {
        method: "POST",
        headers:headerVar,
        body: JSON.stringify(payload),
      });
      const category = await res.json();
      console.log(category);
      expect(res.status).toBe(201);
    }
  });
  it("should success get data", async () => {
    const res = await App.request("/category");
    const category = await res.json();
    console.log(category);
    expect(res.status).toBe(200);
  });
  it("should success find data", async () => {
    const test = await prisma?.category.findFirst();
    const res = await App.request(`/category/${test?.id}`);
    const category = await res.json();
    console.log(category);
    expect(res.status).toBe(200);
  });
  it("should success filter data", async () => {
    const res = await App.request("/article?page=2&title=news");
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(200);
  });
  it("should deleted", async () => {
    const test = await prisma?.category.findFirst();
    const res = await App.request(`/category/${test?.id}`, {
      method: "DELETE",
      headers:headerVar,
    });
    const category = await res.json();
    expect(res.status).toBe(200);
    expect(category.message).toContain("success delete category");
  });
});
