import mongoose, { Schema } from "mongoose";
import { LOG_ACTIONS, LogAction, TARGET_TYPES, TargetType } from "../constants/activityLog..constant";


export interface IActivityLog {
    _id: mongoose.Types.ObjectId;
    userId: string; // id user theo hệ java (long)
    username?: string;
    action: LogAction;
    targetType?: TargetType;
    targetId?: string; // deckId / userId / ...
    targetName?: string;
    message: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
    {
        userId: { type: String, required: true },
        username: { type: String },
        action: { type: String, enum: LOG_ACTIONS, required: true },
        targetType: { type: String, enum: TARGET_TYPES },
        targetId: { type: String },
        targetName: { type: String },
        message: { type: String, required: true },
        ip: { type: String },
        userAgent: { type: String },
        metadata: { type: Schema.Types.Mixed },
    },
    {
        timestamps: true,
    }
);

// TTL auto delete logs sau 90 ngày
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

// index để query nhanh theo user
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog = mongoose.model<IActivityLog>(
    "activity_logs",
    ActivityLogSchema,
    "activity_logs"
);

export default ActivityLog;