import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { loginService, registerService, getProfileService, logoutService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { AppRequest } from "../types/common";
import { EXPRIE_COOKIE } from "../constants/common";
import { ApiResponse } from "../utils/api-response";
import env from "../configs/env";
import { TokenBlacklistService } from "../services/tokenBlacklist.service";

const isProduction = env.NODE_ENV === "production";

const registerController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.parse(req.body);
        const user = await registerService(parsed);
        return ApiResponse.created(res, "Account created successfully", user)
    } catch (error) {
        next(error);
    }
};

const loginController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const result = await loginService(parsed);
        res.cookie("access_token", result.token, {
            httpOnly: true,
            secure: isProduction, // true nếu dùng https
            sameSite: isProduction ? "none" : "lax", // none nếu dùng https, lax nếu localhost
            maxAge: EXPRIE_COOKIE // 1 ngày
        })
        return ApiResponse.ok(res, "Login successful", result)
    } catch (error) {
        next(error);
    }
};

const getProfileController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?._id;
        const user = await getProfileService({ _id });
        return ApiResponse.ok(res, "Get information account successfully", user)
    } catch (error) {
        next(error);
    }
};

const logoutController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?._id;

        const token = req.cookies?.access_token;

        if (token) {
            const decoded: any = jwt.decode(token);

            if (decoded?.exp) {
                const ttlSeconds = decoded.exp - Math.floor(Date.now() / 1000);

                if (ttlSeconds > 0) {
                    await TokenBlacklistService.blacklistToken(token, ttlSeconds);
                }
            }
        }

        const data = await logoutService({ _id });

        res.clearCookie("access_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        return ApiResponse.ok(res, "Logout successful", data);
    } catch (error) {
        next(error);
    }
};


export { registerController, loginController, getProfileController, logoutController };