import { nanoid } from "nanoid";
import jwt from "jsonwebtoken"

import AccountAdmin, { RoleAccount } from "../models/accountAdmin";
import { requestLogin, requestRegister, requestProfile } from "../types/auth";
import throwError from "../utils/throwError";
import { EXPRIE_TOKEN } from "../constants/common";
import { STATUS_CODES } from "../constants/status-codes.";
import { hashPassword, verifyPassword } from "../helpers/auth.helpers";
import { privateKey, publicKey } from "../configs/key";
import { JwtPayload } from "../types/common";
import { RedisService } from "./redis.service";
import { io } from "../server";

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

        const existingSocketId = await RedisService.get(`socket:${user._id}`);

        if (existingSocketId) {

            // Thiết bị A đang online → emit cảnh báo rồi kick
            io.to(existingSocketId).emit('DEVICE_LOGIN_DETECTED', {
                message: 'Tài khoản của bạn vừa được đăng nhập ở thiết bị khác'
            })
        }

        const token = signToken(user._id, user.role, user.username);

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

export function signToken(userId: string, role: RoleAccount, username: string): string {
    return jwt.sign(
        { _id: userId, role, username } satisfies Omit<JwtPayload, 'iat' | 'exp'>,
        privateKey,
        { algorithm: 'ES256', expiresIn: EXPRIE_TOKEN }
    )
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, publicKey, {
        algorithms: ['ES256'],
    }) as JwtPayload
}