"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const env_1 = __importDefault(require("../configs/env"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, printf, colorize, errors } = winston_1.default.format;
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}] : ${stack || message}`;
});
const transports = [];
if (env_1.default.NODE_ENV !== "production") {
    transports.push(new winston_1.default.transports.Console({
        format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
    }));
}
if (env_1.default.NODE_ENV !== "development") {
    transports.push(new winston_daily_rotate_file_1.default({
        dirname: "logs/app",
        filename: "app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level: "info",
    }));
    transports.push(new winston_daily_rotate_file_1.default({
        dirname: "logs/error",
        filename: "errors-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        level: "error",
    }));
}
exports.logger = winston_1.default.createLogger({
    level: env_1.default.LOG_LEVEL,
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
    transports,
    exitOnError: false,
});
