"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureGracefulShutdown = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configureGracefulShutdown = (server) => {
    const signals = ["SIGTERM", "SIGINT"];
    signals.forEach(signal => {
        process.on(signal, () => {
            console.log(`\n${signal} signal received. Shutting down gracefully...`);
            server.close(async (err) => {
                if (err) {
                    console.error("Error during server close:", err);
                    process.exit(1);
                }
                console.log("HTTP server closed.");
                await mongoose_1.default.connection.close();
                console.log("Database connection closed.");
                // Add additional cleanup logic here (e.g., closing database connections)
                process.exit(0);
            });
            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error("Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 10000);
        });
    });
};
exports.configureGracefulShutdown = configureGracefulShutdown;
