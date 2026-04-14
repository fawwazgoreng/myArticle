export abstract class BaseRepositoryModel<T , R  = T[]> {
    abstract create(data: any): Promise<T>
    abstract findById(id: number | string): Promise<T>
    abstract update(data: any): Promise<T>
    abstract delete(id: number | string): void
    abstract show(data: any): Promise<R>
} 

export abstract class BaseRepositoryRead<T, R = T[]> {
    abstract findById(id: number | string): Promise<T>
    abstract show(data: any): Promise<R>
}

export abstract class BaseRepositoryWrite<T> {
    abstract create(data: any): Promise<T>
    abstract update(data: any): Promise<T>
    abstract delete(id: number | string): void
}