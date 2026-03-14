import type { Response, NextFunction } from "express";

import { loginService, registerService, getProfileService } from "../services/authService";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { AppRequest } from "../types/common";
import { EXPRIE_COOKIE } from "../config/CONST";

const registerController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.parse(req.body);
        const user = await registerService(parsed);
        res.status(201).json({ status: true, data: user, message: "Account created successfully" });
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
        res.status(200).json({ status: true, data: result, message: "Login successful" });
    } catch (error) {
        next(error);
    }
};

const getProfileController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?._id;
        const user = await getProfileService({ _id });
        res.status(201).json({ status: true, data: user, message: "Get information account successfully" });
    } catch (error) {
        next(error);
    }
};


export { registerController, loginController, getProfileController };