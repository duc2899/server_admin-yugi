import ActivityLog from "../models/activityLog";
import { CreateLogPayload, GetLogPayload } from "../types/activityLog";


const createActivityLogService = async (payload: CreateLogPayload) => {
    try {
        await ActivityLog.create(payload);
        return true;
    } catch (error) {
        console.log("CREATE LOG ERROR:", error);
        return false; // log fail thì không nên làm fail API chính
    }
};

const getActivityLogsService = async ({
    action,
    page,
    limit,
}: GetLogPayload) => {
    const query: any = {};

    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
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