"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBanSchema = exports.setVersionClientSchema = exports.changeRoleSchema = exports.versionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const accountAdmin_1 = require("../models/accountAdmin");
const version_constant_1 = require("../constants/version.constant");
exports.versionSchema = zod_1.default
    .string()
    .regex(/^\d+\.\d+$/, "Version must be in format x.y (ex: 1.107)");
exports.changeRoleSchema = zod_1.default.object({
    _id: zod_1.default.string(),
    role: zod_1.default.enum(accountAdmin_1.RoleAccount, "Invalid Role")
});
exports.setVersionClientSchema = zod_1.default.object({
    version: exports.versionSchema,
    type: zod_1.default.enum(version_constant_1.VERSIONS, "Invalid Version")
});
exports.toggleBanSchema = zod_1.default.object({
    _id: zod_1.default.string(),
});
