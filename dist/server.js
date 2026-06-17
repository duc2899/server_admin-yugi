"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./configs/db");
const security_1 = require("./configs/security");
const env_1 = __importDefault(require("./configs/env"));
const errorHandeler_1 = __importDefault(require("./middlewares/errorHandeler"));
const index_1 = __importDefault(require("./routes/index"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const shutdown_1 = require("./utils/shutdown");
const logger_1 = require("./utils/logger");
const redis_1 = __importDefault(require("./configs/redis"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// setup middleware security
(0, security_1.setupSecurity)(app);
// connect mongo
(0, db_1.connectDB)();
// connect redis
redis_1.default.connect();
// setup routes
app.use("/api/v1", index_1.default);
// setup error handler
app.use(errorHandeler_1.default);
server.listen(env_1.default.PORT, () => {
    logger_1.logger.info("Server started");
    console.log(`🚀 Server running on port ${env_1.default.PORT}`);
});
(0, shutdown_1.configureGracefulShutdown)(server);
