import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../@types/api";

const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1️⃣ Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: false,
            message: "Validation Error",
            returnCode: "VALIDATION_ERROR",
            errors: err.issues.map(e => ({
                message: e.message
            }))
        });
    }

    // 2️⃣ Custom ApiError
    if (err instanceof Error) {
        const apiError = err as ApiError;

        return res.status(apiError.statusCode || 500).json({
            status: false,
            message: apiError.message || "Internal Server Error",
            returnCode: apiError.returnCode || "UNKNOWN_ERROR",
            stack:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : apiError.stack
        });
    }

    // 3️⃣ Unknown error
    return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        returnCode: "UNKNOWN_ERROR"
    });
};

export default errorHandler;