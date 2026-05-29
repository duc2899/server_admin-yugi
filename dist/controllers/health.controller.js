"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDBHealth = exports.detailedHealthCheck = exports.healthCheck = void 0;
const api_response_1 = require("../utils/api-response");
const env_1 = __importDefault(require("../configs/env"));
const mongoose_1 = __importDefault(require("mongoose"));
const healthCheck = async (req, res) => {
    return api_response_1.ApiResponse.Success(res, "Service is healthy", {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};
exports.healthCheck = healthCheck;
const detailedHealthCheck = async (req, res) => {
    const healthData = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.default.NODE_ENV,
        version: process.env.npm_package_version || "1.0.0",
        memory: {
            used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
            total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
            unit: "MB"
        },
        cpu: {
            usage: process.cpuUsage()
        }
    };
    return api_response_1.ApiResponse.Success(res, "Service is healthy", healthData);
};
exports.detailedHealthCheck = detailedHealthCheck;
const checkDBHealth = async (req, res, next) => {
    try {
        if (!mongoose_1.default.connection.db) {
            return api_response_1.ApiResponse.notFound(res, "Service is healthy", {
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                error: "MongoDB not connected"
            });
        }
        const result = await mongoose_1.default.connection.db.admin().ping();
        return api_response_1.ApiResponse.Success(res, "MongoDB is healthy", result);
    }
    catch (error) {
        next(error);
    }
};
exports.checkDBHealth = checkDBHealth;
