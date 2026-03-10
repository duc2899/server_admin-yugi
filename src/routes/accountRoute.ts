import router from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { fetchAllAccounts } from "../controllers/accountController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { RoleAdmin } from "../models/accountAdmin";

const accountRoute = router.Router();

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
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
 *     responses:
 *       200:
 *         description: Success
 */
accountRoute.get("/", authMiddleware, roleMiddleware(RoleAdmin.ADMIN, RoleAdmin.NORMAL), fetchAllAccounts);

export default accountRoute;