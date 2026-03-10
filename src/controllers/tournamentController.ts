import type { Response, NextFunction } from 'express';

import { getAllTournamentsService, getTournamentDetailService } from '../services/tournamentService';
import { getTournamentSchema, getTournamentDetail } from '../schemas/tournamentSchema';
import { AppRequest } from '../types/common';


const getAllTournamentController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = getTournamentSchema.parse(req.query);
        const data = await getAllTournamentsService(parsed);
        res.status(200).json({ status: true, data, message: "Tournaments fetched successfully" });
    } catch (error) {
        next(error);
    }
};

const getTournamentDetailController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = getTournamentDetail.parse(req.params);
        const data = await getTournamentDetailService(parsed);
        res.status(200).json({ status: true, data, message: "Tournament fetched successfully" });
    } catch (error) {
        next(error);
    }
};

export { getAllTournamentController, getTournamentDetailController};