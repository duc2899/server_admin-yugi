import type { Response } from "express";
import { STATUS_CODES, StatusCode } from "../constants/status-codes.";

type ApiResponseParams<T> = {
    success: boolean;
    message: string;
    statusCode: StatusCode;
    data?: T | null;
    errors?: unknown;
};

export class ApiResponse<T = unknown> {
    public readonly success: boolean;
    public readonly message: string;
    public readonly statusCode: StatusCode;
    public readonly data?: T | null;
    public readonly errors?: unknown;

    constructor({
        success,
        message,
        statusCode,
        data = null,
        errors
    }: ApiResponseParams<T>) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
    }

    send(res: Response): Response {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            statusCode: this.statusCode,
            ...(this.data !== undefined && { data: this.data }),
            ...(this.errors !== undefined && { errors: this.errors })
        });
    }

    static Success<T>(
        res: Response,
        message: string,
        data?: T,
        statusCode: StatusCode = STATUS_CODES.OK
    ): Response {
        return new ApiResponse<T>({
            success: true,
            message,
            data,
            statusCode
        }).send(res);
    }

    static ok<T>(res: Response, message = "OK", data?: T) { return ApiResponse.Success(res, message, data, STATUS_CODES.OK); } static created<T>(res: Response, message = "Created", data?: T) { return ApiResponse.Success(res, message, data, STATUS_CODES.CREATED); }

    static accepted<T>(res: Response, message = "Accepted", data?: T) {
        return ApiResponse.Success(res, message, data, STATUS_CODES.ACCEPTED);
    }

    static noContent(res: Response, message = "No Content") {
        return new ApiResponse({
            success: true,
            message,
            statusCode: STATUS_CODES.NO_CONTENT
        }).send(res);
    }

    // 4xx Client Errors

    static badRequest(res: Response, message = "Bad Request", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors
        }).send(res);
    }

    static unauthorized(res: Response, message = "Unauthorized", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors
        }).send(res);
    }

    static forbidden(res: Response, message = "Forbidden", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.FORBIDDEN,
            errors
        }).send(res);
    }

    static notFound(res: Response, message = "Not Found", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.NOT_FOUND,
            errors
        }).send(res);
    }

    static conflict(res: Response, message = "Conflict", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.CONFLICT,
            errors
        }).send(res);
    }

    static unprocessableEntity(res: Response, message = "Validation Error", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
            errors
        }).send(res);
    }

    static tooManyRequests(res: Response, message = "Too Many Requests", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
            errors
        }).send(res);
    }

    // 5xx Server Errors

    static internalError(res: Response, message = "Internal Server Error", errors?: unknown) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            errors
        }).send(res);
    }

    static notImplemented(res: Response, message = "Not Implemented") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.NOT_IMPLEMENTED
        }).send(res);
    }

    static badGateway(res: Response, message = "Bad Gateway") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.BAD_GATEWAY
        }).send(res);
    }

    static serviceUnavailable(res: Response, message = "Service Unavailable") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.SERVICE_UNAVAILABLE
        }).send(res);
    }

    static gatewayTimeout(res: Response, message = "Gateway Timeout") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: STATUS_CODES.GATEWAY_TIMEOUT
        }).send(res);
    }

}