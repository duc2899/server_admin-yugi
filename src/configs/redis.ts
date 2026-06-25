import { createClient } from "redis";

const redisClient = createClient({
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

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export default redisClient;