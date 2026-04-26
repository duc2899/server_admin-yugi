import { LogAction, TargetType } from "../constants/activityLog..constant";

export interface CreateLogPayload {
    userId: string; // truyền string id vào cho safe
    username?: string
    action: LogAction;
    targetType?: TargetType;
    targetId?: string;
    targetName?: string;
    message: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

export interface GetLogPayload {
    action?: string;
    page: number;
    limit: number;
}
