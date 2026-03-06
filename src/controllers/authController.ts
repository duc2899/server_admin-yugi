import type { Request, Response, NextFunction } from "express";

import { loginService, registerService } from "../services/authService";
import { loginSchema, registerSchema } from "../schemas/authSchema";

const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.parse(req.body);
        const user = await registerService(parsed);
        res.status(201).json({ status: true, data: user, message: "Account created successfully" });
    } catch (error) {
        next(error);
    }
};

const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const result = await loginService(parsed);
        res.status(200).json({ status: true, data: result, message: "Login successful" });
    } catch (error) {
        next(error);
    }
};

export { registerController, loginController };