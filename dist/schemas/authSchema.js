"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    username: zod_1.default.string().min(3, "Username must be at least 3 characters").max(20, "Username must be between 3 and 20 characters"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters").max(15, "Password must be between 6 and 15 characters"),
    fullName: zod_1.default.string().min(3, "Full name must be at least 3 characters").max(50, "Full name must be between 3 and 50 characters"),
});
exports.loginSchema = zod_1.default.object({
    username: zod_1.default.string().min(3, "Username must be at least 3 characters").max(20, "Username must be between 3 and 20 characters"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters").max(15, "Password must be between 6 and 15 characters"),
});
