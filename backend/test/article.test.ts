import { describe, it, expect } from "bun:test";
import App from "../src/index";
import { File } from "buffer";

const headerVar =  {
  "Origin" : process.env.FRONT_END_URL || "http://localhost:3001"
};

describe("article test", () => {
  it("should created", async () => {
    const category = await prisma?.category.findMany({
      take: 3
    });
    if (!category || category.length < 1) return;
    const form = new FormData();
    form.append("title" , "article" );
    form.append("content" , "article123" );
    category.map(item => {
      form.append("category" , item.name)
    });
    const file = new File(['image.content'] , 'test.jpg' , {type: "image/jpg"})
    form.append("image" , file);
    const res = await App.request("/article", {
      method: "post",
      headers:headerVar,
      body: form,
    });
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(201);
  });
  it("should updated artcile", async () => {
    const category = await prisma?.category.findMany({
      take: 3
    });
    if (!category || category.length < 1) return;
    const cat = category.map(item => item.name);
    const ids = await prisma?.article.findFirst({
      orderBy: {
        id: "desc"
      }
    })
    const payload = {
      title: "ini sudah diupdate",
      content: "ini sudah diupdate",
      file: null,
      category: cat
    };
    const res = await App.request(`/article/${ids?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(200);
  });
  it("should created many article", async () => {
    const category = await prisma?.category.findMany({
      take: 3
    });
    if (!category) return console.log("category has empty ");
    for (let i = 1; i < 20; i++) {
      const form = new FormData();
      form.append("title" , "article" );
      form.append("content" , "article123" );
      category.map(item => {
        form.append("category" , item.name)
      });
      const file = new File(['image.content'] , 'test.jpg' , {type: "image/jpg"})
      form.append("image" , file);
      const res = await App.request("/article", {
        method: "POST",
        headers: headerVar,
        body: form,
      });
      const article = await res.json();
      console.log(article);
      expect(res.status).toBe(201);
    }
  })
  it("should success get data", async () => {
    const res = await App.request("/article");
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(200);
  });
  it("should success filter data", async () => {
    const res = await App.request("/article?page=2&title=news");
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(200);
  });
  it("should incrementing", async () => {
    const test = await prisma?.article.findFirst();
    const res = await App.request(`/article/${test?.id}`);
    const article = await res.json();
    console.log(article);
    expect(res.status).toBe(200);
  });
  it("should deleted", async () => {
    const test = await prisma?.article.findFirst({
      orderBy: {
        id: "desc"
      }
    });
    const res = await App.request(`/article/${test?.id}`, {
      method: "DELETE"
    });
    const article = await res.json();
    expect(res.status).toBe(200);
    expect(article.message).toContain("success delete article");
  });
});
