import { ReadRedis } from "../events/read";
import { logger } from "../infrastructure/logger/log";
import categoryModel from "../model/category";
import { categoryResponse, categoryResponses } from "../types/category";

export default class ReadCategory {
  private categoryModel;
  constructor() {
    this.categoryModel = new categoryModel();
  }
  show = async () => {
    try {
      const category = await new categoryModel().show();
      const res : categoryResponses = {
        status: 200,
        message: "success get category",
        category: category
      }
      return res;
    } catch (error: any) {
      logger.info(error);
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error : error.error || ""
      }
    }
  }
  find = async (req : {id: number , page: number, title: string , time: 'newest' | 'oldest' , populer: boolean}) => {
    try {
      const res = await this.categoryModel.find(req);
      return res;
      if (res.meta.count < 1) return {
        status: 200,
        message: "success get data",
        category:[]
      };
      const ids : string[] = [];
      res.category.article.forEach((value) => {
        const id = value?.id;
        if (id) {
          ids.push(String(id));
        }
      })
      const redisValue = await new ReadRedis().readAll(ids);
      for (const [key , value] of Object.entries(redisValue)) {
        if (!value) continue;
        const findable = res.category.article.find(item => item?.id == Number(key));
        if (findable) {
          findable.base_views = Number(value);
        }
      }
      const result: categoryResponse = {
        status: 200,
        message: 'success get article',
        category: res.category,
        meta: res.meta
      };
      return result;
    } catch (error : any) {
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error.error
      }
    }
  }
}
