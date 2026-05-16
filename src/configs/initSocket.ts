import { io } from "../server"
import { RedisService } from "../services/redis.service"

export function initSocket() {
    io.on('connection', async (socket) => {
        const userId = socket.handshake.auth.userId as string

        if (!userId) return

        await RedisService.set(`socket:${userId}`, socket.id, 60 * 60 * 24) // 24h

        socket.on('disconnect', async () => {
            await RedisService.del(`socket:${userId}`)
        })
    })
}