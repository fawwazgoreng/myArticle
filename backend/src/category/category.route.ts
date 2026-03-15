import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { logger } from "../infrastructure/logger/log";
import WriteCategory from "./category.write";
import ReadCategory from "./category.read";
import { ReadRedis } from "../infrastructure/redis/redis.read";
import { category, categoryResponse } from "./category.type";
import { meta } from "../utils/global.type";

// Create a new Hono router instance for category endpoints
const category = new Hono();

// Initialize service classes for write and read operations
const writeCategori = new WriteCategory();
const readCategory = new ReadCategory();
const readRedis = new ReadRedis();

category
  // GET /category
  // Retrieve all categories from the database
  .get("/", async (c) => {
    try {
      const res = await readCategory.show();

      // If status code indicates an error, throw it to be handled by error middleware
      if (res.status > 300) {
        throw res;
      }

      c.status(res.status as StatusCode);
      return c.json(res);
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

  // POST /category
  // Create a new category
  .post("/", async (c) => {
    try {
      // Parse request body
      const request = await c.req.json();

      // Call write service to create category
      const res = await writeCategori.create(request);

      if (res.status > 300) {
        throw res;
      }

      c.status(res.status as StatusCode);
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

  // PUT /category
  // Update an existing category
  .put("/", async (c) => {
    try {
      const request = await c.req.json();

      // Reusing create method (possibly acts as upsert)
      const res = await writeCategori.create(request);

      if (res.status > 300) {
        throw res;
      }

      c.status(res.status as StatusCode);
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

  // GET /category/:id
  // Retrieve a specific category with filters and pagination
  .get("/:id", async (c) => {
    try {
      // Extract query parameters
      const { page, title, oldest, populer } = c.req.query();

      // Convert id param to number
      const id = Number(c.req.param("id"));

      // Determine sorting order
      const time: "newest" | "oldest" =
        typeof oldest == "string" ? "oldest" : "newest";

      // Prepare payload for query
      let payload = {
        id: id,
        page: Number(page) || 1,
        title,
        time,
        populer: Boolean(populer),
      };

      // Fetch category data
        const res = await readCategory.find(payload);

      c.status(200);
      return c.json({
        status: 200,
        message: "succes get category",
        category: res,
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

  // DELETE /category/:id
  // Delete a category by its ID
  .delete("/:id", async (c) => {
    try {
      const id: number = Number(c.req.param("id"));

      // Call write service to delete category
      await writeCategori.delete(id);

      c.status(200);
      return c.json({
        status: 200,
        message: "success delete category id" + id,
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

// Global error handler for this router
category.onError(async (error: any, c) => {
  // Log error information for debugging and monitoring
  logger.error(
    {
      path: c.req.path,
      method: c.req.method,
      status: error.status || 500,
      stack: Number(error.status) == 500 ? error.stack : "validate error",
    },
    error.message,
  );

  // Handle HTTPException separately
  if (error instanceof HTTPException) {
    const res = error.getResponse();

    // Attempt to extract response body
    const body =
      (await res.clone().json().catch(() => null)) ||
      (await res.clone().text());

    c.status((Number(body.status) as StatusCode) || 500);
    return c.json(body);
  }

  // Default error response
  c.status((Number(error.status) as StatusCode) || 500);
  return c.json({
    status: error.status || 500,
    message: error.message || "internal server error",
    error: error.error || "",
  });
});

export default category;