import { z } from "zod";
import { LogAction } from "../constants/activityLog..constant";

export const getActivityLogSchema = z.object({
    action: z.enum(LogAction).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    userId: z.string().optional()
});
