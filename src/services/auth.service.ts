import { nanoid } from "nanoid";
import jwt from "jsonwebtoken"

import AccountAdmin from "../models/accountAdmin";
import { requestLogin, requestRegister, requestProfile } from "../types/auth";
import throwError from "../utils/throwError";
import { EXPRIE_TOKEN } from "../constants/common";
import { STATUS_CODES } from "../constants/status-codes.";
import env from "../configs/env";
import { hashPassword, verifyPassword } from "../helpers/auth.helpers";

export const registerService = async ({ username, password, fullName }: requestRegister) => {
    try {
        const exitsAccount = await AccountAdmin.findOne({ username });

        if (exitsAccount) {
            return throwError("Username already exists", STATUS_CODES.CONFLICT);
        }

        const uuidv4 = nanoid(8);
        const hashedPassword = await hashPassword(password);
        const user = await AccountAdmin.create({
            _id: uuidv4,
            username,
            fullName,
            password: hashedPassword,
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
        const user = await AccountAdmin.findOne({ username }).select("+password");;
        if (!user) {
            return throwError("Invalid username or password", STATUS_CODES.UNAUTHORIZED);
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return throwError("Invalid username or password", STATUS_CODES.UNAUTHORIZED);
        }

        const token = jwt.sign({ _id: user._id, role: user.role, username: user.username}, env.JWT_ACCESS_SECRET, { expiresIn: EXPRIE_TOKEN });

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
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }

        const user = await AccountAdmin.findOne({ _id }).select("-password");
        if (!user) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
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


export const logoutService = async ({ _id }: requestProfile) => {
    try {
        if (!_id) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }

        const user = await AccountAdmin.findOneAndUpdate({ _id }, { lastedLogin: Date.now() });
        if (!user) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }

        return null;

    } catch (error: any) {
        throw error;
    }
}
