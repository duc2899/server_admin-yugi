import { nanoid } from "nanoid";
import jwt from "jsonwebtoken"

import AccountAdmin, { RoleAccount } from "../models/accountAdmin";
import { requestLogin, requestRegister, requestProfile, requestChangePassword } from "../types/auth";
import throwError from "../utils/throwError";
import { EXPRIE_TOKEN, FOLDER_UPLOAD_AVATARS } from "../constants/common";
import { STATUS_CODES } from "../constants/status-codes";
import { hashPassword, verifyPassword } from "../helpers/auth.helpers";
import { privateKey, publicKey } from "../configs/key";
import { JwtPayload } from "../types/common";
import { RedisService } from "./redis.service";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../configs/cloudinary";

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

        const token = signToken(user._id, user.role, user.username);

        await RedisService.set(`user_session:${user._id}`, token);

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

export const getProfileService = async (user: JwtPayload) => {
    try {
        if (!user._id) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }

        const userData = await AccountAdmin.findOne({ _id: user._id }).select("-password").lean();
        if (!userData) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }

        return userData;

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

export const uploadAvatarService = async (user: JwtPayload, file: Buffer) => {
    try {
        if (!user._id) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }

        // 1. Tìm thông tin user hiện tại để xem đã có publicId của avatar cũ chưa
        const existingUser = await AccountAdmin.findById(user._id).select('publicIdAvatar');

        // 2. Upload ảnh mới lên Cloudinary trước
        const uploadResult = await uploadStreamToCloudinary(file);
        const avatarUrl = uploadResult.secure_url;
        const publicIdAvatar = uploadResult.public_id;

        // 3. Cập nhật thông tin avatar mới vào DB
        const updatedUser = await AccountAdmin.findOneAndUpdate(
            { _id: user._id },
            { avatar: avatarUrl, publicIdAvatar: publicIdAvatar },
            { new: true }
        ).select("-password");

        // 4. Nếu trước đó user ĐÃ CÓ avatar cũ, tiến hành xóa file cũ trên Cloudinary
        if (existingUser && existingUser.publicIdAvatar) {
            // Sử dụng hàm destroy của Cloudinary để xóa, không cần await vì có thể chạy background
            cloudinary.uploader.destroy(existingUser.publicIdAvatar).catch((err) => {
                console.error(`Không thể xóa ảnh cũ (${existingUser.publicIdAvatar}) trên Cloudinary:`, err);
            });
        }

        return updatedUser;
    }
    catch (error: any) {
        throw error;
    }
};

export const changePasswordService = async (user: JwtPayload, { oldPassword, newPassword }: requestChangePassword) => {
    try {
        if (!user._id) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }
        const existingUser = await AccountAdmin.findById(user._id).select("+password");

        if (!existingUser) {
            return throwError("Not found user", STATUS_CODES.NOT_FOUND);
        }
        const isPasswordValid = await verifyPassword(oldPassword, existingUser.password);
        if (!isPasswordValid) {
            return throwError("Old password is incorrect", STATUS_CODES.BAD_REQUEST);
        }

        const hashedNewPassword = await hashPassword(newPassword);
        existingUser.password = hashedNewPassword;
        await existingUser.save();

        return null;
    }
    catch (error: any) {
        throw error;
    }
}   

const uploadStreamToCloudinary = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: FOLDER_UPLOAD_AVATARS,
                transformation: [{ width: 150, height: 150, crop: 'fill', gravity: 'face' }]
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Upload failed.'));
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};