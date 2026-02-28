import router from "express";
import { fetchAllAccounts } from "../controllers/accountController";

const accountRoute = router.Router();

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
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
 *     responses:
 *       200:
 *         description: Success
 */
accountRoute.get("/", fetchAllAccounts);

export default accountRoute;