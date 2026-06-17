"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const throwError_1 = __importDefault(require("../utils/throwError"));
const status_codes_1 = require("../constants/status-codes");
const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return (0, throwError_1.default)("Access denied", status_codes_1.STATUS_CODES.FORBIDDEN);
        }
        next();
    };
};
exports.default = roleMiddleware;
