"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    password: "56c51811f6915d84df940c17047fd37e",
    socket: {
        host: "127.0.0.1",
        port: 9379,
    },
});
redisClient.on("connect", () => {
    console.log("✅ Redis connected");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
exports.connectRedis = connectRedis;
exports.default = redisClient;
