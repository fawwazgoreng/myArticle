export default class AppError extends Error {
    public readonly statusCode: number;
    public readonly message: string;
    public readonly errorCode: string;
    public readonly details: any;
    constructor(statusCode:number = 500, message:string = "internal server error" , errorCode:string = "INTERNAL_SEVER_ERROR" , details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
        this.details = details;
    }
}