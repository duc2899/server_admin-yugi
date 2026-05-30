"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../constants/common");
exports.registerSchema = zod_1.default.object({
    username: zod_1.default.string().min(common_1.MIN_USERNAME_LENGTH, `Username must be at least ${common_1.MIN_USERNAME_LENGTH} characters`).max(common_1.MAX_USERNAME_LENGTH, `Username must be between ${common_1.MIN_USERNAME_LENGTH} and ${common_1.MAX_USERNAME_LENGTH} characters`),
    password: zod_1.default.string().min(common_1.MIN_PASSWORD_LENGTH, `Password must be at least ${common_1.MIN_PASSWORD_LENGTH} characters`).max(common_1.MAX_PASSWORD_LENGTH, `Password must be between ${common_1.MIN_PASSWORD_LENGTH} and ${common_1.MAX_PASSWORD_LENGTH} characters`),
    fullName: zod_1.default.string().min(common_1.MIN_FULLNAME_LENGTH, `Full name must be at least ${common_1.MIN_FULLNAME_LENGTH} characters`).max(common_1.MAX_FULLNAME_LENGTH, `Full name must be between ${common_1.MIN_FULLNAME_LENGTH} and ${common_1.MAX_FULLNAME_LENGTH} characters`),
});
exports.loginSchema = zod_1.default.object({
    username: zod_1.default.string().min(common_1.MIN_USERNAME_LENGTH, `Username must be at least ${common_1.MIN_USERNAME_LENGTH} characters`).max(common_1.MAX_USERNAME_LENGTH, `Username must be between ${common_1.MIN_USERNAME_LENGTH} and ${common_1.MAX_USERNAME_LENGTH} characters`),
    password: zod_1.default.string().min(common_1.MIN_PASSWORD_LENGTH, `Password must be at least ${common_1.MIN_PASSWORD_LENGTH} characters`).max(common_1.MAX_PASSWORD_LENGTH, `Password must be between ${common_1.MIN_PASSWORD_LENGTH} and ${common_1.MAX_PASSWORD_LENGTH} characters`),
});
exports.changePasswordSchema = zod_1.default.object({
    oldPassword: zod_1.default.string().min(common_1.MIN_PASSWORD_LENGTH, `Old password must be at least ${common_1.MIN_PASSWORD_LENGTH} characters`).max(common_1.MAX_PASSWORD_LENGTH, `Old password must be between ${common_1.MIN_PASSWORD_LENGTH} and ${common_1.MAX_PASSWORD_LENGTH} characters`),
    newPassword: zod_1.default.string().min(common_1.MIN_PASSWORD_LENGTH, `New password must be at least ${common_1.MIN_PASSWORD_LENGTH} characters`).max(common_1.MAX_PASSWORD_LENGTH, `New password must be between ${common_1.MIN_PASSWORD_LENGTH} and ${common_1.MAX_PASSWORD_LENGTH} characters`),
});
