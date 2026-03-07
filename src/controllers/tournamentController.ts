import type { Response, NextFunction } from 'express';

import { getAllTournaments } from '../services/tournamentService';
import { getTournamentSchema } from '../schemas/tournamentSchema';
import { AppRequest } from '../types/common';


const fetchAllTournaments = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = getTournamentSchema.parse(req.query);
        const data = await getAllTournaments(parsed);
        res.status(200).json({ status: true, data, message: "Tournaments fetched successfully" });
    } catch (error) {
        next(error);
    }
};

export { fetchAllTournaments };