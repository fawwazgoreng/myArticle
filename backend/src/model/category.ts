import prisma from "../infrastructure/database/prisma/prisma";
import { PrismaClientKnownRequestError } from "../infrastructure/database/generated/prisma/runtime/client";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { logger } from "../infrastructure/logger/log";
import { findPage } from "../service/findPage";
import { meta } from "../service/types/global";
import { categoryResponse } from "../service/types/category";

export default class categoryModel {
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
      const res = {
        status: 500,
        message: error.message || "internal server error",
        error: error,
      };
      logger.error(res);
      throw res;
    }
  };
  create = async (req: {name : string}) => {
    try {
      const category = await prisma.category.create({
        data: {
          name: req.name,
        },
      });
      return category;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw {
          status: 400,
          message: Object.values(error.message)[0],
          error: error.message,
        };
      }
      throw {
        status: 500,
        message: "internal server error",
        error: error.message,
      };
    }
  };
    find = async (req : {id: number , page: number, title: string , time: 'newest' | 'oldest' , populer: boolean}) => {
    try {
      const page = findPage(req);
      const isNew: Prisma.SortOrder = page.time == "newest" ? "desc" : "asc";
      const populer : Prisma.SortOrder = req.populer ? "desc" : "asc";
      let orderBy: any = [
      ];
      if (req.populer) orderBy.push({ base_views: populer },);
      orderBy.push({ article_id: isNew });
      const take = 10;
      const [category , count] = await prisma.$transaction([
        prisma.category.findFirst({
          where: {
            id: req.id,
          },
          select: {
            id: true,
            name: true,
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
        prisma.categoryOnArticle.count({
          where: {
            category_id: req.id
          }
        })
        ]);
      if (!category?.id) {
        throw {
          status: 404,
          message: "category id " + req.id + " not found",
        };
      }
      const meta : meta = {
        firstPage: 1,
        currentPage: req.page,
        lastPage: Math.ceil(count / take),
        count
      }
      const res = {
        ...category,
        article: category.article.map(item => item.article)
      };
      return {
          category : res,
          meta
      }
    } catch (error) {
      throw {
        status: 404,
        message: "category id " + req.id + " not found",
      };
    }
  };
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
