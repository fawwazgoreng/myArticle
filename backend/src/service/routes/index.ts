import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import WriteArticle from "../../write/article";
import ReadArticle from "../../read/article";
import WriteRedis from "../../write/writeRedis";
import { article, articlePayload, articleRedis } from "../types/article";
import { RedisKey } from "ioredis";

// Create router instance for article endpoints
const index = new Hono();

// Initialize service classes for database and Redis operations
const writeArticle = new WriteArticle();
const readArticle = new ReadArticle();
const writeRedis = new WriteRedis();

index
  // GET /article
  // Retrieve list of articles with pagination, filter, and sorting
  .get("/", async (c) => {
    try {
      // Extract query parameters
      const { page, title, populer, oldest } = c.req.query();

      // Determine sorting order based on query
      const time: "newest" | "oldest" =
        typeof oldest == "string" ? "oldest" : "newest";

      // Prepare payload for database query
      let payload = {
        page: Number(page) || 1,
        title,
        time,
        populer: Boolean(populer),
      };

      // Fetch articles from database
      const article = await readArticle.show(payload);

      c.status((article.status as StatusCode) || 500);
      return c.json(article);
    } catch (error: any) {
      // Return structured error response
      const res = c.json({
        status: error.status,
        message: error.message,
        error: error.error,
      });

      throw new HTTPException(error.status, { res });
    }
  })

  // POST /article
  // Create a new article with optional image upload and category relations
  .post("/", async (c) => {
    try {
      // Parse multipart/form-data body
      const body = await c.req.parseBody({ all: true });

      // Normalize category input to always be an array
      const categoryBody: string[] = (
        Array.isArray(body["category"])
          ? body["category"]
          : body["category"]
          ? [String(body["category"])]
          : []
      ) as string[];

      // Construct payload for article creation
      const payload: articlePayload = {
        title: String(body["title"]),
        content: String(body["content"]),
        image: body["image"] ? (body["image"] as File) : null,
        category: categoryBody,
      };

      // Create article in database
      const res = await writeArticle.create(payload);

      c.status(res.status as StatusCode);

      // Throw error if status code indicates failure
      if (res.status > 300) {
        throw res;
      }

      return c.json(res);
    } catch (error: any) {
      const res = c.json({
        status: error.status,
        message: error.message,
        error: error.error,
      });

      throw new HTTPException(error.status, { res });
    }
  })

  // GET /article/:id
  // Retrieve a single article by ID and increment view counter in Redis
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");

      // Fetch article data from database
      const res: article = await readArticle.find(Number(id));

      // Increment view counter in Redis
      const incr = await writeRedis.increment(String(res.id) as RedisKey);

      // Update article view count with Redis value
      res.base_views = incr;

      c.status(200);

      return c.json({
        status: 200,
        message: "succes get article",
        article: res,
      });
    } catch (error: any) {
      const res = c.json({
        status: error.status,
        message: error.message,
        error: error.error,
      });

      throw new HTTPException(error.status, { res });
    }
  })

  // PUT /article/:id
  // Update an existing article (currently commented out)
  .put("/:id" , async (c) => {
    try {
      const request = await c.req.json();
      const id = Number(c.req.param("id"));
      const res = await writeArticle.update(id , request);
      c.status(res.status as StatusCode);
      return c.json(res);
    } catch (error : any) {
      const res = c.json({
        status: error.status,
        message: error.message,
        error: error.error,
      });
      throw new HTTPException(error.status, { res });
    }
  })

  // DELETE /article/:id
  // Remove article from database and delete related Redis cache
  .delete("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      await writeArticle.delete(Number(id));
      await writeRedis.delete(id as RedisKey);
      c.status(200);
      return c.json({
        status: 200,
        message: "success delete article id" + id,
      });
    } catch (error: any) {
      const res = {
        status: error.status,
        message: error.message,
        error: error.error,
      };
      throw new HTTPException(res.status, res);
    }
  });

export default index;