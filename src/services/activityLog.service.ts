import ActivityLog from "../models/activityLog";
import { CreateLogPayload, GetLogPayload } from "../types/activityLog";


const createActivityLogService = async (payload: CreateLogPayload) => {
    try {
        await ActivityLog.create(payload);
        return true;
    } catch (error) {
        return false; // log fail thì không nên làm fail API chính
    }
};

const getActivityLogsService = async ({
    action,
    userId,
    page,
    limit,
}: GetLogPayload) => {
    const query: any = {};

    if (action) query.action = action;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        ActivityLog.find(query).sort({ createdAt: -1 }).select("-metadata").skip(skip).limit(limit).populate("userId", 'username').lean(),
        ActivityLog.countDocuments(query),
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

}

export { createActivityLogService, getActivityLogsService }