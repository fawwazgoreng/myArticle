import { ZodError } from "zod";
import { globalResponse } from "../utils/global.type";
import { category, categoryResponse } from "./category.type";
import CategoryModel from "./category.model";
import { CategoryValidate } from "./category.validate";

// Service responsible for writing category data
export default class WriteCategory {

  // Initialize validation and database model
  constructor(
    private categoryValidate =  new CategoryValidate(),
    private categoryModel = new CategoryModel(),
  ){}

  // Create a new category with validation
  create = async (req: {name : string}) => {
    try {

      // Validate incoming payload
      const validated = await this.categoryValidate.create(req);

      // Insert category into database
      const category: category = await this.categoryModel.create(validated);

      // Build API response
      return {
        status: 201,
        message: "success create new category",
        category: category,
      } as categoryResponse;

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

  // Update category name by ID
  update = async (req: {id: number , name : string}) => {
    try {

      // Validate incoming payload
      const validated = await this.categoryValidate.create(req);

      // Update category in database
      const category: category = await this.categoryModel.update(req.id, validated);

      return {
        status: 200,
        message: "success update new category",
        category: category,
      } as categoryResponse;

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

  // Delete category by ID
  delete = async (id: number) => {
    try {

      // Remove category from database
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