"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTournamentDetailController = exports.getAllTournamentController = void 0;
const tournament_service_1 = require("../services/tournament.service");
const tournamentSchema_1 = require("../schemas/tournamentSchema");
const api_response_1 = require("../utils/api-response");
const getAllTournamentController = async (req, res, next) => {
    try {
        const parsed = tournamentSchema_1.getTournamentSchema.parse(req.query);
        const data = await (0, tournament_service_1.getAllTournamentsService)(parsed);
        return api_response_1.ApiResponse.ok(res, "Tournaments fetched successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTournamentController = getAllTournamentController;
const getTournamentDetailController = async (req, res, next) => {
    try {
        const parsed = tournamentSchema_1.getTournamentDetail.parse(req.params);
        const data = await (0, tournament_service_1.getTournamentDetailService)(parsed);
        return api_response_1.ApiResponse.ok(res, "Tournaments fetched successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getTournamentDetailController = getTournamentDetailController;
