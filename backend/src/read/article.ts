import { ReadRedis } from "../events/read";
import { logger } from "../infrastructure/logger/log";
import articleModel from "../model/article";
import { articleArrayResponse } from "../types/article";

export default class ReadArticle {
  private articleModel;
  constructor() {
    this.articleModel = new articleModel();
  }
  show = async (req : {page: number , title: string , time: "newest" | "oldest" , populer: boolean}) => {
    try {
      const article = await this.articleModel.show(req);
      if (article.meta.count < 1) return {
        status: 200,
        message: "success get data",
        article:[]
      };
      const ids : string[] = [];
      article.article.forEach((value) => {
        const id = value.id;
        if (id) {
          ids.push(String(id));
        }
      })
      const redisValue = await new ReadRedis().readAll(ids);
      for (const [key , value] of Object.entries(redisValue)) {
        if (!value) continue;
        const findable = article.article.find(item => item.id == Number(key));
        if (findable) {
          findable.base_views = Number(value);
        }
      }
      const res: articleArrayResponse = {
        status: 200,
        message: 'success get article',
        article: article.article,
        meta: article.meta
      };
      return res;
    } catch (error : any) {
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error.error
      }
    }
  }

  find = async (id : number) => {
    try {
      const article = await new articleModel().find(id);
      return article;
    } catch (error: any) {
      logger.info(error);
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error : error.error || ""
      }
    }
  }
}
