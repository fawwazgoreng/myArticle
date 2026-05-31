import { article } from "@/article/article.type";
import { globalResponse } from "@type/global.type";

export interface categoryOnArticle {
    category_id: number;
    article_id: number;
    article?: article;
}

export type category = {
    id: number;
    name: string;
    article?: {
        id: number;
        title: string;
        image: string | null;
        base_views: number;
        created_at: Date;
        author: {
            id: string;
            name: string;
        };
    }[];
};
export interface categoryResponse extends globalResponse {
    category?: category;
}

export interface categoryResponses extends globalResponse {
    category?: category[];
}
