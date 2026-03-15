import router from "express";
import { getAllTournamentController, getTournamentDetailController } from "../controllers/tournament.controller";
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
 *           default: 1
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
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
tournamentRoute.get("/", getAllTournamentController);

/**
 * @swagger
 * /api/v1/tournaments/{id}:
 *   get:
 *     summary: Get tournament detail
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Tournament not found
 */
tournamentRoute.get("/:id", getTournamentDetailController);
export default tournamentRoute;