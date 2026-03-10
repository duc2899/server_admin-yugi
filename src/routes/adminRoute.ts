import router from "express";
import { changeRoleController, getAllAccountsController, getVersionClientController, setVersionClientController } from "../controllers/adminController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import { RoleAdmin } from "../models/accountAdmin";

const adminRoute = router.Router();

/**
 * @swagger
 * /api/v1/admin/change-role:
 *   post:
 *     summary: Change Role
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - role
 *             properties:
 *               _id:
 *                 type: string
 *                 example: abcwq
 *               role:
 *                 type: string
 *                 example: normal
 *     responses:
 *       200:
 *         description: Change role successfully
 */
adminRoute.post("/change-role", authMiddleware, roleMiddleware(RoleAdmin.ADMIN), changeRoleController);

/**
 * @swagger
 * /api/v1/admin:
 *   get:
 *     summary: Get all accounts
 *     tags: [Services Admin]
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
adminRoute.get("/", authMiddleware, roleMiddleware(RoleAdmin.ADMIN), getAllAccountsController);

/**
 * @swagger
 * /api/v1/admin/get-version-client:
 *   get:
 *     summary: Get version client
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
adminRoute.get("/get-version-client", authMiddleware, getVersionClientController);

/**
 * @swagger
 * /api/v1/admin/set-version:
 *   post:
 *     summary: Set version client
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - version
 *             properties:
 *               version:
 *                 type: string
 *                 example: 0.107
 *     responses:
 *       200:
 *         description: Change role successfully
 */
adminRoute.post("/set-version", authMiddleware, roleMiddleware(RoleAdmin.ADMIN), setVersionClientController);


export default adminRoute;