"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const activityLog__constant_1 = require("../constants/activityLog..constant");
const ActivityLogSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    username: { type: String },
    action: { type: String, enum: activityLog__constant_1.LOG_ACTIONS, required: true },
    targetType: { type: String, enum: activityLog__constant_1.TARGET_TYPES },
    targetId: { type: String },
    targetName: { type: String },
    message: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, {
    timestamps: true,
});
// TTL auto delete logs sau 90 ngày
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });
// index để query nhanh theo user
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
const ActivityLog = mongoose_1.default.model("activity_logs", ActivityLogSchema, "activity_logs");
exports.default = ActivityLog;
