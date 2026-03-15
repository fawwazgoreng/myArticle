import prisma from "../infrastructure/database/prisma/prisma";
import { PrismaClientKnownRequestError } from "../infrastructure/database/generated/prisma/runtime/client";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { logger } from "../infrastructure/logger/log";
import { findPage } from "../service/findPage";
import { meta } from "../service/types/global";

// Category model responsible for database operations related to categories
export default class categoryModel {

  // Retrieve all categories
  show = async () => {
    try {
      const category = await prisma.category.findMany({
        select: {
          id: true,
          name: true
        }
      });

      return category;

    } catch (error: any) {

      // Log unexpected errors
      const res = {
        status: 500,
        message: error.message || "internal server error",
        error: error,
      };

      logger.error(res);
      throw res;
    }
  };

  // Create a new category
  create = async (req: {name : string}) => {
    try {

      const category = await prisma.category.create({
        data: {
          name: req.name,
        },
      });

      return category;

    } catch (error: any) {

      // Handle known Prisma errors (ex: duplicate name)
      if (error instanceof PrismaClientKnownRequestError) {
        throw {
          status: 400,
          message: Object.values(error.message)[0],
          error: error.message,
        };
      }

      // Fallback for unexpected errors
      throw {
        status: 500,
        message: "internal server error",
        error: error.message,
      };
    }
  };

  // Retrieve a category with its articles and pagination
  find = async (req : {id: number , page: number, title: string , time: 'newest' | 'oldest' , populer: boolean}) => {
    try {

      // Normalize pagination parameters
      const page = findPage(req);

      // Determine sorting direction for article time
      const isNew: Prisma.SortOrder = page.time == "newest" ? "desc" : "asc";

      // Determine sorting direction for popularity
      const populer : Prisma.SortOrder = req.populer ? "desc" : "asc";

      // Build dynamic sorting configuration
      let orderBy: any = [];

      if (req.populer) orderBy.push({ base_views: populer });

      orderBy.push({ article_id: isNew });

      const take = 10;

      // Fetch category data and article count in a transaction
      const [category , count] = await prisma.$transaction([
        prisma.category.findFirst({
          where: {
            id: req.id,
          },
          select: {
            id: true,
            name: true,

            // Retrieve related articles
            article: {
              take: take,
              orderBy: orderBy,
              select: {
                article_id: true,
                article: true
              }
            }
          },
        }),

        // Count total related articles
        prisma.categoryOnArticle.count({
          where: {
            category_id: req.id
          }
        })
      ]);

      // Throw error if category not found
      if (!category?.id) {
        throw {
          status: 404,
          message: "category id " + req.id + " not found",
        };
      }

      // Build pagination metadata
      const meta : meta = {
        firstPage: 1,
        currentPage: req.page,
        lastPage: Math.ceil(count / take),
        count
      };

      // Transform relation result to pure article array
      const res = {
        ...category,
        article: category.article.map(item => item.article)
      };

      return {
        category : res,
        meta
      };

    } catch (error) {
      throw {
        status: 404,
        message: "category id " + req.id + " not found",
      };
    }
  };

  // Update category name
  update = async (id: number, req: {name: string}) => {
    try {

      const category = await prisma.category.update({
        where: {
          id: id,
        },
        data: {
          name: req.name
        },
      });

      if (!category?.id) {
        throw {
          status: 404,
          message: "category id " + id + " not found",
        };
      }

      return category;

    } catch (error) {
      throw {
        status: 404,
        message: "category id " + id + " not found",
      };
    }
  };

  // Delete category by ID
  delete = async (id: number) => {
    try {

      const category = await prisma.category.delete({
        where: {
          id: id,
        },
      });

      if (!category) {
        throw {
          status: 404,
          message: "category id " + id + " not found",
        };
      }

      return category;

    } catch (error) {
      throw {
        status: 404,
        message: "category id " + id + " not found",
      };
    }
  };
}