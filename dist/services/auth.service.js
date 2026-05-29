"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = exports.getProfileService = exports.loginService = exports.registerService = void 0;
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
            // Xóa session cũ
            await redis_service_1.RedisService.del(`socket:${user._id}`);
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
        };
    }
    catch (error) {
        throw error;
    }
};
exports.loginService = loginService;
const getProfileService = async ({ _id }) => {
    try {
        if (!_id) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const user = await accountAdmin_1.default.findOne({ _id }).select("-password");
        if (!user) {
            return (0, throwError_1.default)("Not found user", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        return {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            lastedLogin: user.lastedLogin,
            createdTime: user.createdTime,
            updatedTime: user.updatedTime,
        };
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
