"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const status_codes_1 = require("../constants/status-codes.");
class ApiResponse {
    constructor({ success, message, statusCode, data = null, errors }) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
    }
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            statusCode: this.statusCode,
            ...(this.data !== undefined && { data: this.data }),
            ...(this.errors !== undefined && { errors: this.errors })
        });
    }
    static Success(res, message, data, statusCode = status_codes_1.STATUS_CODES.OK) {
        return new ApiResponse({
            success: true,
            message,
            data,
            statusCode
        }).send(res);
    }
    static ok(res, message = "OK", data) { return ApiResponse.Success(res, message, data, status_codes_1.STATUS_CODES.OK); }
    static created(res, message = "Created", data) { return ApiResponse.Success(res, message, data, status_codes_1.STATUS_CODES.CREATED); }
    static accepted(res, message = "Accepted", data) {
        return ApiResponse.Success(res, message, data, status_codes_1.STATUS_CODES.ACCEPTED);
    }
    static noContent(res, message = "No Content") {
        return new ApiResponse({
            success: true,
            message,
            statusCode: status_codes_1.STATUS_CODES.NO_CONTENT
        }).send(res);
    }
    // 4xx Client Errors
    static badRequest(res, message = "Bad Request", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.BAD_REQUEST,
            errors
        }).send(res);
    }
    static unauthorized(res, message = "Unauthorized", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.UNAUTHORIZED,
            errors
        }).send(res);
    }
    static forbidden(res, message = "Forbidden", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.FORBIDDEN,
            errors
        }).send(res);
    }
    static notFound(res, message = "Not Found", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.NOT_FOUND,
            errors
        }).send(res);
    }
    static conflict(res, message = "Conflict", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.CONFLICT,
            errors
        }).send(res);
    }
    static unprocessableEntity(res, message = "Validation Error", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.UNPROCESSABLE_ENTITY,
            errors
        }).send(res);
    }
    static tooManyRequests(res, message = "Too Many Requests", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.TOO_MANY_REQUESTS,
            errors
        }).send(res);
    }
    // 5xx Server Errors
    static internalError(res, message = "Internal Server Error", errors) {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
            errors
        }).send(res);
    }
    static notImplemented(res, message = "Not Implemented") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.NOT_IMPLEMENTED
        }).send(res);
    }
    static badGateway(res, message = "Bad Gateway") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.BAD_GATEWAY
        }).send(res);
    }
    static serviceUnavailable(res, message = "Service Unavailable") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.SERVICE_UNAVAILABLE
        }).send(res);
    }
    static gatewayTimeout(res, message = "Gateway Timeout") {
        return new ApiResponse({
            success: false,
            message,
            statusCode: status_codes_1.STATUS_CODES.GATEWAY_TIMEOUT
        }).send(res);
    }
}
exports.ApiResponse = ApiResponse;
