// db.ts
import mongoose, { Connection, ConnectOptions } from "mongoose";
import env from "./env";
import { DataEnv } from "../types/common";

const buildUri = (dbName: string) =>
    `mongodb://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}/${dbName}?authSource=admin`;

const connectionOptions: ConnectOptions = {
    serverSelectionTimeoutMS: 15000, // đủ cho remote server qua internet, không nên để 5s
    socketTimeoutMS: 45000,
    maxIdleTimeMS: 4 * 60 * 1000,
};
export const adminConnection: Connection = mongoose.createConnection(buildUri(env.MONGO_DB_ADMIN), connectionOptions);
export const liveConnection: Connection = mongoose.createConnection(buildUri(env.MONGO_DB_LIVE), connectionOptions);
export const devConnection: Connection = mongoose.createConnection(buildUri(env.MONGO_DB_DEV), connectionOptions);

export const getDataConnection = (dataEnv: DataEnv): Connection =>
    dataEnv === "dev" ? devConnection : liveConnection;

// Giữ connection "nóng" — ping định kỳ, tránh bị hạ tầng mạng âm thầm đóng do idle
const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 phút, ngắn hơn hầu hết ngưỡng idle timeout phổ biến (5-10 phút)

const startKeepAlive = (connection: Connection, label: string) => {
    setInterval(async () => {
        try {
            await connection.db?.admin().ping();
        } catch (err) {
            console.error(`Keep-alive ping failed for ${label}:`, (err as Error).message);
        }
    }, KEEP_ALIVE_INTERVAL);
};

const connectionsWithLabel: [Connection, string][] = [
    [adminConnection, "admin"],
    [liveConnection, "live"],
    [devConnection, "dev"],
];

// Log khi connection rớt/khôi phục — hữu ích khi debug lỗi timeout lần đầu
connectionsWithLabel.forEach(([conn, label]) => {
    conn.on("disconnected", () => console.warn(`⚠️ ${label} DB disconnected`));
    conn.on("reconnected", () => console.log(`✅ ${label} DB reconnected`));
    conn.on("error", (err) => console.error(`❌ ${label} DB error:`, err.message));
});

export const connectDB = async (): Promise<void> => {
    try {
        await Promise.all(connectionsWithLabel.map(([conn]) => conn.asPromise()));
        console.log("✅ MongoDB connected: admin, live (yugi), dev (yugi_dev)");

        connectionsWithLabel.forEach(([conn, label]) => startKeepAlive(conn, label));
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
};