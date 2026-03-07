import type { Response, NextFunction } from "express";

import { loginService, registerService, changeRoleService } from "../services/authService";
import { changeRoleSchema, loginSchema, registerSchema } from "../schemas/authSchema";
import { AppRequest } from "../types/common";

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
        res.status(200).json({ status: true, data: result, message: "Login successful" });
    } catch (error) {
        next(error);
    }
};

const changeRoleController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = changeRoleSchema.parse(req.body);
        const result = await changeRoleService(parsed);
        res.status(200).json({ status: true, data: result, message: "Change role successful" });
    } catch (error) {
        next(error);
    }
};

export { registerController, loginController, changeRoleController };