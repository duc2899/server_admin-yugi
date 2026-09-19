// db.ts
import mongoose, { Connection } from "mongoose";
import env from "./env";
import { DataEnv } from "../types/common";

const buildUri = (dbName: string) =>
    `mongodb://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}/${dbName}?authSource=admin`;

export const adminConnection: Connection = mongoose.createConnection(buildUri(env.MONGO_DB_ADMIN));
export const liveConnection: Connection = mongoose.createConnection(buildUri(env.MONGO_DB_LIVE));
export const devConnection: Connection = mongoose.createConnection(buildUri(env.MONGO_DB_DEV));

export const getDataConnection = (dataEnv: DataEnv): Connection =>
    dataEnv === "dev" ? devConnection : liveConnection;

export const connectDB = async (): Promise<void> => {
    try {
        await Promise.all([
            adminConnection.asPromise(),
            liveConnection.asPromise(),
            devConnection.asPromise(),
        ]);
        console.log("✅ MongoDB connected: admin, live (yugi), dev (yugi_dev)");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
};