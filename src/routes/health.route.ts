import { Router } from "express";
import { healthCheck, detailedHealthCheck, checkDBHealth } from "../controllers/health.controller";
 
const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Check health
 *     tags: [Health Server]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", healthCheck);

/**
 * @swagger
 * /api/v1/health/detailed:
 *   get:
 *     summary: Detailed health
 *     tags: [Health Server]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/detailed", detailedHealthCheck);


/**
 * @swagger
 * /api/v1/health/db:
 *   get:
 *     summary: DB health
 *     tags: [Health Server]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/db", checkDBHealth);
 
export default router;