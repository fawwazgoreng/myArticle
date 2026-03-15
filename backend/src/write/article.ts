import { ZodError } from "zod";
import articleModel from "../model/article";
import { articleValidate } from "../service/validate/articleValidate";
import {
  articleModelPayload,
  articlePayload,
  articleResponse,
} from "../service/types/article";
import { globalResponse } from "../service/types/global";
import { writeFile } from "./image";
import WriteRedis from "./writeRedis";

// Service responsible for writing article data
export default class WriteArticle {

  private articleValidate;
  private articleModel;
  private articleImage;
  private writeRedis;

  // Initialize validation, database model, image handler, and Redis writer
  constructor() {
    this.articleValidate = new articleValidate();
    this.articleModel = new articleModel();
    this.articleImage = new writeFile('article');
    this.writeRedis = new WriteRedis();
  }

  // Create a new article with validation, image upload, and Redis update
  create = async (req: articlePayload) => {
    try {

      // Validate incoming payload
      const validated: articlePayload = await this.articleValidate.create(req);

      let url = "";

      // Save uploaded image if provided
      if (req.image) url = await this.articleImage.write(req.image);

      // Prepare payload for database layer
      const payload: articleModelPayload = {
        title: validated.title,
        content: validated.content,
        image: url,
        category: validated.category
      };

      // Insert article into database
      const article = await this.articleModel.create(payload);

      // Update Redis cache for new article
      await this.writeRedis.newArticle(article);

      return {
        status: 201,
        message: "success create new article",
        article: article,
      };

    } catch (error: any) {

      // Handle validation errors
      if (error instanceof ZodError) {
        throw {
          status: 422,
          message: error.issues[0].message,
          error: error.issues,
        } as globalResponse;
      }

      // Fallback for unexpected errors
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error,
      } as globalResponse;
    }
  };

  // Update article data and synchronize image if changed
  update = async (id: number, req: articlePayload) => {
    try {

      // Validate update payload
      const validated = await this.articleValidate.update(req);

      // Retrieve current article image
      const lastImg =
        (await this.articleModel.findImage(id).then(data => data?.image)) || "";

      // Replace or keep existing image
      const url = this.articleImage.update(lastImg, req.image);

      // Prepare update payload
      const payload : articleModelPayload = {
        title: validated.title,
        content: validated.content,
        image: url,
        category: validated.category
      };

      // Update article in database
      const article = await this.articleModel.update(id, payload);

      const res : articleResponse = {
        status: 200,
        message: "succes update article",
        article: article
      };

      return res;

    } catch (error: any) {

      // Handle validation errors
      if (error instanceof ZodError) {
        throw {
          status: 422,
          message: error.issues[0].message,
          error: error.issues,
        } as globalResponse;
      }

      // Fallback error response
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error,
      } as globalResponse;
    }
  };

  // Delete article and remove associated image
  delete = async (id: number) => {
    try {

      // Remove article from database
      const article = await this.articleModel.delete(id);

      // Delete stored image if exists
      if (article.image) this.articleImage.update(article.image);

    } catch (error: any) {

      const res: globalResponse = {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error.error,
      };

      throw res;
    }
  };
}