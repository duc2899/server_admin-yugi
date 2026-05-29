"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCardStatusFromSheetController = exports.setCardStatusController = exports.searchCardsController = exports.getAllCardsController = void 0;
const card_service_1 = require("../services/card.service");
const paginationSchema_1 = require("../schemas/paginationSchema");
const cardSchema_1 = require("../schemas/cardSchema");
const api_response_1 = require("../utils/api-response");
const getAllCardsController = async (req, res, next) => {
    try {
        const parsed = paginationSchema_1.paginationSchema.parse(req.query);
        const data = await (0, card_service_1.getAllCards)(parsed);
        return api_response_1.ApiResponse.ok(res, "Cards fetched successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCardsController = getAllCardsController;
const searchCardsController = async (req, res, next) => {
    try {
        const parsed = cardSchema_1.searchCardSchema.parse(req.query);
        const data = await (0, card_service_1.searchCards)(parsed);
        return api_response_1.ApiResponse.ok(res, "Cards fetched successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.searchCardsController = searchCardsController;
const setCardStatusController = async (req, res, next) => {
    try {
        const parsed = cardSchema_1.setCardStatusSchema.parse(req.body);
        const data = await (0, card_service_1.setStatusCardService)(parsed);
        return api_response_1.ApiResponse.ok(res, "Card status updated successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.setCardStatusController = setCardStatusController;
const syncCardStatusFromSheetController = async (req, res, next) => {
    try {
        const parsed = cardSchema_1.syncCardStatusFromSheetSchema.parse(req.body);
        const data = await (0, card_service_1.syncCardStatusFromSheetService)(parsed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return api_response_1.ApiResponse.ok(res, "Sync completed", data);
    }
    catch (error) {
        next(error);
    }
};
exports.syncCardStatusFromSheetController = syncCardStatusFromSheetController;
