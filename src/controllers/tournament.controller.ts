import type { Response, NextFunction, Request } from 'express';

import { getAllTournamentsService, getTournamentDetailService } from '../services/tournament.service';
import { getTournamentSchema, getTournamentDetail } from '../schemas/tournamentSchema';
import { ApiResponse } from '../utils/api-response';


const getAllTournamentController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = getTournamentSchema.parse(req.query);
        const data = await getAllTournamentsService(parsed);
        return ApiResponse.ok(res, "Tournaments fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

const getTournamentDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = getTournamentDetail.parse(req.params);
        const data = await getTournamentDetailService(parsed);
        return ApiResponse.ok(res, "Tournaments fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

export { getAllTournamentController, getTournamentDetailController };