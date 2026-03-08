import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { logger } from "../infrastructure/logger/log";
const category = new Hono();
import WriteCategory from "../write/category";
import ReadCategory from "../read/category";
import { ReadRedis } from "../events/read";
import { categoryResponse } from "../types/category";

const writeCategori = new WriteCategory();
const readCategory = new ReadCategory();
const readRedis = new ReadRedis();

category
  .get("/", async (c) => {
    try {
      const res = await readCategory.show();
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
  .post("/", async (c) => {
    try {
      const request = await c.req.json();
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
  .put("/", async (c) => {
    try {
      const request = await c.req.json();
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
  .get("/:id", async (c) => {
    try {
      const {page , title , oldest , populer } = c.req.query();
      const id = Number(c.req.param('id'));
      const time : 'newest' | 'oldest' = typeof oldest == "string" ? "oldest" : "newest";
      let payload = {
        id : id,
        page : Number(page) || 1,
        title,
        time,
        populer : Boolean(populer)
      }
      const res: categoryResponse = await readCategory.find(payload);
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
  .delete("/:id", async (c) => {
    try {
      const id : number = Number(c.req.param("id"));
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
category.onError(async (error: any, c) => {
  logger.error(
    {
      path: c.req.path,
      method: c.req.method,
      status: error.status || 500,
      stack: Number(error.status) == 500 ? error.stack : "validate error",
    },
    error.message,
  );
  if (error instanceof HTTPException) {
    const res = error.getResponse();
    const body =
      (await res
        .clone()
        .json()
        .catch(() => null)) || (await res.clone().text());
    c.status((Number(body.status) as StatusCode) || 500);
    return c.json(body);
  }
  c.status((Number(error.status) as StatusCode) || 500);
  return c.json({
    status: error.status || 500,
    message: error.message || "internal server error",
    error: error.error || "",
  });
});

export default category;
