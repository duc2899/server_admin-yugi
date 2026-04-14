import router from "express";
import { changeRoleController, getAllAccountsController, getVersionClientController, setVersionClientController, toggleBanUserController } from "../controllers/admin.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import { RoleAdmin } from "../models/accountAdmin";
import { cacheMiddleware } from "../middlewares/cache.middleware";
import { clearCacheAfterSuccess } from "../middlewares/clearCacheAfter.middleware";
import { createDeckController } from "../controllers/deckAdmin.controller";

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
adminRoute.post(
    "/change-role",
    authMiddleware,
    roleMiddleware(RoleAdmin.ADMIN),
    clearCacheAfterSuccess("accounts-admin"),
    changeRoleController
);

/**
 * @swagger
 * /api/v1/admin/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: false
 *         description: Key search fullName, username and code
 * 
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
adminRoute.get(
    "/accounts",
    authMiddleware,
    roleMiddleware(RoleAdmin.ADMIN),
    cacheMiddleware({
        ttl: 5,
        prefix: "accounts-admin-list",
        tag: "accounts-admin",
        skipAuth: true,
    }),
    getAllAccountsController
);

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
adminRoute.get(
    "/get-version-client",
    authMiddleware,
    cacheMiddleware({
        ttl: 30,
        prefix: "version-client",
        tag: "version-client",
        skipAuth: true,
    }),
    getVersionClientController
);

/**
 * @swagger
 * /api/v1/admin/set-version-client:
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
adminRoute.post(
    "/set-version-client",
    authMiddleware,
    roleMiddleware(RoleAdmin.ADMIN),
    clearCacheAfterSuccess("version-client"),
    setVersionClientController
);

/**
 * @swagger
 * /api/v1/admin/toggle-ban:
 *   post:
 *     summary: Toggle Ban
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
 *             properties:
 *               _id:
 *                 type: string
 *                 example: abcwq
 *     responses:
 *       200:
 *         description: Toggle ban successfully
 */
adminRoute.post(
    "/toggle-ban",
    authMiddleware,
    roleMiddleware(RoleAdmin.ADMIN),
    clearCacheAfterSuccess("accounts-admin"),
    toggleBanUserController
);

/**
 * @swagger
 * /api/v1/admin/create-deck:
 *   post:
 *     summary: Create deck
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
 *               - name
 *               - type
 *               - mainDeckCards 
 *               - sideDeckCards
 *               - extraDeckCards 
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hello
 *               type:
 *                 type: string
 *                 example: DEFAULT
 *               mainDeckCards:
 *                 type: array
 *                 example: []
 *               sideDeckCards:
 *                 type: array
 *                 example: []
 *               extraDeckCards:
 *                 type: array
 *                 example: []  
 *     responses:
 *       200:
 *         description: Toggle ban successfully
 */
adminRoute.post(
    "/create-deck",
    authMiddleware,
    roleMiddleware(RoleAdmin.ADMIN),
    createDeckController
);

export default adminRoute;