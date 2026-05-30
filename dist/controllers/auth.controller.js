"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.uploadAvatarController = exports.logoutController = exports.getProfileController = exports.loginController = exports.registerController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const authSchema_1 = require("../schemas/authSchema");
const common_1 = require("../constants/common");
const api_response_1 = require("../utils/api-response");
const env_1 = __importDefault(require("../configs/env"));
const tokenBlacklist_service_1 = require("../services/tokenBlacklist.service");
const isProduction = env_1.default.NODE_ENV === "production";
const registerController = async (req, res, next) => {
    try {
        const parsed = authSchema_1.registerSchema.parse(req.body);
        const user = await (0, auth_service_1.registerService)(parsed);
        return api_response_1.ApiResponse.created(res, "Account created successfully", user);
    }
    catch (error) {
        next(error);
    }
};
exports.registerController = registerController;
const loginController = async (req, res, next) => {
    try {
        const parsed = authSchema_1.loginSchema.parse(req.body);
        const result = await (0, auth_service_1.loginService)(parsed);
        res.cookie("access_token", result.token, {
            httpOnly: true,
            secure: isProduction, // true nếu dùng https
            sameSite: isProduction ? "none" : "lax", // none nếu dùng https, lax nếu localhost
            maxAge: common_1.EXPRIE_COOKIE // 1 ngày
        });
        return api_response_1.ApiResponse.ok(res, "Login successful", result);
    }
    catch (error) {
        next(error);
    }
};
exports.loginController = loginController;
const getProfileController = async (req, res, next) => {
    try {
        const user = await (0, auth_service_1.getProfileService)(req.user);
        return api_response_1.ApiResponse.ok(res, "Get information account successfully", user);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfileController = getProfileController;
const logoutController = async (req, res, next) => {
    try {
        const _id = req.user?._id;
        const token = req.cookies?.access_token;
        if (token) {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (decoded?.exp) {
                const ttlSeconds = decoded.exp - Math.floor(Date.now() / 1000);
                if (ttlSeconds > 0) {
                    await tokenBlacklist_service_1.TokenBlacklistService.blacklistToken(token, ttlSeconds);
                }
            }
        }
        const data = await (0, auth_service_1.logoutService)({ _id });
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
        return api_response_1.ApiResponse.ok(res, "Logout successful", data);
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
const uploadAvatarController = async (req, res, next) => {
    try {
        const user = req.user;
        const file = req.file;
        if (!file) {
            return api_response_1.ApiResponse.badRequest(res, "No file uploaded");
        }
        const updatedUser = await (0, auth_service_1.uploadAvatarService)(user, file.buffer);
        return api_response_1.ApiResponse.ok(res, "Avatar uploaded successfully", updatedUser);
    }
    catch (error) {
        console.error("Upload avatar error:", error);
        next(error);
    }
};
exports.uploadAvatarController = uploadAvatarController;
const changePasswordController = async (req, res, next) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = authSchema_1.changePasswordSchema.parse(req.body);
        await (0, auth_service_1.changePasswordService)(user, { oldPassword, newPassword });
        return api_response_1.ApiResponse.ok(res, "Password changed successfully", null);
    }
    catch (error) {
        next(error);
    }
};
exports.changePasswordController = changePasswordController;
