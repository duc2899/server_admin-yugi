import { nanoid } from "nanoid";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import AccountAdmin, { RoleAdmin } from "../models/accountAdmin";
import { requestRegisterAccountAdmin, requestLoginAccountAdmin, requestChangeRoleAccountAdmin } from "../types/accountAdmin";
import throwError from "../utils/throwError";
import { ENV } from "../config/env";

export const registerService = async ({ username, password, fullName }: requestRegisterAccountAdmin) => {
    try {
        const exitsAccount = await AccountAdmin.findOne({ username });

        if (exitsAccount) {
            return throwError("Username already exists", 400);
        }

        const uuidv4 = nanoid(8);
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await AccountAdmin.create({
            _id: uuidv4,
            username,
            fullName,
            password: hashPassword,
        });

        return {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
        }

    } catch (error: any) {
        throw error;
    }
}


export const loginService = async ({ username, password }: requestLoginAccountAdmin) => {
    try {
        const user = await AccountAdmin.findOne({ username });
        if (!user) {
            return throwError("Invalid username or password", 400);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return throwError("Invalid username or password", 400);
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET_KEY, { expiresIn: "1d" });

        return {
            token,
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
            }
        }
    } catch (error: any) {
        throw error;
    }
}

export const changeRoleService = async ({ role, _id }: requestChangeRoleAccountAdmin) => {
    try {
        const user = await AccountAdmin.findOneAndUpdate({ _id: _id }, { role: role }, { new: true, runValidators: true })
        if (!user) {
            return throwError("User not found", 404);
        }
        return {
            _id: user._id,
            role: user.role
        }
    } catch (error: any) {
        throw error;
    }
}