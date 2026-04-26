import type { Response, NextFunction, Request } from "express";

import { ApiResponse } from "../utils/api-response";
import { getActivityLogsService } from "../services/activityLog.service";
import { getActivityLogSchema } from "../schemas/activityLogSchema";

const getActivityLogsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = getActivityLogSchema.parse(req.query);
        const data = await getActivityLogsService(parsed);

        ApiResponse.ok(res, "Get logs successfully", data)
    } catch (error) {
        next(error);
    }
};

export { getActivityLogsController };