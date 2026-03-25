
declare global {
    interface Category {
        id?: number | null,
        name: string,
    }
    interface CategoryResponse extends GlobalResponse {
        category: Category[],
    }
}
export { };