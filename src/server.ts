import http from "http";
import express from "express";
import { connectDB } from "./configs/db";
import { setupSecurity } from "./configs/security";
import env from "./configs/env";
import errorHandler from "./middlewares/errorHandeler";
import initRouter from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import { configureGracefulShutdown } from "./utils/shutdown";
import { logger } from "./utils/logger";
import connectRedis from "./configs/redis";


const app = express();
const server = http.createServer(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// setup middleware security
setupSecurity(app);

// connect mongo
connectDB();

// connect redis
connectRedis.connect();

// setup routes
app.use("/api/v1", initRouter);

// setup error handler
app.use(errorHandler);

server.listen(env.PORT, () => {
    logger.info("Server started");
    console.log(`🚀 Server running on port ${env.PORT}`);
});

configureGracefulShutdown(server)
