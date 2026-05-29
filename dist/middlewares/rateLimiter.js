"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 phút
    max: 100, // 100 requests mỗi phút
    message: "Too many requests",
    skip: (req) => req.ip === "127.0.0.1", // Bỏ qua localhost
    handler: (req, res) => {
        // Custom response
        res.status(429).json({
            error: "Max request limit reached",
            retryAfter: "Please try again later",
        });
    },
    headers: true, // Thêm headers X-RateLimit-*
});
exports.default = rateLimiter;
