import router from "express";
import { fetchAllTournaments } from "../controllers/tournamentController";
import authMiddleware from "../middlewares/authMiddleware";

const tournamentRoute = router.Router();

/**
 * @swagger
 * /api/v1/tournaments:
 *   get:
 *     summary: Get all tournaments
 *     tags: [Tournaments]
*     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Limit response
 * 
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Name of tournament
 * 
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Status of tournament
 * 
*       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Type of tournament
 * 
 *     responses:
 *       200:
 *         description: Success
 */
tournamentRoute.get("/", authMiddleware, fetchAllTournaments);

export default tournamentRoute;