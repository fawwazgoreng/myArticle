
declare global {
    interface Article {
        id: number,
        title: string,
        content: string,
        base_views: number,
        image: string,
        category?: { category: Category }[]
    }
    interface ArticleResponse extends GlobalResponse {
        article: Article 
    }
}
export { };