import mongoose from "mongoose";
import env from "./env";

export const connectDB = async (): Promise<void> => {
    try {
        const uri = env.DATABASE_URL

        await mongoose.connect(uri);

        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
};
