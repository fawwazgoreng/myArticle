import { ZodError } from "zod";
import { globalResponse } from "../type/global.type";
import { category, categoryResponse } from "./category.type";
import CategoryModel from "./category.model";
import { CategoryValidate } from "./category.validate";
import AppError from "../utils/error";

// Service responsible for writing category data
export default class WriteCategory {
    // Initialize validation and database model
    constructor(
        private categoryValidate = new CategoryValidate(),
        private categoryModel = new CategoryModel(),
    ) {}

    // Create a new category with validation
    create = async (req: { name: string }) => {
        // Validate incoming payload
        const validated = await this.categoryValidate.create(req);

        const if_exist = await this.categoryModel.findFirst(validated.name);
        if (if_exist) {
            throw new AppError(400, `category ${req.name} has created`);
        }

        // Insert category into database
        const category: category = await this.categoryModel.create(validated);

        // Build API response
        return {
            status: 201,
            message: "success create new category",
            category: category,
        } as categoryResponse;
    };

    // Update category name by ID
    update = async (req: { id: number; name: string }) => {
        // Validate incoming payload
        const validated = await this.categoryValidate.create(req);

        // Update category in database
        const category: category = await this.categoryModel.update(
            req.id,
            validated,
        );

        return {
            status: 200,
            message: "success update new category",
            category: category,
        } as categoryResponse;
    };

    // Delete category by ID
    delete = async (id: number) => {
        // Remove category from database
        await this.categoryModel.delete(id);
    };
}
