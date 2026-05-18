import { ZodError } from "zod";
import AppError from ".";
import { PrismaClientKnownRequestError } from "@infra/database/generated/prisma/runtime/client";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

export const mapToAppError = (error: any): AppError => {
    // 1. Zod Validation Error
    if (error instanceof ZodError) {
        return new AppError(422, error.issues[0].message, "VALIDATION_ERROR", error.flatten())
    }
    // 2. Prisma Errors
    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2025":
                return new AppError(404, "Record not found", "NOT_FOUND")
            case "P2002":
                return new AppError(409, "Data already exists", "CONFLICT_ERROR")
            default:
                return new AppError(500, `Database Error: ${error.code}`, "DATABASE_ERROR", { prismaCode: error.code })
        }
    }
    // 3. Custom AppError — passthrough
    if (error instanceof AppError) {
        return error
    }
    // 4. Unknown
    return new AppError(500, "Internal server error", "INTERNAL_ERROR", {
        originalError: error.message || "Unknown"
    })
}

export const toHttpException = (error: AppError): HTTPException => {
    const status = (error.statusCode as ContentfulStatusCode) || 500;
    
    return new HTTPException(status, {
        message: error.message,
        res: new Response(
            JSON.stringify({
                status: status,
                message: error.message,
                error: error.errorCode,
                details: error.details ?? null,
            }),
            {
                status: status,
                headers: { "Content-Type": "application/json" },
            }
        ),
    });
};

export const handleError = (error: any): HTTPException => {
    if (error instanceof HTTPException) return error
    const appError = mapToAppError(error)
    return toHttpException(appError)
}