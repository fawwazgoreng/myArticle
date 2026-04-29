import { BaseRepositoryModel, BaseRepositoryRead, BaseRepositoryWrite } from "@infra/base.repository";
import { article, articleMeta } from "@/article/article.type";

export abstract class ArticleRepositoryModel implements BaseRepositoryModel<
    article,
    {article: article[], count: number}
> {
    abstract create(data: any): Promise<article>;
    abstract findById(id: number | string): Promise<article>;
    abstract update(data: any): Promise<article>;
    abstract delete(id: number | string): void;
    abstract show(data: any): Promise<{article: article[], count: number}>;
    abstract findImage(
        id: number,
    ): Promise<{ id: number; image: string | null } | null>;
    abstract replaceCategories(articleId: number, categoryIds: number[]): void;
    abstract raw(query: any): Promise<any>;
}


export abstract class ArticleRepositoryRead implements BaseRepositoryRead<article,articleMeta> {
    abstract show(data: any): Promise<articleMeta>;
    abstract findById(id: number | string): Promise<article>;
}

export abstract class ArticleRepositoryWrite implements BaseRepositoryWrite<article> {
    abstract create(data: any): Promise<article>;
    abstract update(data: any): Promise<article>;
    abstract delete(id: number | string): void;
    abstract checkPermission(id: number, profile: any): Promise<void>;
}