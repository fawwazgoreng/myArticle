import { ZodError } from "zod";
import { globalResponse } from "../types/global";
import { category, categoryResponse } from "../types/category";
import categoryModel from "../model/category";
import { categoryValidate } from "../service/validate/categoryValidate";

export default class WriteCategory {
  private categoryValidate;
  private categoryModel;
  constructor() {
    this.categoryValidate = new categoryValidate();
    this.categoryModel = new categoryModel();
  }
  create = async (req: {name : string}) => {
    try {
      const validated = await this.categoryValidate.create(req);
      const category: category = await this.categoryModel.create(validated);
      return {
        status: 201,
        message: "success create new category",
        category: category,
      } as categoryResponse;
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
  update = async (req: {id: number , name : string}) => {
    try {
      const validated = await this.categoryValidate.create(req);
      const category: category = await this.categoryModel.update(req.id,validated);
      return {
        status: 200,
        message: "success update new category",
        category: category,
      } as categoryResponse;
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
      await this.categoryModel.delete(id);
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
