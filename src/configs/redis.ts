import { createClient } from "redis";
import env from "./env";

const redisClient = createClient({
    ...(env.NODE_ENV === "development" && {
        username: env.REDIS_USERNAME || "default",
    }),
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST || "127.0.0.1",
        port: env.REDIS_PORT
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