"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeckAdminController = exports.saveDeckController = exports.getDeckAdminDetailController = exports.getAllDeckController = exports.createDeckController = void 0;
const deckAdmin_schema_1 = require("../schemas/deckAdmin.schema");
const deckAdmin_service_1 = require("../services/deckAdmin.service");
const api_response_1 = require("../utils/api-response");
const createDeckController = async (req, res, next) => {
    try {
        const paresed = deckAdmin_schema_1.createDeckSchema.parse(req.body);
        const data = await (0, deckAdmin_service_1.createDeckAdminService)(paresed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return api_response_1.ApiResponse.created(res, "Create a deck successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.createDeckController = createDeckController;
const getAllDeckController = async (req, res, next) => {
    try {
        const data = await (0, deckAdmin_service_1.getAllDeckAdminService)();
        return api_response_1.ApiResponse.ok(res, "Get all decks successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllDeckController = getAllDeckController;
const getDeckAdminDetailController = async (req, res, next) => {
    try {
        const paresed = deckAdmin_schema_1.getDeckDetailSchema.parse(req.params);
        const data = await (0, deckAdmin_service_1.getDeckAdminDetailService)(paresed);
        return api_response_1.ApiResponse.ok(res, "Get detail deck successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getDeckAdminDetailController = getDeckAdminDetailController;
const saveDeckController = async (req, res, next) => {
    try {
        const paresed = deckAdmin_schema_1.saveDeckSchema.parse(req.body);
        const data = await (0, deckAdmin_service_1.saveDeckAdminService)(paresed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return api_response_1.ApiResponse.ok(res, "Create a deck successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.saveDeckController = saveDeckController;
const deleteDeckAdminController = async (req, res, next) => {
    try {
        const paresed = deckAdmin_schema_1.deleteDeckSchema.parse(req.body);
        await (0, deckAdmin_service_1.deleteDeckAdminService)(paresed);
        return api_response_1.ApiResponse.ok(res, "Delete deck successfully", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDeckAdminController = deleteDeckAdminController;
