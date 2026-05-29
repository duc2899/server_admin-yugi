"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const server_1 = require("../server");
const redis_service_1 = require("../services/redis.service");
function initSocket() {
    server_1.io.on('connection', async (socket) => {
        const userId = socket.handshake.auth.userId;
        if (!userId)
            return;
        await redis_service_1.RedisService.set(`socket:${userId}`, socket.id, 60 * 60 * 24); // 24h
        socket.on('disconnect', async () => {
            await redis_service_1.RedisService.del(`socket:${userId}`);
        });
    });
}
