"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, returnCode = "UNKNOWN_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.returnCode = returnCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
