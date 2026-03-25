
declare global {
    interface Category {
        id: number,
        title: string,
        content: string,
        base_views: number,
        image: string,
    }
    interface CategoryResponse extends GlobalResponse {
        category: Category,
        article?: Article[] | Article
    }
}
export { };