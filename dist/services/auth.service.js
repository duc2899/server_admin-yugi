"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = exports.uploadAvatarService = exports.logoutService = exports.getProfileService = exports.loginService = exports.registerService = void 0;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const nanoid_1 = require("nanoid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accountAdmin_1 = __importDefault(require("../models/accountAdmin"));
const throwError_1 = __importDefault(require("../utils/throwError"));
const common_1 = require("../constants/common");
const status_codes_1 = require("../constants/status-codes.");
const auth_helpers_1 = require("../helpers/auth.helpers");
const key_1 = require("../configs/key");
const redis_service_1 = require("./redis.service");
const server_1 = require("../server");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const registerService = async ({ username, password, fullName }) => {
    try {
        const exitsAccount = await accountAdmin_1.default.findOne({ username });
        if (exitsAccount) {
            return (0, throwError_1.default)("Username already exists", status_codes_1.STATUS_CODES.CONFLICT);
        }
        const uuidv4 = (0, nanoid_1.nanoid)(8);
        const hashedPassword = await (0, auth_helpers_1.hashPassword)(password);
        const user = await accountAdmin_1.default.create({
            _id: uuidv4,
            username,
            fullName,
            password: hashedPassword,
        });
        return {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.registerService = registerService;
const loginService = async ({ username, password }) => {
    try {
        const user = await accountAdmin_1.default.findOne({ username }).select("+password");
        ;
        if (!user) {
            return (0, throwError_1.default)("Invalid username or password", status_codes_1.STATUS_CODES.UNAUTHORIZED);
        }
        const isPasswordValid = await (0, auth_helpers_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            return (0, throwError_1.default)("Invalid username or password", status_codes_1.STATUS_CODES.UNAUTHORIZED);
        }
        const existingSocketId = await redis_service_1.RedisService.get(`socket:${user._id}`);
        if (existingSocketId) {
            // Thiết bị A đang online → emit cảnh báo rồi kick
            server_1.io.to(existingSocketId).emit('DEVICE_LOGIN_DETECTED', {
                message: 'Tài khoản của bạn vừa được đăng nhập ở thiết bị khác'
            });
        }
        const token = signToken(user._id, user.role, user.username);
        await redis_service_1.RedisService.set(`user_session:${user._id}`, token);
        return {
            token,
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }
        };
    }
    catch (error) {
        throw error;
    }
};
exports.loginService = loginService;
const getProfileService = async (user) => {
    try {
        if (!user._id) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const userData = await accountAdmin_1.default.findOne({ _id: user._id }).select("-password").lean();
        if (!userData) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        return userData;
    }
    catch (error) {
        throw error;
    }
};
exports.getProfileService = getProfileService;
const logoutService = async ({ _id }) => {
    try {
        if (!_id) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const user = await accountAdmin_1.default.findOneAndUpdate({ _id }, { lastedLogin: Date.now() });
        if (!user) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        return null;
    }
    catch (error) {
        throw error;
    }
};
exports.logoutService = logoutService;
function signToken(userId, role, username) {
    return jsonwebtoken_1.default.sign({ _id: userId, role, username }, key_1.privateKey, { algorithm: 'ES256', expiresIn: common_1.EXPRIE_TOKEN });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, key_1.publicKey, {
        algorithms: ['ES256'],
    });
}
const uploadAvatarService = async (user, file) => {
    try {
        if (!user._id) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        // 1. Tìm thông tin user hiện tại để xem đã có publicId của avatar cũ chưa
        const existingUser = await accountAdmin_1.default.findById(user._id).select('publicIdAvatar');
        // 2. Upload ảnh mới lên Cloudinary trước
        const uploadResult = await uploadStreamToCloudinary(file);
        const avatarUrl = uploadResult.secure_url;
        const publicIdAvatar = uploadResult.public_id;
        // 3. Cập nhật thông tin avatar mới vào DB
        const updatedUser = await accountAdmin_1.default.findOneAndUpdate({ _id: user._id }, { avatar: avatarUrl, publicIdAvatar: publicIdAvatar }, { new: true }).select("-password");
        // 4. Nếu trước đó user ĐÃ CÓ avatar cũ, tiến hành xóa file cũ trên Cloudinary
        if (existingUser && existingUser.publicIdAvatar) {
            // Sử dụng hàm destroy của Cloudinary để xóa, không cần await vì có thể chạy background
            cloudinary_1.default.uploader.destroy(existingUser.publicIdAvatar).catch((err) => {
                console.error(`Không thể xóa ảnh cũ (${existingUser.publicIdAvatar}) trên Cloudinary:`, err);
            });
        }
        return updatedUser;
    }
    catch (error) {
        throw error;
    }
};
exports.uploadAvatarService = uploadAvatarService;
const changePasswordService = async (user, { oldPassword, newPassword }) => {
    try {
        if (!user._id) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const existingUser = await accountAdmin_1.default.findById(user._id).select("+password");
        if (!existingUser) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const isPasswordValid = await (0, auth_helpers_1.verifyPassword)(oldPassword, existingUser.password);
        if (!isPasswordValid) {
            return (0, throwError_1.default)("Old password is incorrect", status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
        const hashedNewPassword = await (0, auth_helpers_1.hashPassword)(newPassword);
        existingUser.password = hashedNewPassword;
        await existingUser.save();
        return null;
    }
    catch (error) {
        throw error;
    }
};
exports.changePasswordService = changePasswordService;
const uploadStreamToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: common_1.FOLDER_UPLOAD_AVATARS,
            transformation: [{ width: 150, height: 150, crop: 'fill', gravity: 'face' }]
        }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error('Upload failed.'));
            resolve(result);
        });
        uploadStream.end(fileBuffer);
    });
};
