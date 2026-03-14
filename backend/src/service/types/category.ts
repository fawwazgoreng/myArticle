import { article } from "./article";
import { globalResponse } from "./global";
import category from "../routes/category";

export interface categoryOnArticle {
  category_id : number,
  article_id : number,
  article?: article,
}

export type category = {
  id: number,
  name: string
  article?: article[] | null
}
export interface categoryResponse extends globalResponse {
  category?: category
}

export interface categoryResponses extends globalResponse {
  category?: category[]
}
