"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const env_1 = __importDefault(require("../configs/env"));
const errorHandler = (err, req, res, next) => {
    // 1️⃣ Zod validation error
    if (err instanceof zod_1.ZodError) {
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
        const apiError = err;
        return res.status(apiError.statusCode || 500).json({
            status: false,
            message: apiError.message || "Internal Server Error",
            returnCode: apiError.returnCode || "UNKNOWN_ERROR",
            stack: env_1.default.NODE_ENV === "production"
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
exports.default = errorHandler;
