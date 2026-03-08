import { ZodError } from "zod";
import articleModel from "../model/article";
import { articleValidate } from "../service/validate/articleValidate";
import {
  article,
  articleModelPayload,
  articlePayload,
  articleResponse,
} from "../types/article";
import { globalResponse } from "../types/global";
import { writeFile } from "./image";

export default class WriteArticle {
  private articleValidate;
  private articleModel;
  private articleImage;
  constructor() {
    this.articleValidate = new articleValidate();
    this.articleModel = new articleModel();
    this.articleImage = new writeFile('article');
  }
  create = async (req: articlePayload) => {
    try {
      const validated: articlePayload = await this.articleValidate.create(req);
      let url = "";
      if (req.image) url = await this.articleImage.write(req.image);
      const payload: articleModelPayload = {
        title: validated.title,
        content: validated.content,
        image: url,
        category: validated.category
      };
      const article = await this.articleModel.create(payload);
      return {
        status: 201,
        message: "success create new article",
        article: article,
      };
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw {
          status: 422,
          message: error.issues[0].message,
          error: error.issues,
        } as globalResponse;
      }
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error,
      } as globalResponse;
    }
  };
  update = async (id: number, req: articlePayload) => {
    try {
      const validated = await this.articleValidate.update(req);
      const lastImg = await this.articleModel.findImage(id).then(data => data?.image) || "";
      const url = this.articleImage.update(lastImg, req.image);
      const payload : articleModelPayload = {
        title: validated.title,
        content: validated.content,
        image: url,
        category: validated.category
      }
      const article = await this.articleModel.update(id, payload);
      const res : articleResponse = {
        status: 200,
        message: "succes update article",
        article: article[2]
      }
      return res;
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw {
          status: 422,
          message: error.issues[0].message,
          error: error.issues,
        } as globalResponse;
      }
      throw {
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error,
      } as globalResponse;
    }
  };
  delete = async (id: number) => {
    try {
      const article = await this.articleModel.delete(id);
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
