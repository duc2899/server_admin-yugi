import mongoose from "mongoose";
import { ENV } from "./env";
export const connectDB = async (): Promise<void> => {
    try {
        const uri = ENV.MONGO_URI;

        await mongoose.connect(uri);

        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
};
