import { ReadRedis } from "./readRedis";
import { logger } from "../infrastructure/logger/log";
import categoryModel from "../model/category";
import { category, categoryResponse, categoryResponses } from "../service/types/category";
import { meta } from "../service/types/global";

// Service responsible for reading category data
export default class ReadCategory {

  private categoryModel;

  // Initialize category model dependency
  constructor() {
    this.categoryModel = new categoryModel();
  }

  // Retrieve all categories
  show = async () => {
    try {

      // Fetch category list from database
      const category = await new categoryModel().show();

      // Build API response
      const res : categoryResponses = {
        status: 200,
        message: "success get category",
        category: category
      };

      return res;

    } catch (error: any) {

      // Log error for monitoring
      logger.info(error);

      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error : error.error || ""
      };
    }
  };

  // Retrieve category with related articles and pagination
  find = async (req : {id: number , page: number, title: string , time: 'newest' | 'oldest' , populer: boolean}) => {
    try {

      // Fetch category and articles from database
      const res = await this.categoryModel.find(req);

      // Return empty response if category has no articles
      if (res.meta.count < 1) return {
        status: 200,
        message: "success get data",
        category:[]
      };

      // Collect article IDs for Redis view lookup
      const ids : string[] = [];

      res.category.article.forEach((value) => {
        const id = value?.id;

        if (id) {
          ids.push(String(id));
        }
      });

      // Retrieve latest view counters from Redis
      const redisValue = await new ReadRedis().readViews(ids);

      // Override article views with Redis values if available
      for (const [key , value] of Object.entries(redisValue)) {

        if (!value) continue;

        const findable = res.category.article.find(item => item?.id == Number(key));

        if (findable) {
          findable.base_views = Number(value);
        }
      }

      // Build final response structure
      const result: {
        category: category,
        meta : meta
      } = {
        category: res.category as category,
        meta: res.meta
      };

      return result;

    } catch (error : any) {

      // Normalize error response
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error.error
      };
    }
  };
}