import { createClient } from "redis";
import env from "./env";

console.log(env.NODE_ENV);


const redisClient = createClient({
    ...(env.NODE_ENV === "development" && {
        username: process.env.REDIS_USERNAME || "default",
    }),
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
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