import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import WriteArticle from "../write/article";
import { logger } from "../infrastructure/logger/log";
import ReadArticle from "../read/article";
import WriteRedis from "../events/write";
import { article, articlePayload, articleRedis } from "../types/article";
import { RedisKey } from "ioredis";
const index = new Hono();

const writeArticle = new WriteArticle();
const readArticle = new ReadArticle();
const writeRedis = new WriteRedis();



index
  .get("/", async (c) => {
    try {
      const { page, title, populer, oldest } = c.req.query();
      const time : 'newest' | 'oldest' = typeof oldest == "string" ? "oldest" : "newest";
      let payload = {
        page: Number(page) || 1,
        title,
        time,
        populer: Boolean(populer),
      }
      const article = await readArticle.show(payload);
      c.status((article.status as StatusCode) || 500);
      return c.json(article);
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
      const body = await c.req.parseBody({all: true});
      const categoryBody : string[] =  (Array.isArray(body['category']) ? body['category'] : body['category'] ? [String(body['category'])] : []) as string[];
      const payload : articlePayload  = {
        title: String(body['title']),
        content: String(body['content']),
        image: body['image'] ? body['image'] as File : null,
        category: categoryBody
      }
      const res = await writeArticle.create(payload);
      const redisPayload: articleRedis = {
        id: res.article.id as unknown as RedisKey,
        value: res.article.base_views,
      };
      const redis = await writeRedis.newArticle(redisPayload);
      if (redis == 404) {
        throw {
          status: 500,
          message: "failed write redis",
        };
      }
      c.status(res.status as StatusCode);
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
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const res: article = await readArticle.find(Number(id));
      const incr = await writeRedis.increment(String(res.id) as RedisKey);
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
index.onError(async (error: any, c) => {
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

export default index;
