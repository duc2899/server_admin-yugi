"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBanUserController = exports.setVersionClientController = exports.getVersionClientController = exports.getAllAccountsController = exports.changeRoleController = void 0;
const admin_service_1 = require("../services/admin.service");
const adminSchema_1 = require("../schemas/adminSchema");
const api_response_1 = require("../utils/api-response");
const accountSchema_1 = require("../schemas/accountSchema");
const changeRoleController = async (req, res, next) => {
    try {
        const parsed = adminSchema_1.changeRoleSchema.parse(req.body);
        const result = await (0, admin_service_1.changeRoleService)(parsed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return api_response_1.ApiResponse.ok(res, "Change role successful", result);
    }
    catch (error) {
        next(error);
    }
};
exports.changeRoleController = changeRoleController;
const getAllAccountsController = async (req, res, next) => {
    try {
        const parsed = accountSchema_1.getAccountsSchema.parse(req.query);
        const data = await (0, admin_service_1.getAllAccountsService)(parsed);
        return api_response_1.ApiResponse.ok(res, "Accounts fetched successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAccountsController = getAllAccountsController;
const getVersionClientController = async (req, res, next) => {
    try {
        const data = await (0, admin_service_1.getVersionClientService)();
        return api_response_1.ApiResponse.ok(res, "Get version successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getVersionClientController = getVersionClientController;
const setVersionClientController = async (req, res, next) => {
    try {
        const parsed = adminSchema_1.setVersionClientSchema.parse(req.body);
        const data = await (0, admin_service_1.setVersionClientService)(parsed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return api_response_1.ApiResponse.ok(res, "Set version successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.setVersionClientController = setVersionClientController;
const toggleBanUserController = async (req, res, next) => {
    try {
        const parsed = adminSchema_1.toggleBanSchema.parse(req.body);
        const data = await (0, admin_service_1.toggleBanUserService)(parsed);
        return api_response_1.ApiResponse.ok(res, "Toggle ban successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.toggleBanUserController = toggleBanUserController;
