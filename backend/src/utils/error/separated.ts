import { ZodError } from "zod";
import AppError from "."
import { PrismaClientKnownRequestError } from "../../infrastructure/database/generated/prisma/runtime/client";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

export const mapToAppError = (error: any): AppError => {
    if (error instanceof ZodError) {
      return new AppError(
        422,
        error.issues[0].message,
        "VALIDATION_ERROR",
        error.flatten
      );
    }
  
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return new AppError(404, "Record not found", "NOT_FOUND");
      }
      
      return new AppError(400 , error.message, error.code);
    }
  
    if (error instanceof AppError) {
      return error;
    }
  
    return new AppError(500, "Internal server error", "INTERNAL_ERROR");
}

export const toHttpException = (error:AppError): HTTPException => {
    return new HTTPException(error.statusCode as ContentfulStatusCode, {
      message: error.message,
      res: new Response(
        JSON.stringify({
          status: error.statusCode,
          message: error.message,
          error: error.errorCode,
          details: error.details ?? null,
        }),
        {
          status: error.statusCode,
          headers: { "Content-Type": "application/json" },
        }
      ),
    });
}

export const handleError = (error: any) => {
    const appError = mapToAppError(error);
    throw toHttpException(appError);
}