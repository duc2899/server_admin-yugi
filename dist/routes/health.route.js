"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
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
router.get("/", health_controller_1.healthCheck);
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
router.get("/detailed", health_controller_1.detailedHealthCheck);
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
router.get("/db", health_controller_1.checkDBHealth);
exports.default = router;
