import prisma from "../infrastructure/database/prisma/prisma";
import { articleModelPayload, articlePayload, order } from "../types/article";
import { PrismaClientKnownRequestError, Sql } from "../infrastructure/database/generated/prisma/runtime/client";
import { findPage } from "../service/findPage";
import { meta } from "../types/global";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { logger } from "../infrastructure/logger/log";

export default class articleModel {
  show = async (req : {page: number, title: string , time: 'newest' | 'oldest' , populer: boolean}) => {
    try {
      const page = findPage(req);
      const isNew: Prisma.SortOrder = page.time == "newest" ? "desc" : "asc";
      const populer : Prisma.SortOrder = req.populer ? "desc" : "asc";
      let orderBy: any = [
      ];
      if (req.populer) orderBy.push({ base_views: populer },);
      orderBy.push({ id: isNew });
      const take = 30;
      const [article, count] = await prisma.$transaction([
        prisma.article.findMany({
          take: take,
          skip: page.skip,
          orderBy: orderBy,
          where: {
            title: {
              startsWith: page.title ?? ''
            }
          },
          select: {
            id: true,
            title: true,
            content: true,
            base_views: true,
            image: true,
            category: {
              select: {
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
        }),
        prisma.article.count({})
        ]);
      const meta : meta = {
        firstPage: 1,
        currentPage: req.page,
        lastPage: Math.ceil(count / take),
        count
      }
      const res = {
        article,
        meta
      };
      return res;
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
  create = async (req: articleModelPayload) => {
    try {
        const cate = await prisma.category.findMany({
          where: {
            name: {
              in: req.category
            }
          },
          select: {
            id: true,
          }
        })
        const category = cate.map(item => ({category_id : item.id}))
      const article = await prisma.article.create({
        data: {
          title: req.title,
          content: req.content,
          image: req.image,
          category: {
            create: category
          }
        },
      });
      return article;
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
  find = async (id: number) => {
    try {
      const article = await prisma.article.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          title: true,
          content: true,
          base_views: true,
          image: true,
          category: {
            select: {
              category: true
            },
          },
        },
      });
      if (!article?.id) {
        throw {
          status: 404,
          message: "article id " + id + " not found",
        };
      }
      return article;
    } catch (error) {
      throw {
        status: 404,
        message: "article id " + id + " not found",
      };
    }
  };
  update = async (id: number, req: articleModelPayload) => {
    try {
      const cate = await prisma.categoryOnArticle.findMany({
        where: {
          article_id: id
        },
        select: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      const addCategory = req.category.map(name => {
        const findable = cate.find(item => item.category?.name == name);
        if (findable) return null;
        return name;
      }).filter(item => item != null);
      const idsAddCategory = await prisma.category.findMany({
        where: {
          name: {
            in: addCategory.map(name => name)
          }
        },
        select: {
          id: true,
          name: true
        }
      })
      const deleteCategory = cate.map(item => !req.category.includes(String(item.category?.name)) ? item.category : null).filter(item => item != null);
      logger.info({message : "add categ" , addCategory})
      logger.info({message : "delete categ" , deleteCategory})
      const article = await prisma.$transaction([
        prisma.categoryOnArticle.deleteMany({
          where: {
            article_id: id,
            category: {
              name: {
                in: deleteCategory.map(item => item.name)
              }
            }
          }
        }),
        prisma.categoryOnArticle.createMany({
          data: idsAddCategory.map(item => ({
            article_id: id,
            category_id: item.id
          }))
        }),
        prisma.article.update({
          where: {
            id: id,
          },
          data: {
            title: req.title,
            content: req.content,
            image: req.image,
          },
        })
      ]);
      if (!article?.[2].id) {
        throw {
          status: 404,
          message: "article id " + id + " not found",
        };
      }
      return article;
    } catch (error : any) {
      throw {
        status: 500,
        message: error.message,
      };
    }
  };
  delete = async (id: number) => {
    try {
      const article = await prisma.article.delete({
        where: {
          id: id,
        },
      });
      if (!article) {
        throw {
          status: 404,
          message: "article id " + id + " not found",
        };
      }
      return article;
    } catch (error) {
      throw {
        status: 404,
        message: "article id " + id + " not found",
      };
    }
  };
  sync = async (req: {key: string , val: string | null}[]) => {
    try {
      const condition : Sql[] = [];
      const ids : number[] = [];
      req.filter(item => !isNaN(Number(item.key.split(':')[2])) && !isNaN(Number(item.val))).forEach(item => {
        const id = Number(item.key.split(':')[2]);
        const val = Number(item.val);
        condition.push(Prisma.sql`WHEN id = ${id} THEN ${val}`);
        ids.push(id);
      });
      const queryCase = Prisma.join(condition , ' ');
      const inId = Prisma.join(ids , ',');
      const query = Prisma.sql`
        UPDATE "Article" SET base_views = CASE ${queryCase} ELSE base_views END where id in(${inId})
        `;
      const res = await prisma.$executeRaw(query);
      return res;
    } catch (error: any) {
      throw {
        status: 500,
        message: error || "internal server error",
      };
    }
  };
  findImage = async (id: number) => {
    try {
      const article = await prisma.article.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          image: true
        },
      });
      if (!article?.id) return null;
      return article;
    } catch (error) {
      return null;
    }
  }
}
