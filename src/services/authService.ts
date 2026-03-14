import { nanoid } from "nanoid";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import AccountAdmin from "../models/accountAdmin";
import { requestLogin, requestRegister, requestProfile } from "../types/auth";
import throwError from "../utils/throwError";
import { ENV } from "../config/env";
import { EXPRIE_TOKEN } from "../config/CONST";

export const registerService = async ({ username, password, fullName }: requestRegister) => {
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

export const loginService = async ({ username, password }: requestLogin) => {
    try {
        const user = await AccountAdmin.findOne({ username });
        if (!user) {
            return throwError("Invalid username or password", 400);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return throwError("Invalid username or password", 400);
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET_KEY, { expiresIn: EXPRIE_TOKEN });

        return {
            token,
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }
        }
    } catch (error: any) {
        throw error;
    }
}

export const getProfileService = async ({ _id }: requestProfile) => {
    try {
        if (!_id) {
            return throwError("Not found user", 400);
        }

        const user = await AccountAdmin.findOne({ _id }).select("-password");
        if (!user) {
            return throwError("Not found user", 400);
        }

        return {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            lastedLogin: user.lastedLogin,
            createdTime: user.createdTime,
            updatedTime: user.updatedTime,
        }


    } catch (error: any) {
        throw error;
    }
}
