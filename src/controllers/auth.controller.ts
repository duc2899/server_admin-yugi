import type { Response, NextFunction } from "express";

import { loginService, registerService, getProfileService, logoutService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { AppRequest } from "../types/common";
import { EXPRIE_COOKIE } from "../constants/common";
import { ApiResponse } from "../utils/api-response";

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
            secure: false, // true nếu dùng https
            sameSite: "lax",
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
        const user = await logoutService({ _id });
        
        res.cookie("access_token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(0)
        });

        return ApiResponse.ok(res, "Logout successful", user);
    } catch (error) {
        next(error);
    }
};


export { registerController, loginController, getProfileController, logoutController };